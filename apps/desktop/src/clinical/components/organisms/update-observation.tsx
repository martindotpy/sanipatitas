import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import type {
  ObservationDto,
  OpenapiObservationCategory,
  OpenapiObservationStatus,
} from "@sanipatitas/desktop/clinical/api/clinical-api"
import { useUpdateObservation } from "@sanipatitas/desktop/clinical/hook/use-observation"
import { zOpenapiUpdateMedicalObservationRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledCombobox } from "@sanipatitas/ui/components/form/controlled/controlled-combobox"
import { ControlledDatetimeInput } from "@sanipatitas/ui/components/form/controlled/controlled-datetime-input"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
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
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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
interface UpdateObservationProps {
  observation: ObservationDto | null
  patientId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component
export function UpdateObservation({
  observation,
  patientId,
  open,
  onOpenChange,
}: UpdateObservationProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const updateMutation = useUpdateObservation()

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
      (usersQuery.data?.users ?? []).map(
        (u: { id: string; name: string; lastName?: string }) => ({
          value: u.id,
          label: `${u.name} ${u.lastName ?? ""}`,
        })
      ),
    [usersQuery.data]
  )

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiUpdateMedicalObservationRequest),
    defaultValues: {
      code: "",
      value: "",
      unit: "",
      interpretation: "",
      bodySite: "",
      method: "",
      referenceRange: "",
      category: "",
      status: "",
      issuedDate: "",
      patientId: "",
      veterinarianId: "",
    },
  })

  useEffect(() => {
    if (observation) {
      reset({
        code: observation.code ?? "",
        value: observation.value ?? "",
        unit: observation.unit ?? "",
        interpretation: observation.interpretation ?? "",
        bodySite: observation.bodySite ?? "",
        method: observation.method ?? "",
        referenceRange: observation.referenceRange ?? "",
        category: observation.category ?? "",
        status: observation.status ?? "",
        issuedDate: observation.issuedDate ?? "",
        veterinarianId: observation.veterinarian?.id ?? "",
      })
    }
  }, [observation, reset])

  const onSubmit = handleSubmit((data) => {
    if (!observation) return

    updateMutation.mutate(
      {
        id: observation.id,
        ...data,
        code: data.code,
        value: data.value!,
        unit: data.unit,
        interpretation: data.interpretation,
        bodySite: data.bodySite,
        method: data.method,
        referenceRange: data.referenceRange,
        category: data.category as OpenapiObservationCategory,
        status: data.status as OpenapiObservationStatus,
        issuedDate: data.issuedDate,
        veterinarianId: data.veterinarianId!,
        patientId,
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
        },
        onError: (error) => {
          toast.error(
            (error as { detail?: string })?.detail ??
              "Error al actualizar la observación"
          )
        },
      }
    )
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      actionsRef={dialogActionsRef}
    >
      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Editar observación</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput control={control} name="code" label="Código" />

          <ControlledInput control={control} name="value" label="Valor" />

          <ControlledInput control={control} name="unit" label="Unidad" />

          <ControlledInput
            control={control}
            name="interpretation"
            label="Interpretación"
          />

          <ControlledInput
            control={control}
            name="bodySite"
            label="Sitio corporal"
          />

          <ControlledInput control={control} name="method" label="Método" />

          <ControlledInput
            control={control}
            name="referenceRange"
            label="Rango de referencia"
          />

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

          <ControlledDatetimeInput
            control={control}
            name="issuedDate"
            mode="datetime-local"
            label="Fecha de emisión"
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
