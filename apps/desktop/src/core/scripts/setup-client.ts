import { sessionQueryKey } from "@sanipatitas/desktop/auth/query/session-query"
import { $jwt } from "@sanipatitas/desktop/auth/store/jwt-store"
import { queryClient } from "@sanipatitas/desktop/core/integrations/tanstack-query-integration"
import { client } from "@sanipatitas/shared/api/client/client.gen"

// Merge the default configuration with the auth configuration
client.setConfig({
  auth: () => {
    const jwt = $jwt.get()

    return jwt ?? undefined
  },
})

// On 401 from Core API, invalidate session cache
// Next navigation will re-fetch session and renew the JWT
client.interceptors.response.use(async (response) => {
  if (response.status === 401) {
    queryClient.invalidateQueries({ queryKey: sessionQueryKey })
  }

  return response
})
