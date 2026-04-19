import { isSsr } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

// Route layout
export const Route = createFileRoute("/_public")({
  beforeLoad: ({ context }) => {
    if (isSsr) return null

    // Redirect to private routes if is authenticated
    if (context.auth) throw redirect({ to: "/" })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
