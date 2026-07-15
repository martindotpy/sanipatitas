import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateBilling } from "@sanipatitas/desktop/billing/hook/use-billing"
import type { BillingDto } from "@sanipatitas/desktop/billing/api/billing-api"
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
import { ControlledTextarea } from "@sanipatitas/ui/components/form/controlled/controlled-textarea"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// Schema
const schema = z.object({
  subtotal: z.number().optional(),
  discount: z.number().optional(),
  taxAmount: z.number().optional(),
  totalAmount: z.number().optional(),
  notes: z.string().optional(),
})

// Props
interface UpdateBillingProps {
  billing: BillingDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component
export function UpdateBilling({
  billing,
  open,
  onOpenChange,
}: UpdateBillingProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const updateMutation = useUpdateBilling()

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      subtotal: undefined,
      discount: undefined,
      taxAmount: undefined,
      totalAmount: undefined,
      notes: undefined,
    },
  })

  useEffect(() => {
    if (billing) {
      reset({
        subtotal: billing.subtotal,
        discount: billing.discount,
        taxAmount: billing.taxAmount,
        totalAmount: billing.totalAmount,
        notes: billing.notes ?? undefined,
      })
    }
  }, [billing, reset])

  const onSubmit = handleSubmit((data) => {
    if (!billing) return

    updateMutation.mutate(
      {
        id: billing.id,
        subtotal: data.subtotal!,
        discount: data.discount!,
        taxAmount: data.taxAmount!,
        totalAmount: data.totalAmount!,
        notes: data.notes || undefined,
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
        },
        onError: (error) => {
          toast.error(
            (error as { detail?: string })?.detail ??
              "Error al actualizar la factura"
          )
        },
      },
    )
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange} actionsRef={dialogActionsRef}>
      <DialogContent render={<form onSubmit={onSubmit} />} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar factura</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput
            control={control}
            name="subtotal"
            inputProps={{ type: "number", step: "0.01" }}
            label="Subtotal"
          />

          <ControlledInput
            control={control}
            name="discount"
            inputProps={{ type: "number", step: "0.01" }}
            label="Descuento"
          />

          <ControlledInput
            control={control}
            name="taxAmount"
            inputProps={{ type: "number", step: "0.01" }}
            label="Impuesto"
          />

          <ControlledInput
            control={control}
            name="totalAmount"
            inputProps={{ type: "number", step: "0.01" }}
            label="Total"
          />

          <ControlledTextarea
            control={control}
            name="notes"
            label="Notas"
          />
        </FieldGroup>

        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cancelar</Button>} />
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
