import LightFavicon from "@sanipatitas/ui/assets/svg/favicon-light.svg?react"
import DarkFavicon from "@sanipatitas/ui/assets/svg/favicon.svg?react"
import { ClientOnly } from "@tanstack/react-router"
import { useTheme } from "next-themes"

// Component
type FaviconProps = React.ComponentProps<typeof DarkFavicon>

export function Favicon(props: FaviconProps) {
  // Theme
  const { resolvedTheme } = useTheme()

  return (
    <ClientOnly fallback={<LightFavicon {...props} />}>
      {resolvedTheme === "dark" ? (
        <LightFavicon {...props} />
      ) : (
        <DarkFavicon {...props} />
      )}
    </ClientOnly>
  )
}
