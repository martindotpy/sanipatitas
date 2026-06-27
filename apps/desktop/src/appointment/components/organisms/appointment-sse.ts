import { client } from "@sanipatitas/shared/api/client/client.gen"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

// Hook
export function useAppointmentSSE() {
  const queryClient = useQueryClient()
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const baseUrl = client.getConfig().baseUrl ?? ""
    const url = `${baseUrl}/api/appointment/events`
    const es = new EventSource(url)

    esRef.current = es

    es.addEventListener("message", () => {
      queryClient.invalidateQueries({ queryKey: ["getApiAppointment"] })
    })

    es.addEventListener("error", () => {
      // EventSource auto-reconnects
    })

    return () => {
      es.close()
      esRef.current = null
    }
  }, [queryClient])
}
