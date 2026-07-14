import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateObservation } from "@sanipatitas/desktop/clinical/hook/use-observation"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import type {
  ObservationDto,
  OpenapiObservationCategory,
  OpenapiObservationStatus,
} from "@sanipatitas/desktop/clinical/api/clinical-api"
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
import { ControlledCombobox } from "@sanipatitas/ui/components/form/controlled/controlled-combobox"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Schema
const updateObservationSchema = z.object({
  code: z.string().optional(),
  value: z.string().optional(),
  unit: z.string().optional(),
  interpretation: z.string().optional(),
  bodySite: z.string().optional(),
  method: z.string().optional(),
  referenceRange: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  issuedDate: z.string().optional(),
  veterinarianId: z.string().optional(),
})

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
      (usersQuery.data?.users ?? []).map((u: { id: string; name: string; lastName?: string }) => ({
        value: u.id,
        label: `${u.name} ${u.lastName ?? ""}`,
      })),
    [usersQuery.data]
  )

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(updateObservationSchema),
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
      veterinarianId: "",
    },
  })

  useEffect(() => {
    if (observation) {
      reset({
        code: observation.code ?? "",
        value: observation.value ?? "",
        unit: observation.unit ?? undefined,
        interpretation: observation.interpretation ?? undefined,
        bodySite: observation.bodySite ?? undefined,
        method: observation.method ?? undefined,
        referenceRange: observation.referenceRange ?? undefined,
        category: observation.category ?? undefined,
        status: observation.status ?? undefined,
        issuedDate: observation.issuedDate ?? undefined,
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
        code: data.code || undefined,
        value: data.value!,
        unit: data.unit || undefined,
        interpretation: data.interpretation || undefined,
        bodySite: data.bodySite || undefined,
        method: data.method || undefined,
        referenceRange: data.referenceRange || undefined,
        category: data.category as OpenapiObservationCategory | undefined,
        status: data.status as OpenapiObservationStatus | undefined,
        issuedDate: data.issuedDate || undefined,
        veterinarianId: data.veterinarianId!,
        patientId,
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
        },
      }
    )
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange} actionsRef={dialogActionsRef}>
      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Editar observación</DialogTitle>
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
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}