import { useNotificationPreferences } from "@sanipatitas/desktop/notification/store/notification-preferences-store"
import { requestNotificationPermission } from "@sanipatitas/desktop/core/utils/notify"
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
  { value: 5, label: "5 minutos antes" },
  { value: 10, label: "10 minutos antes" },
  { value: 15, label: "15 minutos antes" },
  { value: 30, label: "30 minutos antes" },
  { value: 60, label: "1 hora antes" },
]

// Component
export function NotificationPreferencesCard() {
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TbBellRinging className="text-primary size-4" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Configura las notificaciones de citas y recordatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
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
                    <span className="text-muted-foreground text-xs">
                      ¿Con cuánto tiempo de anticipación deseas ser notificado?
                    </span>
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

            {/* Reset button */}
            <div className="flex justify-end border-t pt-3">
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
