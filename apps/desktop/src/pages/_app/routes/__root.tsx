import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import { $jwt } from "@sanipatitas/desktop/auth/store/jwt-store"
import { $auth } from "@sanipatitas/desktop/auth/store/user-store"
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

    // Get the session
    const auth = await authClient.getSession({
      fetchOptions: {
        onSuccess: ({ response }) => {
          const authJwt = response.headers.get("set-auth-jwt")

          $jwt.set(authJwt)
        },
      },
    })

    $auth.set(auth.data)

    return { auth: auth.data }
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
