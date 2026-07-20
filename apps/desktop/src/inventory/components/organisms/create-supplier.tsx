import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateSupplier } from "@sanipatitas/desktop/inventory/hook/use-supplier"
import { zOpenapiCreateSupplierRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
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
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { TbPlus } from "react-icons/tb"
import { toast } from "sonner"

// Component
export function CreateSupplier() {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const createMutation = useCreateSupplier()

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiCreateSupplierRequest),
    defaultValues: {
      name: "",
      ruc: "",
      contactName: "",
      contactPhone: "",
      email: "",
      address: "",
    },
  })

  const onSubmit = handleSubmit((data) => {
    createMutation.mutate(
      {
        name: data.name,
        ruc: data.ruc,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        email: data.email,
        address: data.address,
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
          reset()
        },
        onError: (error) => {
          toast.error(
            (error as { detail?: string })?.detail ??
              "Error al crear el proveedor"
          )
        },
      }
    )
  })

  return (
    <Dialog actionsRef={dialogActionsRef}>
      <DialogTrigger
        render={
          <Button variant="secondary" size="sm">
            <TbPlus className="size-4" />
            Agregar
          </Button>
        }
      />

      <DialogContent
        render={<form onSubmit={onSubmit} />}
        className="sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>Crear proveedor</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput control={control} name="name" label="Nombre" />

          <ControlledInput control={control} name="ruc" label="RUC" />

          <ControlledInput
            control={control}
            name="contactName"
            label="Contacto"
          />

          <ControlledInput
            control={control}
            name="contactPhone"
            label="Teléfono"
          />

          <ControlledInput
            control={control}
            name="email"
            inputProps={{ type: "email" }}
            label="Email"
          />

          <ControlledInput control={control} name="address" label="Dirección" />
        </FieldGroup>

        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cancelar</Button>} />
          <Button type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
