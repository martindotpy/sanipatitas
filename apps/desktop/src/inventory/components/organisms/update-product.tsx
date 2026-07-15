import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateProduct } from "@sanipatitas/desktop/inventory/hook/use-product"
import { useCategories } from "@sanipatitas/desktop/inventory/hook/use-category"
import { useSuppliers } from "@sanipatitas/desktop/inventory/hook/use-supplier"
import type { ProductDto } from "@sanipatitas/desktop/inventory/api/inventory-api"
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
import { ControlledCombobox } from "@sanipatitas/ui/components/form/controlled/controlled-combobox"
import { ControlledTextarea } from "@sanipatitas/ui/components/form/controlled/controlled-textarea"
import { useEffect, useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// Schema
const schema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
})

// Props
interface UpdateProductProps {
  product: ProductDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component
export function UpdateProduct({
  product,
  open,
  onOpenChange,
}: UpdateProductProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const updateMutation = useUpdateProduct()
  const categoriesQuery = useCategories()
  const suppliersQuery = useSuppliers()

  const categoryOptions = useMemo(
    () =>
      (categoriesQuery.data?.data ?? []).map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [categoriesQuery.data],
  )

  const supplierOptions = useMemo(
    () =>
      (suppliersQuery.data?.data ?? []).map((s) => ({
        value: s.id,
        label: s.name,
      })),
    [suppliersQuery.data],
  )

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: undefined,
      code: undefined,
      description: undefined,
      price: undefined,
      categoryId: undefined,
      supplierId: undefined,
    },
  })

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        code: product.code ?? undefined,
        description: product.description ?? undefined,
        price: product.price ?? undefined,
        categoryId: product.category?.id ?? undefined,
        supplierId: product.supplier?.id ?? undefined,
      })
    }
  }, [product, reset])

  const onSubmit = handleSubmit((data) => {
    if (!product) return

    updateMutation.mutate(
      {
        id: product.id,
        name: data.name!,
        code: data.code || undefined,
        description: data.description || undefined,
        price: data.price ?? undefined,
        categoryId: data.categoryId ?? undefined,
        supplierId: data.supplierId ?? undefined,
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
        },
        onError: (error) => {
          toast.error(
            (error as { detail?: string })?.detail ??
              "Error al actualizar el producto"
          )
        },
      },
    )
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange} actionsRef={dialogActionsRef}>
      <DialogContent render={<form onSubmit={onSubmit} />} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput control={control} name="name" label="Nombre" />

          <ControlledInput control={control} name="code" label="Código" />

          <ControlledInput
            control={control}
            name="price"
            inputProps={{ type: "number", step: "0.01" }}
            label="Precio"
          />

          <ControlledCombobox
            control={control}
            name="categoryId"
            label="Categoría"
            options={categoryOptions}
            placeholder="Seleccionar categoría..."
            searchPlaceholder="Buscar categoría..."
          />

          <ControlledCombobox
            control={control}
            name="supplierId"
            label="Proveedor"
            options={supplierOptions}
            placeholder="Seleccionar proveedor..."
            searchPlaceholder="Buscar proveedor..."
          />

          <ControlledTextarea
            control={control}
            name="description"
            label="Descripción"
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
