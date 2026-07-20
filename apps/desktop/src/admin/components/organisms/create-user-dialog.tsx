import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import { ControlledCombobox } from "@sanipatitas/ui/components/form/controlled/controlled-combobox"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
import { ControlledPasswordInput } from "@sanipatitas/ui/components/form/controlled/controlled-password-input"
import { Button } from "@sanipatitas/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@sanipatitas/ui/components/ui/dialog"
import { FieldGroup } from "@sanipatitas/ui/components/ui/field"
import { useQueryClient } from "@tanstack/react-query"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { TbLoader2, TbPlus } from "react-icons/tb"
import { toast } from "sonner"
import { z } from "zod"

// Options
const ROLE_OPTIONS = [
  { value: "veterinarian", label: "Veterinario" },
  { value: "worker", label: "Trabajador" },
]

// Schema
const CreateUserSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.string().min(1, "Selecciona un rol"),
})

// Component
export function CreateUserDialog() {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const queryClient = useQueryClient()

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    await toast
      .promise(
        authClient.admin.createUser(
          {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role as "admin" | "veterinarian" | "worker",
            data: { lastName: data.lastName },
          },
          { throw: true }
        ),
        {
          loading: "Creando usuario...",
          success: () => {
            dialogActionsRef.current?.close()
            reset()
            queryClient.invalidateQueries({ queryKey: ["admin-users"] })
            return "Usuario creado. Se envió un correo de verificación."
          },
          error: "Error al crear el usuario",
        }
      )
      .unwrap()
  })

  return (
    <Dialog actionsRef={dialogActionsRef}>
      <DialogTrigger
        render={
          <Button variant="secondary">
            <TbPlus />
            Nuevo usuario
          </Button>
        }
      />
      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Crear usuario</DialogTitle>
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
          <ControlledInput
            control={control}
            name="email"
            label="Correo electrónico"
            inputProps={{
              placeholder: "usuario@email.com",
              autoComplete: "email",
            }}
          />
          <ControlledPasswordInput
            control={control}
            name="password"
            label="Contraseña"
            inputProps={{
              placeholder: "Contraseña",
              autoComplete: "new-password",
            }}
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
          <DialogClose render={<Button variant="secondary">Cancelar</Button>} />
          <Button type="submit">
            <TbLoader2 className="size-4 animate-spin" />
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
