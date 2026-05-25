import { invalidateSessionQuery } from "@sanipatitas/desktop/auth/query/session-query"
import { $jwt } from "@sanipatitas/desktop/auth/store/jwt-store"
import { publicBaseUrl } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { client } from "@sanipatitas/shared/api/client/client.gen"

// Base URL
client.setConfig({
  baseUrl: publicBaseUrl,
})

// Attach JWT to every outgoing request
client.interceptors.request.use((request) => {
  const jwt = $jwt.get()

  if (jwt) {
    request.headers.set("Authorization", `Bearer ${jwt}`)
  }

  return request
})

// On 401 from Core API, invalidate session cache
// Next navigation will re-fetch session and renew the JWT
client.interceptors.response.use((response) => {
  if (response.status === 401) {
    invalidateSessionQuery()
  }

  return response
})
