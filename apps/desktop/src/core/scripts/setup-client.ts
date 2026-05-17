import { invalidateSessionQuery } from "@sanipatitas/desktop/auth/query/session-query"
import { $jwt } from "@sanipatitas/desktop/auth/store/jwt-store"
import { publicBaseUrl } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { client } from "@sanipatitas/shared/api/client/client.gen"
import { fetch as tauriFetch } from "@tauri-apps/plugin-http"

// Merge the default configuration with the auth configuration
client.setConfig({
  auth: () => {
    const jwt = $jwt.get()

    return jwt ?? undefined
  },
  baseUrl: publicBaseUrl,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  fetch: tauriFetch,
})

// On 401 from Core API, invalidate session cache
// Next navigation will re-fetch session and renew the JWT
client.interceptors.response.use((response) => {
  if (response.status === 401) {
    invalidateSessionQuery()
    $jwt.set(null)
  }

  return response
})
