import { useUser } from "@sanipatitas/desktop/auth/hook/use-user"
import type { OpenapiUser } from "@sanipatitas/shared/api/client/types.gen"

// Component
interface RoleGuard {
  role: OpenapiUser["role"]
  children: React.ReactNode
}

export function RoleGuard({ role, children }: RoleGuard) {
  const user = useUser()

  if (user.role === role) {
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

export function UserGuard(props: Guard) {
  return <RoleGuard role="user" {...props} />
}
