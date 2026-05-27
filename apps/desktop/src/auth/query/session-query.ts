import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import { $jwt } from "@sanipatitas/desktop/auth/store/jwt-store"
import { SESSION_STALE_TIME } from "@sanipatitas/desktop/core/constant/app-constant"
import { queryClient } from "@sanipatitas/desktop/core/integrations/tanstack-query-integration"
import type { FetchQueryOptions } from "@tanstack/react-query"

// Key
export const sessionQueryKey = ["session"]

// Query
export const sessionQueryOptions = {
  queryKey: sessionQueryKey,
  queryFn: async () => {
    const auth = await authClient.getSession({
      fetchOptions: {
        onSuccess: ({ response }) => {
          const authJwt = response.headers.get("set-auth-jwt")

          $jwt.set(authJwt)
        },
      },
    })

    return auth.data
  },
  staleTime: SESSION_STALE_TIME,
} satisfies FetchQueryOptions

export async function getSession() {
  return queryClient.fetchQuery(sessionQueryOptions)
}

export async function invalidateSessionQuery() {
  await queryClient.invalidateQueries({ queryKey: sessionQueryKey })
}
