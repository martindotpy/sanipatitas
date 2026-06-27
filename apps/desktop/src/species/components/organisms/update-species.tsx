import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSpecies } from "@sanipatitas/desktop/species/hook/use-species"
import { putApiSpeciesByIdMutation } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import type { OpenapiSpeciesDto } from "@sanipatitas/shared/api/client/types.gen"
import { zOpenapiUpdateSpeciesRequest } from "@sanipatitas/shared/api/client/zod.gen"
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
} from "@sanipatitas/ui/components/ui/dialog"
import { FieldGroup } from "@sanipatitas/ui/components/ui/field"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"

// Types
interface UpdateSpeciesProps {
  species: OpenapiSpeciesDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component
export function UpdateSpecies({
  species,
  open,
  onOpenChange,
}: UpdateSpeciesProps) {
  // Dialog
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)

  // Query
  const speciesQuery = useSpecies()

  // Form
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiUpdateSpeciesRequest),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  useEffect(() => {
    if (species) {
      reset({
        name: species.name,
        description: species.description ?? "",
      })
    }
  }, [species, reset])

  // Mutation
  const updateSpeciesMutation = useMutation({
    ...putApiSpeciesByIdMutation(),
    onSuccess: () => {
      dialogActionsRef.current?.close()
      speciesQuery.refetch()
    },
  })

  const onSubmit = handleSubmit((data) => {
    if (!species) return

    updateSpeciesMutation.mutate({
      path: { id: species.id },
      body: data,
    })
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      actionsRef={dialogActionsRef}
    >
      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Editar especie</DialogTitle>
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
