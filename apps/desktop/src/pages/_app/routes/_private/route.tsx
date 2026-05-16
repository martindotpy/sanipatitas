import { useJwt } from "@sanipatitas/desktop/auth/store/jwt-store"
import { HomeHeader } from "@sanipatitas/desktop/home/components/organisms/home-header"
import { HomeSidebar } from "@sanipatitas/desktop/home/components/organisms/home-sidebar"
import { SidebarInset } from "@sanipatitas/ui/components/ui/sidebar"
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
} from "@tanstack/react-router"
import { useEffect } from "react"

// Private layout
export const Route = createFileRoute("/_private")({
  beforeLoad: ({ context, location }) => {
    // Redirect to public routes if is not authenticated
    if (!context.auth) {
      const redirectTo = getRedirectTo(location)

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
  // Route
  const location = useLocation()
  const navigate = useNavigate()

  // Token
  const jwt = useJwt()

  useEffect(() => {
    if (!jwt) {
      const redirectTo = getRedirectTo(location)

      navigate({ to: "/sign-in", search: { redirectTo }, replace: true })
    }
  }, [jwt, location, navigate])

  return (
    <>
      <HomeHeader />

      <div className="flex flex-1">
        <HomeSidebar />
        <SidebarInset className="border-t">
          <Outlet />
        </SidebarInset>
      </div>
    </>
  )
}

// Helper
function getRedirectTo(location: ReturnType<typeof useLocation>) {
  return location.href === "/" ? undefined : location.href
}
