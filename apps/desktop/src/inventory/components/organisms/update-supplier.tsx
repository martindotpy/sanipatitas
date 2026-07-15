import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateSupplier } from "@sanipatitas/desktop/inventory/hook/use-supplier"
import type { SupplierDto } from "@sanipatitas/desktop/inventory/api/inventory-api"
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
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// Schema
const schema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  ruc: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
})

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
    resolver: zodResolver(schema),
    defaultValues: {
      name: undefined,
      ruc: undefined,
      contactName: undefined,
      contactPhone: undefined,
      email: undefined,
      address: undefined,
    },
  })

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        ruc: supplier.ruc ?? undefined,
        contactName: supplier.contactName ?? undefined,
        contactPhone: supplier.contactPhone ?? undefined,
        email: supplier.email ?? undefined,
        address: supplier.address ?? undefined,
      })
    }
  }, [supplier, reset])

  const onSubmit = handleSubmit((data) => {
    if (!supplier) return

    updateMutation.mutate(
      {
        id: supplier.id,
        name: data.name!,
        ruc: data.ruc || undefined,
        contactName: data.contactName || undefined,
        contactPhone: data.contactPhone || undefined,
        email: data.email || undefined,
        address: data.address || undefined,
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
      },
    )
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange} actionsRef={dialogActionsRef}>
      <DialogContent render={<form onSubmit={onSubmit} />} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar proveedor</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput control={control} name="name" label="Nombre" />

          <ControlledInput control={control} name="ruc" label="RUC" />

          <ControlledInput control={control} name="contactName" label="Contacto" />

          <ControlledInput control={control} name="contactPhone" label="Teléfono" />

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
