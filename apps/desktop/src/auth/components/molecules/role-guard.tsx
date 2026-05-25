import type { Role } from "@sanipatitas/auth/auth/configuration/permissions"
import { useUser } from "@sanipatitas/desktop/auth/hook/use-user"

// Component
interface RoleGuard {
  role: Role
  children: React.ReactNode
}

export function RoleGuard({ role, children }: RoleGuard) {
  const user = useUser()

  if (user.role !== role) {
    return null
  }

  return children
}

// Variant
interface Guard {
  children: React.ReactNode
}

export function AdminGuard(props: Guard) {
  return <RoleGuard role="admin" {...props} />
}

export function VeterinarianGuard(props: Guard) {
  return <RoleGuard role="veterinarian" {...props} />
}

export function WorkerGuard(props: Guard) {
  return <RoleGuard role="worker" {...props} />
}
