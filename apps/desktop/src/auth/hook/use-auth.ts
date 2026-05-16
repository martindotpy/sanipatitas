import { Route as PrivateRoute } from "@sanipatitas/desktop/pages/_app/routes/_private/route"

// Hook
export function useAuth() {
  const { auth } = PrivateRoute.useRouteContext()

  return auth
}
