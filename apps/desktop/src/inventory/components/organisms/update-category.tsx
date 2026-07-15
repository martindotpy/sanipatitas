import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateCategory } from "@sanipatitas/desktop/inventory/hook/use-category"
import type { ProductCategoryDto } from "@sanipatitas/desktop/inventory/api/inventory-api"
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
  name: z.string().min(1, "El nombre es requerido").optional(),
  description: z.string().optional(),
})

// Props
interface UpdateCategoryProps {
  category: ProductCategoryDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component
export function UpdateCategory({
  category,
  open,
  onOpenChange,
}: UpdateCategoryProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const updateMutation = useUpdateCategory()

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: undefined,
      description: undefined,
    },
  })

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description ?? undefined,
      })
    }
  }, [category, reset])

  const onSubmit = handleSubmit((data) => {
    if (!category) return

    updateMutation.mutate(
      {
        id: category.id,
        name: data.name!,
        description: data.description || undefined,
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
        },
        onError: (error) => {
          toast.error(
            (error as { detail?: string })?.detail ??
              "Error al actualizar la categoría"
          )
        },
      },
    )
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange} actionsRef={dialogActionsRef}>
      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Editar categoría</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput control={control} name="name" label="Nombre" />

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
