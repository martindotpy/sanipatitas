import { $jwt } from "@sanipatitas/desktop/auth/store/jwt-store"
import { client } from "@sanipatitas/shared/api/client/client.gen"

// Merge the default configuration with the auth configuration
client.setConfig({
  auth: () => {
    const jwt = $jwt.get()

    return jwt ?? undefined
  },
})
