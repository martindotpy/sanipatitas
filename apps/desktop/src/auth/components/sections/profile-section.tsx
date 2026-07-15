import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import { displayRole } from "@sanipatitas/desktop/auth/display/display-role"
import { useUser } from "@sanipatitas/desktop/auth/hook/use-user"
import { invalidateSessionQuery } from "@sanipatitas/desktop/auth/query/session-query"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
import { ControlledPasswordInput } from "@sanipatitas/ui/components/form/controlled/controlled-password-input"
import { Section } from "@sanipatitas/ui/components/organisms/section"
import { Avatar, AvatarFallback, AvatarImage } from "@sanipatitas/ui/components/ui/avatar"
import { Badge } from "@sanipatitas/ui/components/ui/badge"
import { Button } from "@sanipatitas/ui/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@sanipatitas/ui/components/ui/card"
import { FieldGroup } from "@sanipatitas/ui/components/ui/field"
import { NotificationPreferencesCard } from "@sanipatitas/desktop/notification/components/notification-preferences-card"
import { H2, Muted } from "@sanipatitas/ui/components/ui/typography"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "motion/react"
import { useForm } from "react-hook-form"
import {
  TbCamera,
  TbCheck,
  TbDeviceDesktop,
  TbLoader2,
  TbLogout,
  TbMail,
  TbShieldLock,
  TbSmartHome,
  TbUser,
  TbUsers,
} from "react-icons/tb"
import { toast } from "sonner"
import { z } from "zod"

// Schemas
const ProfileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
})

const PasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    newPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmNewPassword"],
  })

// Animated card wrapper
function AnimatedCard({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <Card className={className}>{children}</Card>
    </motion.div>
  )
}

// Avatar with upload area
function AvatarSection() {
  const user = useUser()

  const initials = `${user.name?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
  const fullName = `${user.name ?? ""} ${user.lastName ?? ""}`.trim()

  return (
    <AnimatedCard delay={0}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TbUser className="text-primary size-4" />
          Foto de perfil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="group relative shrink-0"
          >
            <Avatar className="size-20 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              <AvatarImage src={user.image ?? undefined} alt={fullName} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {initials || "?"}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => {
                toast.info("Función de subir foto próximamente disponible")
              }}
            >
              <TbCamera className="size-6 text-white" />
            </button>
          </motion.div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">{fullName}</p>
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <TbMail className="size-3.5" />
              {user.email}
            </p>
            <Badge variant="secondary" className="mt-1 w-fit text-[10px] uppercase tracking-wider">
              <TbUsers className="mr-1 size-3" />
              {displayRole(user.role ?? "")}
            </Badge>
          </div>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}

// Session card
function SessionCard({
  session,
  isCurrent,
  onRevoke,
}: {
  session: { id: string; createdAt: Date; userAgent?: string; ipAddress?: string }
  isCurrent: boolean
  onRevoke: (id: string) => void
}) {
  const [isRevoking, setIsRevoking] = React.useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10, height: 0 }}
      className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${isCurrent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
          {isCurrent ? <TbSmartHome className="size-4" /> : <TbDeviceDesktop className="size-4" />}
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {isCurrent ? "Esta sesión" : session.userAgent?.slice(0, 40) ?? "Sesión desconocida"}
            </span>
            {isCurrent && (
              <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400">
                <span className="bg-emerald-500 mr-1 inline-block size-1.5 animate-pulse rounded-full" />
                Activa
              </Badge>
            )}
          </div>
          <span className="text-muted-foreground text-xs">
            {new Date(session.createdAt).toLocaleDateString("es-PE", {
              dateStyle: "medium",
            })}
            {session.ipAddress && ` · ${session.ipAddress}`}
          </span>
        </div>
      </div>
      {!isCurrent && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
          disabled={isRevoking}
          onClick={async () => {
            setIsRevoking(true)
            await onRevoke(session.id)
            setIsRevoking(false)
          }}
        >
          {isRevoking ? (
            <TbLoader2 className="size-4 animate-spin" />
          ) : (
            <TbLogout className="size-4" />
          )}
        </Button>
      )}
    </motion.div>
  )
}

// Sessions section
function SessionsSection() {
  const sessionsQuery = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const result = await authClient.listSessions()
      return (result.data ?? []) as Array<{ id: string; token: string; createdAt: Date; userAgent?: string; ipAddress?: string }>
    },
    refetchInterval: 30_000,
  })

  const handleRevoke = async (sessionToken: string) => {
    await toast
      .promise(authClient.revokeSession({ token: sessionToken } as never).then(() => sessionsQuery.refetch()), {
        loading: "Revocando sesión...",
        success: "Sesión revocada correctamente",
        error: "Error al revocar la sesión",
      })
      .unwrap()
  }

  const sessions = sessionsQuery.data ?? []

  return (
    <AnimatedCard delay={0.3}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TbShieldLock className="text-primary size-4" />
          Sesiones activas
        </CardTitle>
        <CardDescription>Administra tus sesiones de inicio de sesión activas.</CardDescription>
      </CardHeader>
      <CardContent>
        {sessionsQuery.isLoading ? (
          <div className="flex items-center justify-center py-6">
            <TbLoader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">No hay sesiones activas</p>
        ) : (
          <AnimatePresence>
            <div className="flex flex-col gap-2">
              {sessions.map((session, i) => (
                <SessionCard
                  key={session.id}
                  session={{
                    id: session.id,
                    createdAt: new Date(session.createdAt ?? Date.now()),
                    userAgent: (session as { userAgent?: string }).userAgent,
                    ipAddress: (session as { ipAddress?: string }).ipAddress,
                  }}
                  isCurrent={i === 0}
                  onRevoke={() => handleRevoke(session.token)}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </CardContent>
    </AnimatedCard>
  )
}

// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
  const strength = React.useMemo(() => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }, [password])

  const labels = ["", "Débil", "Regular", "Buena", "Fuerte", "Muy fuerte"]
  const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-emerald-500"]

  if (!password) return null

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < strength ? colors[strength] : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className="text-muted-foreground mt-1 text-[10px]">{labels[strength]}</p>
    </motion.div>
  )
}

// Component
export function ProfileSection() {
  const user = useUser()

  // Password form (declared BEFORE watchedNewPassword uses it)
  const passwordForm = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  // Watch password for strength indicator
  const watchedNewPassword = passwordForm.watch("newPassword")

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      lastName: user.lastName ?? "",
    },
  })

  // Submit profile
  const onProfileSubmit = profileForm.handleSubmit(async (data) => {
    await toast
      .promise(
        authClient
          .updateUser({ name: data.name, lastName: data.lastName }, { throw: true })
          .then(() => invalidateSessionQuery()),
        {
          loading: "Guardando...",
          success: "Perfil actualizado correctamente",
          error: "Error al actualizar el perfil",
        }
      )
      .unwrap()
  })

  // Submit password
  const onPasswordSubmit = passwordForm.handleSubmit(async (data) => {
    await toast
      .promise(
        authClient.changePassword(
          { currentPassword: data.currentPassword, newPassword: data.newPassword },
          { throw: true },
        ),
        {
          loading: "Cambiando contraseña...",
          success: "Contraseña cambiada correctamente",
          error: "Error al cambiar la contraseña",
        }
      )
      .unwrap()

    passwordForm.reset()
  })

  return (
    <Section className="flex w-full min-w-0 flex-1 flex-col gap-4 p-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <H2 className="flex items-center gap-2">
          Mi Perfil
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
            className="inline-block"
          >
            <TbUser className="text-primary size-6" />
          </motion.span>
        </H2>
        <Muted>Gestiona tu información personal, seguridad y sesiones.</Muted>
      </motion.div>

      <div className="flex flex-col gap-4">
        {/* Avatar + Info row */}
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <AvatarSection />
          </div>
          <div className="flex-1">
            {/* Edit Profile */}
            <AnimatedCard delay={0.1}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TbUser className="text-primary size-4" />
                  Editar Perfil
                </CardTitle>
                <CardDescription>Actualiza tu información personal.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onProfileSubmit}>
                  <FieldGroup>
                    <ControlledInput
                      control={profileForm.control}
                      name="name"
                      label="Nombre"
                      inputProps={{ placeholder: "Tu nombre" }}
                    />
                    <ControlledInput
                      control={profileForm.control}
                      name="lastName"
                      label="Apellido"
                      inputProps={{ placeholder: "Tu apellido" }}
                    />
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          profileForm.reset({ name: user.name ?? "", lastName: user.lastName ?? "" })
                        }
                        disabled={!profileForm.formState.isDirty}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={profileForm.formState.isSubmitting || !profileForm.formState.isDirty}
                      >
                        {profileForm.formState.isSubmitting ? (
                          <>
                            <TbLoader2 className="size-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <TbCheck className="size-4" />
                            Guardar cambios
                          </>
                        )}
                      </Button>
                    </div>
                  </FieldGroup>
                </form>
              </CardContent>
            </AnimatedCard>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Notification Preferences */}
          <div className="flex-1">
            <NotificationPreferencesCard />
          </div>

          {/* Change Password */}
          <div className="flex-1">
            <AnimatedCard delay={0.2}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TbShieldLock className="text-primary size-4" />
                  Cambiar Contraseña
                </CardTitle>
                <CardDescription>Actualiza tu contraseña de acceso.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onPasswordSubmit}>
                  <FieldGroup>
                    <ControlledPasswordInput
                      control={passwordForm.control}
                      name="currentPassword"
                      label="Contraseña actual"
                      inputProps={{
                        placeholder: "Contraseña actual",
                        autoComplete: "current-password",
                      }}
                    />
                    <ControlledPasswordInput
                      control={passwordForm.control}
                      name="newPassword"
                      label="Nueva contraseña"
                      inputProps={{
                        placeholder: "Nueva contraseña",
                        autoComplete: "new-password",
                      }}
                    />
                    <PasswordStrength password={watchedNewPassword} />
                    <ControlledPasswordInput
                      control={passwordForm.control}
                      name="confirmNewPassword"
                      label="Confirmar nueva contraseña"
                      inputProps={{
                        placeholder: "Confirmar contraseña",
                        autoComplete: "new-password",
                      }}
                    />
                    <div className="flex justify-end pt-1">
                      <Button
                        type="submit"
                        size="sm"
                        disabled={passwordForm.formState.isSubmitting}
                      >
                        {passwordForm.formState.isSubmitting ? (
                          <>
                            <TbLoader2 className="size-4 animate-spin" />
                            Cambiando...
                          </>
                        ) : (
                          <>
                            <TbShieldLock className="size-4" />
                            Cambiar contraseña
                          </>
                        )}
                      </Button>
                    </div>
                  </FieldGroup>
                </form>
              </CardContent>
            </AnimatedCard>
          </div>

          {/* Sessions */}
          <div className="flex-1">
            <SessionsSection />
          </div>
        </div>
      </div>
    </Section>
  )
}
