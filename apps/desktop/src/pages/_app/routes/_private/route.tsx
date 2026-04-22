import { isSsr } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

// Private layout
export const Route = createFileRoute("/_private")({
  beforeLoad: ({ context, location }) => {
    if (isSsr) return null

    // Redirect to public routes if is not authenticated
    if (!context.auth) {
      const redirectTo = location.href === "/" ? undefined : location.href

      throw redirect({ to: "/sign-in", search: { redirectTo } })
    }

    return { auth: context.auth }
  },
  component: PrivateLayoutComponent,
})

function PrivateLayoutComponent() {
  return <Outlet />
}
