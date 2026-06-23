import { isTauri } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { useRouter } from "@tanstack/react-router"
import { onOpenUrl } from "@tauri-apps/plugin-deep-link"
import { useAsyncEffect } from "ahooks"

// Component
export function DeepLink() {
  // Router
  const router = useRouter()

  // Handle deep links
  useAsyncEffect(async () => {
    if (!isTauri) {
      return
    }

    onOpenUrl((urls) => {
      const [rawUrl] = urls

      if (!rawUrl) {
        return
      }

      try {
        const parsed = new URL(rawUrl)

        const to = parsed.pathname
        const search = parsed.searchParams.toString()
        const hash = parsed.hash

        const href = to + (search ? `?${search}` : "") + hash

        router.navigate({ href })
      } catch (err) {
        console.error("Failed to handle deep link:", err)
      }
    })
  }, [])

  return null
}
