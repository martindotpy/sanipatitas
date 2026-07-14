import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import { Button } from "@sanipatitas/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@sanipatitas/ui/components/ui/dialog"
import { FieldGroup } from "@sanipatitas/ui/components/ui/field"
import { ControlledCombobox } from "@sanipatitas/ui/components/form/controlled/controlled-combobox"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { TbLoader2 } from "react-icons/tb"
import { toast } from "sonner"
import { z } from "zod"

// Options
const ROLE_OPTIONS = [
  { value: "admin", label: "Administrador" },
  { value: "veterinarian", label: "Veterinario" },
  { value: "worker", label: "Trabajador" },
]

// Schema
const UpdateUserSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  role: z.string().min(1, "Selecciona un rol"),
})

// Types
interface UserWithRole {
  id: string
  name: string
  lastName?: string
  email: string
  role?: string
  banned?: boolean | null
}

interface UpdateUserDialogProps {
  user: UserWithRole | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component
export function UpdateUserDialog({ user, open, onOpenChange }: UpdateUserDialogProps) {
  const queryClient = useQueryClient()

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: "",
      lastName: "",
      role: "",
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        lastName: user.lastName ?? "",
        role: user.role ?? "",
      })
    }
  }, [user, reset])

  const onSubmit = handleSubmit(async (data) => {
    if (!user) return

    await toast
      .promise(
        authClient.admin.updateUser(
          {
            userId: user.id,
            data: {
              name: data.name,
              lastName: data.lastName,
              role: data.role,
            },
          },
          { throw: true }
        ),
        {
          loading: "Actualizando usuario...",
          success: () => {
            onOpenChange(false)
            queryClient.invalidateQueries({ queryKey: ["admin-users"] })
            return "Usuario actualizado correctamente"
          },
          error: "Error al actualizar el usuario",
        }
      )
      .unwrap()
  })

  const handleBanToggle = async () => {
    if (!user) return

    if (user.banned) {
      await toast
        .promise(
          authClient.admin.unbanUser({ userId: user.id }, { throw: true }),
          {
            loading: "Desbaneando usuario...",
            success: () => {
              onOpenChange(false)
              queryClient.invalidateQueries({ queryKey: ["admin-users"] })
              return "Usuario desbaneado correctamente"
            },
            error: "Error al desbanear el usuario",
          }
        )
        .unwrap()
    } else {
      await toast
        .promise(
          authClient.admin.banUser({ userId: user.id }, { throw: true }),
          {
            loading: "Baneando usuario...",
            success: () => {
              onOpenChange(false)
              queryClient.invalidateQueries({ queryKey: ["admin-users"] })
              return "Usuario baneado correctamente"
            },
            error: "Error al banear el usuario",
          }
        )
        .unwrap()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <ControlledInput
            control={control}
            name="name"
            label="Nombre"
            inputProps={{ placeholder: "Nombre del usuario" }}
          />
          <ControlledInput
            control={control}
            name="lastName"
            label="Apellido"
            inputProps={{ placeholder: "Apellido del usuario" }}
          />
          <ControlledCombobox
            control={control}
            name="role"
            label="Rol"
            options={ROLE_OPTIONS}
            placeholder="Seleccionar rol..."
          />
        </FieldGroup>
        <DialogFooter>
          <div className="flex w-full gap-2">
            <Button
              type="button"
              variant="destructive"
              className="mr-auto"
              onClick={handleBanToggle}
            >
              {user?.banned ? "Desbanear" : "Banear"}
            </Button>
            <DialogClose render={<Button variant="secondary">Cancelar</Button>} />
            <Button type="submit">
              <TbLoader2 className="size-4 animate-spin" />
              Guardar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}