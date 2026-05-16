import { useAuth } from "@sanipatitas/desktop/auth/hook/use-auth"

// Component
export function useSession() {
  const auth = useAuth()

  return auth.session
}
