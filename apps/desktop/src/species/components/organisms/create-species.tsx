import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSpecies } from "@sanipatitas/desktop/species/hook/use-species"
import { postApiSpeciesMutation } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { zOpenapiCreateSpeciesRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { uuidV7 } from "@sanipatitas/shared/lib/uuid"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
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
import { useMutation } from "@tanstack/react-query"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { TbPlus } from "react-icons/tb"

// Component
export function CreateSpecies() {
  // Dialog
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)

  // Query
  const speciesQuery = useSpecies()

  // Form
  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(zOpenapiCreateSpeciesRequest),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onSubmit = handleSubmit((data) => {
    createSpeciesMutation.mutate({
      body: {
        id: uuidV7(),
        ...data,
      },
    })
  })

  // Mutation
  const createSpeciesMutation = useMutation({
    ...postApiSpeciesMutation(),
    onSuccess: () => {
      dialogActionsRef.current?.close()
      speciesQuery.refetch()
      setValue("name", "")
      setValue("description", "")
    },
    onError: (error) => {
      toast.error((error as { detail?: string })?.detail ?? "Error al crear la especie")
    },
  })

  return (
    <Dialog actionsRef={dialogActionsRef}>
      <DialogTrigger
        render={
          <Button variant="secondary">
            <TbPlus />
          </Button>
        }
      />

      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Crear especie</DialogTitle>
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
