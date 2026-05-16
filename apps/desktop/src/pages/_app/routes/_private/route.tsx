import { HomeHeader } from "@sanipatitas/desktop/home/components/organisms/home-header"
import { HomeSidebar } from "@sanipatitas/desktop/home/components/organisms/home-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@sanipatitas/ui/components/ui/sidebar"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

// Private layout
export const Route = createFileRoute("/_private")({
  beforeLoad: ({ context, location }) => {
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
  return (
    <SidebarProvider className="flex flex-col">
      <HomeHeader />

      <div className="flex flex-1">
        <HomeSidebar />
        <SidebarInset className="border-t">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
