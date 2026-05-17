import type {
  auth,
  AuthErrorCode,
} from "@sanipatitas/auth/auth/configuration/auth-configuration"
import { publicBaseUrl } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { fetch as tauriFetch } from "@tauri-apps/plugin-http"
import {
  adminClient,
  inferAdditionalFields,
  jwtClient,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

// Client
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), adminClient(), jwtClient()],
  baseURL: publicBaseUrl,
  fetchOptions: {
    customFetchImpl: tauriFetch,
  },
})

// Error
interface AuthError {
  readonly code: AuthErrorCode | (string & {})
  readonly message: string
}

export const isAuthError = (error: unknown): error is AuthError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    "message" in error &&
    typeof error.message === "string"
  )
}
