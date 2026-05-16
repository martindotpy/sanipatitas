import { useAuth } from "@sanipatitas/desktop/auth/hook/use-auth"

// Hook
export function useUser() {
  const auth = useAuth()

  return auth.user
}
