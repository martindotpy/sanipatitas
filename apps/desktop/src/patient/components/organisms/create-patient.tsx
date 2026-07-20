import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePatient } from "@sanipatitas/desktop/patient/hook/use-patient"
import {
  getApiBreedOptions,
  getApiClientOptions,
  postApiPatientMutation,
} from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import type { OpenapiBreedDto } from "@sanipatitas/shared/api/client/types.gen"
import { zOpenapiCreatePatientRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { uuidV7 } from "@sanipatitas/shared/lib/uuid"
import { ControlledCheckbox } from "@sanipatitas/ui/components/form/controlled/controlled-checkbox"
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
import { useMutation, useQuery } from "@tanstack/react-query"
import { useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { TbPlus } from "react-icons/tb"
import { toast } from "sonner"

const GENDER_OPTIONS = [
  { value: "MALE", label: "Macho" },
  { value: "FEMALE", label: "Hembra" },
  { value: "UNKNOWN", label: "Desconocido" },
]

export function CreatePatient() {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)

  const patientQuery = usePatient()

  const clientsQuery = useQuery({
    ...getApiClientOptions({ query: { size: 1000 } }),
  })

  const breedsQuery = useQuery({
    ...getApiBreedOptions({ query: { size: 1000 } }),
  })

  const clientOptions = useMemo(
    () =>
      (clientsQuery.data?.data ?? []).map((c) => ({
        value: c.id,
        label: `${c.firstName} ${c.lastName} (${c.idNumber})`,
      })),
    [clientsQuery.data]
  )

  const breedOptions = useMemo(
    () =>
      (breedsQuery.data?.data ?? []).map((b: OpenapiBreedDto) => ({
        value: b.id,
        label: b.species ? `${b.name} (${b.species.name})` : b.name,
      })),
    [breedsQuery.data]
  )

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiCreatePatientRequest),
    defaultValues: {
      name: "",
      gender: undefined,
      birthDate: "",
      approximateAge: "",
      weightKg: 0,
      description: "",
      isSterilized: false,
      isDeceased: false,
      breedId: undefined,
      clientId: undefined,
    },
  })

  const createPatientMutation = useMutation({
    ...postApiPatientMutation(),
    onSuccess: () => {
      dialogActionsRef.current?.close()
      patientQuery.refetch()
      reset()
    },
    onError: (error) => {
      toast.error(
        (error as { detail?: string })?.detail ?? "Error al crear el paciente"
      )
    },
  })

  const onSubmit = handleSubmit((data) => {
    createPatientMutation.mutate({
      body: {
        id: uuidV7(),
        ...data,
        gender: data.gender,
        birthDate: data.birthDate,
        approximateAge: data.approximateAge,
        weightKg: data.weightKg,
        description: data.description,
        breedId: data.breedId,
        isSterilized: data.isSterilized,
        isDeceased: data.isDeceased,
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
          <DialogTitle>Crear paciente</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput control={control} name="name" label="Nombre" />

          <ControlledCombobox
            control={control}
            name="gender"
            label="Sexo"
            options={GENDER_OPTIONS}
            placeholder="Seleccionar sexo..."
          />

          <ControlledCombobox
            control={control}
            name="clientId"
            label="Dueño"
            options={clientOptions}
            placeholder="Buscar dueño..."
            searchPlaceholder="Buscar dueño..."
          />

          <ControlledCombobox
            control={control}
            name="breedId"
            label="Raza"
            options={breedOptions}
            placeholder="Seleccionar raza..."
            searchPlaceholder="Buscar raza..."
          />

          <ControlledInput
            control={control}
            name="birthDate"
            inputProps={{ type: "date" }}
            label="Fecha de nacimiento"
          />

          <ControlledInput
            control={control}
            name="approximateAge"
            label="Edad aproximada"
          />

          <ControlledNumberInput
            control={control}
            name="weightKg"
            label="Peso (kg)"
          />

          <ControlledCheckbox
            control={control}
            name="isSterilized"
            label="Esterilizado"
          />

          <ControlledCheckbox
            control={control}
            name="isDeceased"
            label="Fallecido"
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
