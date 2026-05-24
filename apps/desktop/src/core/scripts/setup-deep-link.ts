import { isTauri } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { log } from "@sanipatitas/shared/log/client-logger"
import { onOpenUrl } from "@tauri-apps/plugin-deep-link"

// Handle deep links when the app is running in Tauri
if (isTauri) {
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

      window.location.href = href
    } catch (err) {
      log.error("Failed to handle deep link:", err)
    }
  })
}
