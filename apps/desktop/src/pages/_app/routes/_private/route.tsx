import { isSsr } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

// Private layout
export const Route = createFileRoute("/_private")({
  beforeLoad: ({ context }) => {
    if (isSsr) return null

    // Redirect to public routes if is not authenticated
    if (!context.auth) throw redirect({ to: "/login" })
  },
  component: PrivateLayoutComponent,
})

function PrivateLayoutComponent() {
  return <Outlet />
}
