import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateCategory } from "@sanipatitas/desktop/inventory/hook/use-category"
import { zOpenapiCreateProductCategoryRequest } from "@sanipatitas/shared/api/client/zod.gen"
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
import { ControlledTextarea } from "@sanipatitas/ui/components/form/controlled/controlled-textarea"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { TbPlus } from "react-icons/tb"

// Component
export function CreateCategory() {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const createMutation = useCreateCategory()

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiCreateProductCategoryRequest),
    defaultValues: {
      name: "",
      description: undefined,
    },
  })

  const onSubmit = handleSubmit((data) => {
    createMutation.mutate(
      {
        name: data.name,
        description: data.description || undefined,
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
          reset()
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
            Agregar
          </Button>
        }
      />

      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Crear categoría</DialogTitle>
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
          <Button type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
