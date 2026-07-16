import { useNotificationPreferences } from "@sanipatitas/desktop/notification/store/notification-preferences-store"
import { notify, requestNotificationPermission } from "@sanipatitas/desktop/core/utils/notify"
import { isTauri } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { Button } from "@sanipatitas/ui/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@sanipatitas/ui/components/ui/card"
import { Label } from "@sanipatitas/ui/components/ui/label"
import { Switch } from "@sanipatitas/ui/components/ui/switch"
import { motion } from "motion/react"
import { TbBellRinging, TbBell, TbBellOff, TbClock, TbRefresh } from "react-icons/tb"
import { toast } from "sonner"

// Reminder window options in minutes
const REMINDER_OPTIONS = [
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "1 h" },
]

// Types
type NotificationPreferencesCardProps = {
  className?: string
}

// Component
export function NotificationPreferencesCard({ className }: NotificationPreferencesCardProps) {
  const [preferences, setPreferences] = useNotificationPreferences()

  // Request notification permission when enabling
  const handleToggleEnabled = async (enabled: boolean) => {
    if (enabled) {
      await requestNotificationPermission()

      // In browser, check if permission was actually granted
      if (!isTauri && typeof Notification !== "undefined" && Notification.permission !== "granted") {
        const message =
          Notification.permission === "denied"
            ? "Permiso de notificaciones denegado. Actívalo desde la configuración del navegador."
            : "No se pudo obtener el permiso de notificaciones. Intenta nuevamente."

        toast.error(message)

        return
      }
    }

    setPreferences((prev) => ({ ...prev, enabled }))
  }

  // Handle reminder window change
  const handleWindowChange = (minutes: number) => {
    setPreferences((prev) => ({ ...prev, reminderWindowMinutes: minutes }))

    toast.success(`Recordatorio configurado a ${minutes} minutos antes`)
  }

  // Send a test notification to verify the popup works (independent of appointments).
  // Reports each outcome via toast so the failing step is visible.
  const handleTest = async () => {
    // Tauri native path
    if (isTauri) {
      const granted = await requestNotificationPermission()

      if (!granted) {
        toast.error("Permiso de notificaciones no concedido en la app.")

        return
      }

      await notify({
        title: "Notificación de prueba 🐾",
        body: "Si ves esto, las notificaciones funcionan.",
      })

      toast.success("Notificación enviada. Si no aparece, revisa el centro de notificaciones del sistema.")

      return
    }

    // Browser path
    if (typeof Notification === "undefined") {
      toast.error("Este navegador no soporta notificaciones.")

      return
    }

    await requestNotificationPermission()

    if (Notification.permission !== "granted") {
      toast.error(
        `Permiso de notificaciones: "${Notification.permission}". Actívalo en el candado de la barra de direcciones.`,
      )

      return
    }

    try {
      new Notification("Notificación de prueba 🐾", {
        body: "Si ves esto, las notificaciones funcionan.",
      })

      toast.success("Notificación enviada. Si no aparece, revisa las notificaciones de Windows / del navegador.")
    } catch (error) {
      toast.error(`No se pudo mostrar la notificación: ${String(error)}`)
    }
  }

  // Reset to defaults
  const handleReset = () => {
    setPreferences({
      enabled: true,
      reminderWindowMinutes: 15,
      upcomingNotifications: true,
      sseUpdates: true,
    })

    toast.success("Notificaciones restablecidas a valores predeterminados")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
      className={className}
    >
      <Card className="flex h-full flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <TbBellRinging className="text-primary size-4" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Citas y recordatorios.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4">
            {/* Master toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {preferences.enabled ? (
                  <TbBell className="text-primary size-4" />
                ) : (
                  <TbBellOff className="text-muted-foreground size-4" />
                )}
                <div className="flex flex-col">
                  <Label htmlFor="notifications-enabled" className="text-sm font-medium">
                    Notificaciones
                  </Label>
                  <span className="text-muted-foreground text-xs">
                    {preferences.enabled
                      ? "Recibirás notificaciones de citas próximas"
                      : "Notificaciones desactivadas"}
                  </span>
                </div>
              </div>
              <Switch
                id="notifications-enabled"
                checked={preferences.enabled}
                onCheckedChange={(checked: boolean) => handleToggleEnabled(checked)}
              />
            </div>

            {/* Sub-options (only shown when enabled) */}
            {preferences.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-4 border-t pt-4"
              >
                {/* Upcoming appointment notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TbBell className="text-primary size-4" />
                    <div className="flex flex-col">
                      <Label htmlFor="upcoming-notifications" className="text-sm font-medium">
                        Citas próximas
                      </Label>
                      <span className="text-muted-foreground text-xs">
                        Notificar cuando una cita esté por comenzar
                      </span>
                    </div>
                  </div>
                  <Switch
                    id="upcoming-notifications"
                    checked={preferences.upcomingNotifications}
                    onCheckedChange={(checked: boolean) =>
                      setPreferences((prev) => ({ ...prev, upcomingNotifications: checked }))
                    }
                  />
                </div>

                {/* SSE real-time updates */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TbRefresh className="text-primary size-4" />
                    <div className="flex flex-col">
                      <Label htmlFor="sse-updates" className="text-sm font-medium">
                        Actualizaciones en tiempo real
                      </Label>
                      <span className="text-muted-foreground text-xs">
                        Refrescar automáticamente cuando haya cambios
                      </span>
                    </div>
                  </div>
                  <Switch
                    id="sse-updates"
                    checked={preferences.sseUpdates}
                    onCheckedChange={(checked: boolean) =>
                      setPreferences((prev) => ({ ...prev, sseUpdates: checked }))
                    }
                  />
                </div>

                {/* Reminder window selector */}
                <div className="flex items-start gap-2">
                  <TbClock className="text-primary mt-0.5 size-4 shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium">Ventana de recordatorio</Label>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {REMINDER_OPTIONS.map((opt) => (
                        <Button
                          key={opt.value}
                          type="button"
                          variant={
                            preferences.reminderWindowMinutes === opt.value
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="cursor-pointer text-xs"
                          onClick={() => handleWindowChange(opt.value)}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="mt-auto flex justify-end gap-2 border-t pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={handleTest}
              >
                <TbBellRinging className="size-3.5" />
                Probar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground cursor-pointer"
                onClick={handleReset}
              >
                <TbBellOff className="size-3.5" />
                Restablecer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
