import { useAppointmentQuery } from "@sanipatitas/desktop/appointment/hook/use-appointment"
import { notify } from "@sanipatitas/desktop/core/utils/notify"
import { useNotificationPreferences } from "@sanipatitas/desktop/notification/store/notification-preferences-store"
import type { OpenapiAppointmentDto } from "@sanipatitas/shared/api/client/types.gen"
import { useEffect, useRef } from "react"

// Check if appointment starts within the configured window
function isUpcoming(
  appointment: OpenapiAppointmentDto,
  windowMs: number,
): boolean {
  if (appointment.status !== "SCHEDULED") return false

  const startAt = new Date(`${appointment.date}T${appointment.startTime}`)
  const now = new Date()
  const diffMs = startAt.getTime() - now.getTime()

  return diffMs > 0 && diffMs <= windowMs
}

// Format time for display (e.g., "10:30 AM")
function formatTime(time: string): string {
  const [h, m] = time.split(":")
  const hour = Number(h)
  const period = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12

  return `${displayHour}:${m} ${period}`
}

// Hook
export function useUpcomingAppointmentNotifications() {
  const query = useAppointmentQuery()
  const [preferences] = useNotificationPreferences()
  const notifiedRef = useRef<Set<string>>(new Set())

  const check = () => {
    // Skip if notifications are disabled
    if (!preferences.enabled || !preferences.upcomingNotifications) return

    const appointments = query.data?.data
    if (!appointments) return

    const windowMs = preferences.reminderWindowMinutes * 60 * 1000

    for (const a of appointments) {
      if (notifiedRef.current.has(a.id)) continue
      if (!isUpcoming(a, windowMs)) continue

      notifiedRef.current.add(a.id)

      notify({
        title: "Cita por comenzar",
        body: `${a.patient.name} a las ${formatTime(a.startTime)}`,
      })
    }
  }

  // Check when query data or preferences change
  useEffect(() => {
    check()
  }, [query.data, preferences])

  // Check every 60 seconds
  useEffect(() => {
    // Skip interval if notifications are disabled
    if (!preferences.enabled || !preferences.upcomingNotifications) return

    const interval = setInterval(check, 60_000)

    return () => clearInterval(interval)
  }, [query.data, preferences])

  // Reset notified set when data range changes
  useEffect(() => {
    notifiedRef.current.clear()
  }, [query.data])
}
