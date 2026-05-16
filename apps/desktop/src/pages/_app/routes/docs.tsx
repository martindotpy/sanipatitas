import { isProd } from "@sanipatitas/shared/app-context"
import { ApiReferenceReact } from "@scalar/api-reference-react"
import "@scalar/api-reference-react/style.css"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { useTheme } from "next-themes"

// Route
export const Route = createFileRoute("/docs")({
  beforeLoad: async () => {
    if (isProd) {
      throw notFound()
    }
  },
  component: DocsComponent,
})

function DocsComponent() {
  // Theme
  const { resolvedTheme } = useTheme()

  const isDark = resolvedTheme === "dark"

  return (
    <ApiReferenceReact
      configuration={{
        theme: "deepSpace",
        sources: [
          {
            title: "Core",
            url: "/api/core/openapi.json",
          },
          {
            title: "Auth",
            url: "/api/auth/openapi.json",
          },
        ],
        darkMode: isDark,
        telemetry: false,
        hideDarkModeToggle: true,
        showDeveloperTools: "never",
      }}
    />
  )
}
