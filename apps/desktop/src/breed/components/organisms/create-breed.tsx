import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useBreed } from "@sanipatitas/desktop/breed/hook/use-breed"
import { useSpecies } from "@sanipatitas/desktop/species/hook/use-species"
import { postApiBreedMutation } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { zOpenapiCreateBreedRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { uuidV7 } from "@sanipatitas/shared/lib/uuid"
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
  DialogTrigger,
} from "@sanipatitas/ui/components/ui/dialog"
import { FieldGroup } from "@sanipatitas/ui/components/ui/field"
import { useMutation } from "@tanstack/react-query"
import { useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { TbPlus } from "react-icons/tb"
import { toast } from "sonner"

export function CreateBreed() {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)

  const breedQuery = useBreed()
  const speciesQuery = useSpecies()

  const speciesOptions = useMemo(
    () =>
      (speciesQuery.data?.data ?? []).map((s) => ({
        value: s.id,
        label: s.name,
      })),
    [speciesQuery.data]
  )

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiCreateBreedRequest),
    defaultValues: {
      name: "",
      description: "",
      speciesId: undefined,
    },
  })

  const createBreedMutation = useMutation({
    ...postApiBreedMutation(),
    onSuccess: () => {
      dialogActionsRef.current?.close()
      breedQuery.refetch()
      reset()
    },
    onError: (error) => {
      toast.error(
        (error as { detail?: string })?.detail ?? "Error al crear la raza"
      )
    },
  })

  const onSubmit = handleSubmit((data) => {
    createBreedMutation.mutate({
      body: {
        id: uuidV7(),
        ...data,
      },
    })
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
          <DialogTitle>Crear raza</DialogTitle>
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
          <Button type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
