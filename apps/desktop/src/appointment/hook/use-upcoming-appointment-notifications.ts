import { notify } from "@sanipatitas/desktop/core/utils/notify"
import { useNotificationPreferences } from "@sanipatitas/desktop/notification/store/notification-preferences-store"
import { getApiAppointmentOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import type { OpenapiAppointmentDto } from "@sanipatitas/shared/api/client/types.gen"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

// Local date (YYYY-MM-DD) — avoids the UTC shift of toISOString in negative-UTC zones
function toLocalDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

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
  const [preferences] = useNotificationPreferences()
  const notifiedRef = useRef<Set<string>>(new Set())

  // Own query, fixed to today→tomorrow, independent of the calendar's month range.
  // Range covers reminders that cross midnight.
  const now = new Date()
  const today = toLocalDate(now)
  const tomorrowDate = new Date(now)
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrow = toLocalDate(tomorrowDate)

  // refetchInterval keeps today's appointments fresh without a manual reload
  // (so newly created/edited appointments are picked up even if SSE drops).
  const query = useQuery({
    ...getApiAppointmentOptions({
      query: { from: today, to: tomorrow, size: 200 },
    }),
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
  })

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

      const body = `${a.patient.name} a las ${formatTime(a.startTime)}`

      // Native OS notification (depends on OS/browser settings)
      notify({ title: "Cita por comenzar", body })

      // In-app popup — always visible, independent of OS notification settings
      toast("Cita por comenzar", { description: body })
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

  // Reset the notified set only when the day changes (not on every refetch),
  // so a data refresh doesn't re-notify appointments already announced.
  useEffect(() => {
    notifiedRef.current.clear()
  }, [today])
}
