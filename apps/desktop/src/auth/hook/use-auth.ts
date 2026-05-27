import { sessionQueryOptions } from "@sanipatitas/desktop/auth/query/session-query"
import { SESSION_STALE_TIME } from "@sanipatitas/desktop/core/constant/app-constant"
import { Route as PrivateRoute } from "@sanipatitas/desktop/pages/_app/routes/_private/route"
import { useQuery } from "@tanstack/react-query"

// Hook
export function useAuthQuery() {
  const authQuery = useQuery({
    ...sessionQueryOptions,
    refetchInterval: SESSION_STALE_TIME - 5000, // Refetch 5 secs before it becomes stale
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  return authQuery
}

export function useAuth() {
  const { auth } = PrivateRoute.useRouteContext()

  return auth
}
