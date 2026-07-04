import { useAppointmentQuery } from "@sanipatitas/desktop/appointment/hook/use-appointment"
import { notify } from "@sanipatitas/desktop/core/utils/notify"
import type { OpenapiAppointmentDto } from "@sanipatitas/shared/api/client/types.gen"
import { useEffect, useRef } from "react"

// 15 minutes in milliseconds
const WINDOW_MS = 15 * 60 * 1000

// Check if appointment starts within the next 15 minutes
function isUpcoming(appointment: OpenapiAppointmentDto): boolean {
  if (appointment.status !== "SCHEDULED") return false

  const startAt = new Date(`${appointment.date}T${appointment.startTime}`)
  const now = new Date()
  const diffMs = startAt.getTime() - now.getTime()

  return diffMs > 0 && diffMs <= WINDOW_MS
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
  const notifiedRef = useRef<Set<string>>(new Set())

  const check = () => {
    const appointments = query.data?.data

    if (!appointments) return

    for (const a of appointments) {
      if (notifiedRef.current.has(a.id)) continue
      if (!isUpcoming(a)) continue

      notifiedRef.current.add(a.id)

      notify({
        title: "Cita por comenzar",
        body: `${a.patient.name} a las ${formatTime(a.startTime)}`,
      })
    }
  }

  // Check when query data changes
  useEffect(() => {
    check()
  }, [query.data])

  // Check every 60 seconds
  useEffect(() => {
    const interval = setInterval(check, 60_000)

    return () => clearInterval(interval)
  }, [query.data])

  // Reset notified set when month changes (new data range)
  useEffect(() => {
    notifiedRef.current.clear()
  }, [query.data])
}
