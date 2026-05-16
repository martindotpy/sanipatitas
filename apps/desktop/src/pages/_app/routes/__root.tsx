import { getSession } from "@sanipatitas/desktop/auth/query/session-query"
import { isSsr } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { Devtools } from "@sanipatitas/desktop/core/devtools/devtools"
import { getTitle } from "@sanipatitas/desktop/core/kit/title-kit"
import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import type { AstroGlobal } from "astro"

// Root route
interface RootRouteContext {
  astro: AstroGlobal | undefined
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  beforeLoad: async () => {
    if (isSsr) return { auth: null }

    const auth = await getSession()

    return { auth }
  },
  head: () => ({ meta: [{ title: getTitle() }] }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />

      <Devtools />
    </>
  )
}
