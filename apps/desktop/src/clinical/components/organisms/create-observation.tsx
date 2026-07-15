import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateObservation } from "@sanipatitas/desktop/clinical/hook/use-observation"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import { zOpenapiCreateMedicalObservationRequest } from "@sanipatitas/shared/api/client/zod.gen"
import type {
  OpenapiObservationCategory,
  OpenapiObservationStatus,
} from "@sanipatitas/shared/api/client/types.gen"
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
import { ControlledCombobox } from "@sanipatitas/ui/components/form/controlled/controlled-combobox"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { TbPlus } from "react-icons/tb"

// Options
const CATEGORY_OPTIONS = [
  { value: "VITAL_SIGNS", label: "Signos Vitales" },
  { value: "LABORATORY", label: "Laboratorio" },
  { value: "EXAM", label: "Examen" },
  { value: "GENERAL", label: "General" },
]

const STATUS_OPTIONS = [
  { value: "PRELIMINARY", label: "Preliminar" },
  { value: "FINAL", label: "Final" },
  { value: "AMENDED", label: "Modificado" },
  { value: "CANCELLED", label: "Cancelado" },
]

// Props
interface CreateObservationProps {
  patientId: string
}

// Component
export function CreateObservation({ patientId }: CreateObservationProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const createMutation = useCreateObservation()

  const usersQuery = useQuery({
    queryKey: ["auth-users"],
    queryFn: async () => {
      const result = await authClient.admin.listUsers({
        query: { limit: 100 },
        fetchOptions: { throw: true },
      })
      return result
    },
  })

  const userOptions = useMemo(
    () =>
      (usersQuery.data?.users ?? []).map((u: { id: string; name: string; lastName?: string }) => ({
        value: u.id,
        label: `${u.name} ${u.lastName ?? ""}`,
      })),
    [usersQuery.data]
  )

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiCreateMedicalObservationRequest),
    defaultValues: {
      code: "",
      value: "",
      unit: undefined,
      interpretation: undefined,
      bodySite: undefined,
      method: undefined,
      referenceRange: undefined,
      category: undefined,
      status: undefined,
      issuedDate: undefined,
      patientId,
      veterinarianId: "",
    },
  })

  const onSubmit = handleSubmit((data) => {
    // Transform datetime-local value to ISO format (add seconds)
    const issuedDate = data.issuedDate ? `${data.issuedDate}:00` : undefined

    createMutation.mutate(
      {
        code: data.code,
        value: data.value,
        unit: data.unit || undefined,
        interpretation: data.interpretation || undefined,
        bodySite: data.bodySite || undefined,
        method: data.method || undefined,
        referenceRange: data.referenceRange || undefined,
        category: data.category as OpenapiObservationCategory | undefined,
        status: data.status as OpenapiObservationStatus | undefined,
        issuedDate,
        patientId,
        veterinarianId: data.veterinarianId,
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
          reset()
        },
        onError: (error) => {
          toast.error((error as { detail?: string })?.detail ?? "Error al crear la observación")
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

      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Crear observación</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput control={control} name="code" label="Código" />

          <ControlledInput control={control} name="value" label="Valor" />

          <ControlledInput control={control} name="unit" label="Unidad" />

          <ControlledInput control={control} name="interpretation" label="Interpretación" />

          <ControlledInput control={control} name="bodySite" label="Sitio corporal" />

          <ControlledInput control={control} name="method" label="Método" />

          <ControlledInput control={control} name="referenceRange" label="Rango de referencia" />

          <ControlledCombobox
            control={control}
            name="category"
            label="Categoría"
            options={CATEGORY_OPTIONS}
            placeholder="Seleccionar categoría..."
          />

          <ControlledCombobox
            control={control}
            name="status"
            label="Estado"
            options={STATUS_OPTIONS}
            placeholder="Seleccionar estado..."
          />

          <ControlledCombobox
            control={control}
            name="veterinarianId"
            label="Veterinario"
            options={userOptions}
            placeholder="Seleccionar veterinario..."
            searchPlaceholder="Buscar veterinario..."
          />

          <ControlledInput
            control={control}
            name="issuedDate"
            inputProps={{ type: "datetime-local" }}
            label="Fecha de emisión"
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
