import { useAuthQuery } from "@sanipatitas/desktop/auth/hook/use-auth"
import { HomeHeader } from "@sanipatitas/desktop/home/components/organisms/home-header"
import { HomeSidebar } from "@sanipatitas/desktop/home/components/organisms/home-sidebar"
import { $title } from "@sanipatitas/desktop/home/store/title-store"
import { SidebarInset } from "@sanipatitas/ui/components/ui/sidebar"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { useEffect } from "react"

// Private layout
export const Route = createFileRoute("/_private")({
  beforeLoad: ({ context, location }) => {
    // Redirect to public routes if is not authenticated
    if (!context.auth) {
      const redirectTo = location.href === "/" ? undefined : location.href

      throw redirect({ to: "/sign-in", search: { redirectTo }, replace: true })
    }

    return { auth: context.auth }
  },
  component: PrivateLayout,
  staticData: {
    sidebar: true,
  },
})

function PrivateLayout() {
  useAuthQuery()
  useEffect(() => {
    return () => {
      $title.set(null)
    }
  }, [])

  return (
    <>
      <HomeHeader />

      <div className="bg-sidebar flex max-w-dvw min-w-0 flex-1">
        <HomeSidebar />

        <SidebarInset className="mt-header-h max-h-main-h max-w-full min-w-0 overflow-y-scroll rounded-tl-sm border-t border-l">
          <Outlet />
        </SidebarInset>
      </div>
    </>
  )
}
