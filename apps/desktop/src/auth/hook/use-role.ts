import { useUser } from "@sanipatitas/desktop/auth/hook/use-user"

// Hook
export function useRole() {
  const user = useUser()

  return user.role
}

export function useIsAdmin() {
  const role = useRole()

  return role === "admin"
}

export function useIsVeterinarian() {
  const role = useRole()

  return role === "veterinarian"
}

export function useIsWorker() {
  const role = useRole()

  return role === "worker"
}
