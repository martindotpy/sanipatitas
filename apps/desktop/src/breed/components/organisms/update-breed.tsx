import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useBreed } from "@sanipatitas/desktop/breed/hook/use-breed"
import { putApiBreedByIdMutation } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import type { OpenapiBreedDto } from "@sanipatitas/shared/api/client/types.gen"
import { zOpenapiUpdateBreedRequest } from "@sanipatitas/shared/api/client/zod.gen"
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

interface UpdateBreedProps {
  breed: OpenapiBreedDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateBreed({
  breed,
  open,
  onOpenChange,
}: UpdateBreedProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)

  const breedQuery = useBreed()

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiUpdateBreedRequest),
    defaultValues: {
      name: "",
      description: "",
      speciesId: "",
    },
  })

  useEffect(() => {
    if (breed) {
      reset({
        name: breed.name,
        description: breed.description ?? "",
        speciesId: breed.species.id,
      })
    }
  }, [breed, reset])

  const updateBreedMutation = useMutation({
    ...putApiBreedByIdMutation(),
    onSuccess: () => {
      dialogActionsRef.current?.close()
      breedQuery.refetch()
    },
  })

  const onSubmit = handleSubmit((data) => {
    if (!breed) return

    updateBreedMutation.mutate({
      path: { id: breed.id },
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
          <DialogTitle>Editar raza</DialogTitle>
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
