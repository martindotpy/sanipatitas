import { isSsr } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { z } from "zod"

// Route layout
export const Route = createFileRoute("/_public")({
  validateSearch: z.object({
    redirectTo: z.string().optional(),
  }),
  beforeLoad: ({ context }) => {
    if (isSsr) return null

    // Redirect to private routes if is authenticated
    if (context.auth) {
      throw redirect({ to: "/", replace: true })
    }
  },
  component: PublicLayout,
})

function PublicLayout() {
  return <Outlet />
}
