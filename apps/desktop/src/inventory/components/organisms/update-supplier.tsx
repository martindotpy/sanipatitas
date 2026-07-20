import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { SupplierDto } from "@sanipatitas/desktop/inventory/api/inventory-api"
import { useUpdateSupplier } from "@sanipatitas/desktop/inventory/hook/use-supplier"
import { zOpenapiUpdateSupplierRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
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
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

// Props
interface UpdateSupplierProps {
  supplier: SupplierDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component
export function UpdateSupplier({
  supplier,
  open,
  onOpenChange,
}: UpdateSupplierProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const updateMutation = useUpdateSupplier()

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiUpdateSupplierRequest),
    defaultValues: {
      name: "",
      ruc: "",
      contactName: "",
      contactPhone: "",
      email: "",
      address: "",
    },
  })

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        ruc: supplier.ruc ?? "",
        contactName: supplier.contactName ?? "",
        contactPhone: supplier.contactPhone ?? "",
        email: supplier.email ?? "",
        address: supplier.address ?? "",
      })
    }
  }, [supplier, reset])

  const onSubmit = handleSubmit((data) => {
    if (!supplier) return

    updateMutation.mutate(
      {
        id: supplier.id,
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
        },
        onError: (error) => {
          toast.error(
            (error as { detail?: string })?.detail ??
              "Error al actualizar el proveedor"
          )
        },
      }
    )
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      actionsRef={dialogActionsRef}
    >
      <DialogContent
        render={<form onSubmit={onSubmit} />}
        className="sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>Editar proveedor</DialogTitle>
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
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
