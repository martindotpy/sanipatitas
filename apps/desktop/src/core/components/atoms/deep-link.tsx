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

        // For custom-scheme URLs (sanipatitas://patient/{uuid}) the first segment
        // ("patient") is the URL host, not part of the pathname. Re-join it so the
        // target route is /patient/{uuid} instead of just /{uuid}.
        const to = parsed.host
          ? `/${parsed.host}${parsed.pathname}`
          : parsed.pathname
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
