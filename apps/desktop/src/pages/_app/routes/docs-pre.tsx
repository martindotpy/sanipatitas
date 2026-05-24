import { publicBaseUrl } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { isProd } from "@sanipatitas/shared/app-context"
import { $ } from "@sanipatitas/ui/lib/dom-selector"
import { ApiReferenceReact } from "@scalar/api-reference-react"
import "@scalar/api-reference-react/style.css"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { useTheme } from "next-themes"
import { useEffect } from "react"

// Route
export const Route = createFileRoute("/docs-pre")({
  beforeLoad: async () => {
    if (isProd) {
      throw notFound()
    }
  },
  component: DocsComponent,
})

function DocsComponent() {
  // Add space for button
  useEffect(() => {
    const $draggableDiv = $<HTMLElement>("#draggable-header")

    if (!$draggableDiv) {
      return
    }

    $draggableDiv.classList.add("ml-26")
    $draggableDiv.classList.add("macos:ml-46")

    return () => {
      $draggableDiv.classList.remove("ml-26")
      $draggableDiv.classList.remove("macos:ml-46")
    }
  }, [])

  // Theme
  const { resolvedTheme } = useTheme()

  const isDark = resolvedTheme === "dark"

  return (
    <ApiReferenceReact
      configuration={{
        theme: "deepSpace",
        sources: [
          {
            title: "Auth",
            url: `${publicBaseUrl ?? ""}/api/auth/openapi.json`,
          },
          {
            title: "Patient",
            url: `${publicBaseUrl ?? ""}/api/patient/openapi.json`,
          },
          {
            title: "Appointment",
            url: `${publicBaseUrl ?? ""}/api/appointment/openapi.json`,
          },
        ],
        darkMode: isDark,
        mcp: {
          disabled: true,
        },
        telemetry: false,
        hideDarkModeToggle: true,
        showDeveloperTools: "never",
        operationsSorter: (a, b) => {
          const methodOrder = ["get", "post", "patch", "put", "delete"]
          const methodComparison =
            methodOrder.indexOf(a.method) - methodOrder.indexOf(b.method)

          if (methodComparison !== 0) {
            return methodComparison
          }

          return a.path.localeCompare(b.path)
        },
      }}
    />
  )
}
