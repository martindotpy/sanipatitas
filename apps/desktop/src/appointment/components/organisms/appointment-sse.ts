import { useJwt } from "@sanipatitas/desktop/auth/store/jwt-store"
import { useNotificationPreferences } from "@sanipatitas/desktop/notification/store/notification-preferences-store"
import { getApiAppointmentEvents } from "@sanipatitas/shared/api/client/sdk.gen"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

// SSE hook
export function useAppointmentSSE() {
  const token = useJwt()
  const [preferences] = useNotificationPreferences()
  const queryClient = useQueryClient()
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Skip if SSE updates are disabled in preferences
    if (!token || !preferences.sseUpdates) return

    const controller = new AbortController()
    abortRef.current = controller

    let cancelled = false

    const start = async () => {
      const { stream } = await getApiAppointmentEvents({
        signal: controller.signal,
        onSseError: (error) => {
          console.error("SSE error:", error)
        },
      })

      try {
        for await (const _event of stream) {
          if (cancelled) break

          queryClient.invalidateQueries({
            predicate: (query) => {
              const key = query.queryKey[0] as { _id?: string } | undefined
              return key?._id === "getApiAppointment"
            },
          })
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
