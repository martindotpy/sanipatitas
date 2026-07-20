import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useBreed } from "@sanipatitas/desktop/breed/hook/use-breed"
import {
  getApiSpeciesOptions,
  putApiBreedByIdMutation,
} from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import type { OpenapiBreedDto } from "@sanipatitas/shared/api/client/types.gen"
import { zOpenapiUpdateBreedRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledCombobox } from "@sanipatitas/ui/components/form/controlled/controlled-combobox"
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
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface UpdateBreedProps {
  breed: OpenapiBreedDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateBreed({ breed, open, onOpenChange }: UpdateBreedProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)

  const breedQuery = useBreed()

  const speciesQuery = useQuery({
    ...getApiSpeciesOptions(),
  })

  const speciesOptions = useMemo(
    () =>
      (speciesQuery.data?.data ?? []).map((s) => ({
        value: s.id,
        label: s.name,
      })),
    [speciesQuery.data]
  )

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiUpdateBreedRequest),
    defaultValues: {
      name: "",
      description: "",
      speciesId: undefined,
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
    onError: (error) => {
      toast.error(
        (error as { detail?: string })?.detail ?? "Error al actualizar la raza"
      )
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
          <ControlledCombobox
            control={control}
            name="speciesId"
            label="Especie"
            options={speciesOptions}
            placeholder="Seleccionar especie..."
            searchPlaceholder="Buscar especie..."
          />
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
