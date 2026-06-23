import { getSession } from "@sanipatitas/desktop/auth/query/session-query"
import { useJwt } from "@sanipatitas/desktop/auth/store/jwt-store"
import { Favicon } from "@sanipatitas/desktop/core/components/atoms/favicon"
import { publicBaseUrl } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { buttonVariants } from "@sanipatitas/ui/components/ui/button"
import { $ } from "@sanipatitas/ui/lib/dom-selector"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import { ApiReferenceReact } from "@scalar/api-reference-react"
import "@scalar/api-reference-react/style.css"
import { ThemeProvider, useTheme } from "next-themes"
import { useEffect } from "react"

// Component
export function Scalar() {
  return (
    <ThemeProvider attribute="class">
      <InnerScalar />
    </ThemeProvider>
  )
}

// Inner component
function InnerScalar() {
  // Add space for button
  useEffect(() => {
    getSession()
    const $draggableDiv = $<HTMLElement>("[data-draggable-fallback]")

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

  // Token
  const jwt = useJwt()

  return (
    <>
      <a
        href={jwt ? "/" : "/sign-in"}
        className={cn(
          buttonVariants({ size: "icon-sm", variant: "ghost" }),
          "macos:left-20 fixed z-100"
        )}
      >
        <Favicon className="size-4" />
      </a>

      <ApiReferenceReact
        configuration={{
          theme: "deepSpace",
          baseServerURL: publicBaseUrl,
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
          authentication: {
            securitySchemes: { bearerAuth: { token: jwt ?? undefined } },
          },
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          fetch: (input, init) =>
            fetch(input, { ...init, credentials: "include" }),
        }}
      />
    </>
  )
}
