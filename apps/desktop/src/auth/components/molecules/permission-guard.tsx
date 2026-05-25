import {
  isRole,
  type statement,
} from "@sanipatitas/auth/auth/configuration/permissions"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import { useRole } from "@sanipatitas/desktop/auth/hook/use-role"

// Types
type Permission = {
  [K in keyof typeof statement]?: Array<(typeof statement)[K][number]>
}

interface PermissionGuardProps {
  permission: Permission
  children: React.ReactNode
}

// Component
export function PermissionGuard({
  permission,
  children,
}: PermissionGuardProps) {
  const role = useRole()

  if (!role || !isRole(role)) {
    return null
  }

  const allowed = authClient.admin.checkRolePermission({
    permissions: permission,
    role,
  })

  if (!allowed) {
    return null
  }

  return children
}
