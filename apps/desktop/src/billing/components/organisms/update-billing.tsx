import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { BillingDto } from "@sanipatitas/desktop/billing/api/billing-api"
import { useUpdateBilling } from "@sanipatitas/desktop/billing/hook/use-billing"
import { zOpenapiUpdateBillingRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledNumberInput } from "@sanipatitas/ui/components/form/controlled/controlled-number-input"
import { ControlledTextarea } from "@sanipatitas/ui/components/form/controlled/controlled-textarea"
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
    resolver: zodResolver(zOpenapiUpdateBillingRequest),
    defaultValues: {
      subtotal: 0,
      discount: 0,
      taxAmount: 0,
      totalAmount: 0,
      notes: "",
    },
  })

  useEffect(() => {
    if (billing) {
      reset({
        subtotal: billing.subtotal,
        discount: billing.discount,
        taxAmount: billing.taxAmount,
        totalAmount: billing.totalAmount,
        notes: billing.notes ?? "",
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
        notes: data.notes,
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
          <DialogTitle>Editar factura</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledNumberInput
            control={control}
            name="subtotal"
            numberInputProps={{ step: 0.01 }}
            label="Subtotal"
          />

          <ControlledNumberInput
            control={control}
            name="discount"
            numberInputProps={{ step: 0.01 }}
            label="Descuento"
          />

          <ControlledNumberInput
            control={control}
            name="taxAmount"
            numberInputProps={{ step: 0.01 }}
            label="Impuesto"
          />

          <ControlledNumberInput
            control={control}
            name="totalAmount"
            numberInputProps={{ step: 0.01 }}
            label="Total"
          />

          <ControlledTextarea control={control} name="notes" label="Notas" />
        </FieldGroup>

        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cancelar</Button>} />
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
