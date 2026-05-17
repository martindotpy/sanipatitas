import { isTauri } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { log } from "@sanipatitas/shared/log/client-logger"
import { useRouter } from "@tanstack/react-router"
import { useEffect } from "react"

// Component
export function DeepLinkHandler() {
  // Router
  const router = useRouter()

  useEffect(() => {
    if (!isTauri) {
      return
    }

    let unlisten: (() => void) | undefined
    ;(async () => {
      const { onOpenUrl } = await import("@tauri-apps/plugin-deep-link")

      unlisten = await onOpenUrl((urls) => {
        urls.forEach((url) => {
          try {
            const parsed = new URL(url)

            const to = parsed.pathname
            const search = Object.fromEntries(parsed.searchParams.entries())
            const hash = parsed.hash

            router.navigate({ to, search, hash })
          } catch (error) {
            log.error("Failed to handle deep link:", error)
          }
        })
      })
    })()

    return () => {
      unlisten?.()
    }
  }, [router])

  return null
}
