import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import { displayRole } from "@sanipatitas/desktop/auth/display/display-role"
import { useUser } from "@sanipatitas/desktop/auth/hook/use-user"
import { invalidateSessionQuery } from "@sanipatitas/desktop/auth/query/session-query"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
import { ControlledPasswordInput } from "@sanipatitas/ui/components/form/controlled/controlled-password-input"
import { Section } from "@sanipatitas/ui/components/organisms/section"
import { Button } from "@sanipatitas/ui/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@sanipatitas/ui/components/ui/card"
import { FieldGroup } from "@sanipatitas/ui/components/ui/field"
import { Separator } from "@sanipatitas/ui/components/ui/separator"
import { H2 } from "@sanipatitas/ui/components/ui/typography"
import { Muted } from "@sanipatitas/ui/components/ui/typography/muted"
import { useForm } from "react-hook-form"
import { TbLoader2 } from "react-icons/tb"
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

// Component
export function ProfileSection() {
  const user = useUser()

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      lastName: user.lastName ?? "",
    },
  })

  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
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
        authClient.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword }, { throw: true }),
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
      <div>
        <H2>Mi Perfil</H2>
        <Muted>Gestiona tu información personal y contraseña.</Muted>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">Nombre completo</p>
                  <p className="text-sm">
                    {user.name} {user.lastName}
                  </p>
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">Correo electrónico</p>
                  <p className="text-sm">{user.email}</p>
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">Rol</p>
                  <p className="text-sm">{displayRole(user.role ?? "")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
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
                  <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                    {profileForm.formState.isSubmitting ? (
                      <>
                        <TbLoader2 className="size-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar cambios"
                    )}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>Actualiza tu contraseña de acceso.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onPasswordSubmit}>
                <FieldGroup>
                  <ControlledPasswordInput
                    control={passwordForm.control}
                    name="currentPassword"
                    label="Contraseña actual"
                    inputProps={{ placeholder: "Contraseña actual", autoComplete: "current-password" }}
                  />
                  <ControlledPasswordInput
                    control={passwordForm.control}
                    name="newPassword"
                    label="Nueva contraseña"
                    inputProps={{ placeholder: "Nueva contraseña", autoComplete: "new-password" }}
                  />
                  <ControlledPasswordInput
                    control={passwordForm.control}
                    name="confirmNewPassword"
                    label="Confirmar nueva contraseña"
                    inputProps={{ placeholder: "Confirmar contraseña", autoComplete: "new-password" }}
                  />
                  <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                    {passwordForm.formState.isSubmitting ? (
                      <>
                        <TbLoader2 className="size-4 animate-spin" />
                        Cambiando...
                      </>
                    ) : (
                      "Cambiar contraseña"
                    )}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  )
}
