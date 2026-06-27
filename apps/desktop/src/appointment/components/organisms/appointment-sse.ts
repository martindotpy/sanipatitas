import { useJwt } from "@sanipatitas/desktop/auth/store/jwt-store"
import { client } from "@sanipatitas/shared/api/client/client.gen"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export function useAppointmentSSE() {
  const token = useJwt()
  const queryClient = useQueryClient()
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!token) return

    const controller = new AbortController()
    abortRef.current = controller

    let cancelled = false

    const start = async () => {
      const { stream } = await client.sse.get({
        url: "/api/appointment/events",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
        onSseError: (error) => {
          console.error("SSE error:", error)
        },
      })

      try {
        for await (const _event of stream) {
          if (cancelled) break
          queryClient.invalidateQueries({ queryKey: ["getApiAppointment"] })
        }
      } catch (error) {
        if (!cancelled) console.error("SSE stream error:", error)
      }
    }

    start()

    return () => {
      cancelled = true
      controller.abort()
      abortRef.current = null
    }
  }, [queryClient, token])
}
