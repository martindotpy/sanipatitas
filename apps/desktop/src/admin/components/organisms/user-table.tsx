import { CreateUserDialog } from "@sanipatitas/desktop/admin/components/organisms/create-user-dialog"
import { UpdateUserDialog } from "@sanipatitas/desktop/admin/components/organisms/update-user-dialog"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import { displayRole } from "@sanipatitas/desktop/auth/display/display-role"
import { Badge } from "@sanipatitas/ui/components/ui/badge"
import { Button } from "@sanipatitas/ui/components/ui/button"
import { Spinner } from "@sanipatitas/ui/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sanipatitas/ui/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { TbPencil } from "react-icons/tb"

// Types
interface UserWithRole {
  id: string
  name: string
  lastName?: string
  email: string
  role?: string
  banned?: boolean | null
}

// Component
export function UserTable() {
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const result = await authClient.admin.listUsers({
        query: { limit: 200 },
        fetchOptions: { throw: true },
      })
      return result.users as UserWithRole[]
    },
  })

  if (usersQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    )
  }

  const users = usersQuery.data ?? []

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {users.length} usuario{users.length !== 1 ? "s" : ""}
        </p>

        <CreateUserDialog />
      </div>

      {users.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          No hay usuarios registrados.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.name} {user.lastName ?? ""}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {displayRole(user.role ?? "")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.banned ? (
                    <Badge variant="destructive">Baneado</Badge>
                  ) : (
                    <Badge variant="default">Activo</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setEditingUser(user)
                      setEditOpen(true)
                    }}
                  >
                    <TbPencil className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <UpdateUserDialog
        user={editingUser}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingUser(null)
        }}
      />
    </>
  )
}
