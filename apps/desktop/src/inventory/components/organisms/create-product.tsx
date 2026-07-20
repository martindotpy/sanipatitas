import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCategories } from "@sanipatitas/desktop/inventory/hook/use-category"
import { useCreateProduct } from "@sanipatitas/desktop/inventory/hook/use-product"
import { useSuppliers } from "@sanipatitas/desktop/inventory/hook/use-supplier"
import { zOpenapiCreateProductRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledCombobox } from "@sanipatitas/ui/components/form/controlled/controlled-combobox"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
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
import { useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { TbPlus } from "react-icons/tb"
import { toast } from "sonner"

// Component
export function CreateProduct() {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const createMutation = useCreateProduct()
  const categoriesQuery = useCategories()
  const suppliersQuery = useSuppliers()

  const categoryOptions = useMemo(
    () =>
      (categoriesQuery.data?.data ?? []).map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [categoriesQuery.data]
  )

  const supplierOptions = useMemo(
    () =>
      (suppliersQuery.data?.data ?? []).map((s) => ({
        value: s.id,
        label: s.name,
      })),
    [suppliersQuery.data]
  )

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiCreateProductRequest),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      price: 0,
      categoryId: undefined,
      supplierId: undefined,
    },
  })

  const onSubmit = handleSubmit((data) => {
    createMutation.mutate(
      {
        name: data.name,
        code: data.code,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        supplierId: data.supplierId,
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
          reset()
        },
        onError: (error) => {
          toast.error(
            (error as { detail?: string })?.detail ??
              "Error al crear el producto"
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
          <DialogTitle>Crear producto</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput control={control} name="name" label="Nombre" />

          <ControlledInput control={control} name="code" label="Código" />

          <ControlledNumberInput
            control={control}
            name="price"
            numberInputProps={{ step: 0.01 }}
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
          <Button type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
