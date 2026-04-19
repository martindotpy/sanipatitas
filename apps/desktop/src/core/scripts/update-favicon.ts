import faviconLight from "@sanipatitas/ui/assets/svg/favicon-light.svg?url"
import { $ } from "@sanipatitas/ui/lib/dom-selector"

// Update favicon
function updateFavicon() {
  // Element
  const favicon = $<HTMLLinkElement>("link[rel~='icon'][type='image/svg+xml']")

  if (!favicon) return

  // Check if user prefers dark mode
  const isDarkPrefers = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches

  if (!isDarkPrefers) return

  // Update favicon
  favicon.href = faviconLight
}

// Initialize
updateFavicon()
