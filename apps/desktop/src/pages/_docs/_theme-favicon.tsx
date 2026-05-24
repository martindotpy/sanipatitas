import { Favicon } from "@sanipatitas/desktop/core/components/atoms/favicon"
import { ThemeProvider } from "next-themes"

// Component
export function ThemeFavicon() {
  return (
    <ThemeProvider attribute="class">
      <Favicon className="size-4" />
    </ThemeProvider>
  )
}
