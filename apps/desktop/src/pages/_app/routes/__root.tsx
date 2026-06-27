import { getSession } from "@sanipatitas/desktop/auth/query/session-query"
import { DraggableHeader } from "@sanipatitas/desktop/core/components/molecules/draggable-header"
import { isSsr } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { Devtools } from "@sanipatitas/desktop/core/devtools/devtools"
import { getTitle } from "@sanipatitas/desktop/core/kit/title-kit"
import { useSidebar } from "@sanipatitas/ui/components/ui/sidebar"
import type { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  Outlet,
  useRouter,
} from "@tanstack/react-router"
import type { AstroGlobal } from "astro"
import { useEffect } from "react"

// Root route
interface RootRouteContext {
  astro: AstroGlobal | undefined
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  beforeLoad: async () => {
    if (isSsr) {
      return { auth: null, prerender: isSsr }
    }

    const auth = await getSession()

    return { auth, prerender: isSsr }
  },
  head: () => ({ meta: [{ title: getTitle() }] }),
  component: RootComponent,
})

function RootComponent() {
  // Context
  const { prerender } = Route.useRouteContext()

  // Router
  const router = useRouter()

  // Sidebar
  const { openMobile: sidebarOpenMobile, setOpenMobile: setSidebarOpenMobile } =
    useSidebar()

  useEffect(() => {
    if (prerender) {
      router.invalidate()
    }
  }, [router, prerender])

  useEffect(() => {
    function handleRouteChange() {
      if (sidebarOpenMobile) {
        setSidebarOpenMobile(false)
      }
    }

    const unSuscribe = router.subscribe("onBeforeNavigate", handleRouteChange)

    return () => {
      unSuscribe()
    }
  }, [router, sidebarOpenMobile, setSidebarOpenMobile])

  return (
    <>
      <DraggableHeader />

      <Outlet />

      <Devtools />
    </>
  )
}
