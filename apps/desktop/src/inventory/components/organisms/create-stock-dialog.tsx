import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateStock } from "@sanipatitas/desktop/inventory/hook/use-stock"
import type { ProductDto } from "@sanipatitas/desktop/inventory/api/inventory-api"
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
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { TbPlus } from "react-icons/tb"

// Schema
const schema = z.object({
  productId: z.string().min(1, "El producto es requerido"),
  quantity: z.number().min(0, "La cantidad no puede ser negativa").optional(),
  location: z.string().optional(),
  minStock: z.number().min(0).optional(),
})

// Props
interface CreateStockDialogProps {
  product: ProductDto
}

// Component
export function CreateStockDialog({ product }: CreateStockDialogProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const createMutation = useCreateStock()

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: product.id,
      quantity: 0,
      location: undefined,
      minStock: undefined,
    },
  })

  const onSubmit = handleSubmit((data) => {
    createMutation.mutate(
      {
        productId: product.id,
        quantity: data.quantity ?? 0,
        location: data.location || undefined,
        minStock: data.minStock ?? undefined,
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
          reset()
        },
        onError: (error) => {
          toast.error(
            (error as { detail?: string })?.detail ??
              "Error al crear el stock"
          )
        },
      },
    )
  })

  return (
    <Dialog actionsRef={dialogActionsRef}>
      <DialogTrigger
        render={
          <Button variant="secondary" size="sm">
            <TbPlus className="size-4" />
            Agregar stock
          </Button>
        }
      />

      <DialogContent render={<form onSubmit={onSubmit} />} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Stock para {product.name}</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput
            control={control}
            name="quantity"
            inputProps={{ type: "number", min: 0 }}
            label="Cantidad inicial"
          />

          <ControlledInput
            control={control}
            name="minStock"
            inputProps={{ type: "number", min: 0 }}
            label="Stock mínimo"
          />

          <ControlledInput
            control={control}
            name="location"
            label="Ubicación"
          />
        </FieldGroup>

        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cancelar</Button>} />
          <Button type="submit">Crear stock</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
