import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateBilling } from "@sanipatitas/desktop/billing/hook/use-billing"
import { getApiClientOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { zOpenapiCreateBillingRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledCombobox } from "@sanipatitas/ui/components/form/controlled/controlled-combobox"
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
  DialogTrigger,
} from "@sanipatitas/ui/components/ui/dialog"
import { FieldGroup } from "@sanipatitas/ui/components/ui/field"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { TbPlus } from "react-icons/tb"
import { toast } from "sonner"

// Component
export function CreateBilling() {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const createMutation = useCreateBilling()

  const clientsQuery = useQuery(getApiClientOptions())

  const clientOptions = useMemo(
    () =>
      (clientsQuery.data?.data ?? []).map((c) => ({
        value: c.id,
        label: `${c.firstName} ${c.lastName ?? ""}`,
      })),
    [clientsQuery.data]
  )

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiCreateBillingRequest),
    defaultValues: {
      clientId: "",
      subtotal: 0,
      discount: 0,
      taxAmount: 0,
      totalAmount: 0,
      notes: "",
    },
  })

  const onSubmit = handleSubmit((data) => {
    createMutation.mutate(
      {
        clientId: data.clientId,
        subtotal: data.subtotal,
        discount: data.discount,
        taxAmount: data.taxAmount,
        totalAmount: data.totalAmount,
        notes: data.notes,
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
          reset()
        },
        onError: (error) => {
          toast.error(
            (error as { detail?: string })?.detail ??
              "Error al crear la factura"
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
            Nueva factura
          </Button>
        }
      />

      <DialogContent
        render={<form onSubmit={onSubmit} />}
        className="sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>Crear factura</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledCombobox
            control={control}
            name="clientId"
            label="Cliente"
            options={clientOptions}
            placeholder="Seleccionar cliente..."
            searchPlaceholder="Buscar cliente..."
          />

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
          <Button type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
