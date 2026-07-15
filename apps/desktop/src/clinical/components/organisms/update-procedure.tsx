import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateProcedure } from "@sanipatitas/desktop/clinical/hook/use-procedure"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import type {
  ProcedureDto,
  OpenapiProcedureCategory,
  OpenapiProcedureStatus,
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
import { ControlledTextarea } from "@sanipatitas/ui/components/form/controlled/controlled-textarea"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// Options
const CATEGORY_OPTIONS = [
  { value: "SURGICAL", label: "Quirúrgico" },
  { value: "DIAGNOSTIC", label: "Diagnóstico" },
  { value: "THERAPEUTIC", label: "Terapéutico" },
  { value: "PREVENTIVE", label: "Preventivo" },
  { value: "OTHER", label: "Otro" },
]

const STATUS_OPTIONS = [
  { value: "PREPARATION", label: "En preparación" },
  { value: "IN_PROGRESS", label: "En progreso" },
  { value: "COMPLETED", label: "Completado" },
  { value: "ABANDONED", label: "Abandonado" },
]

// Schema
const schema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  code: z.string().optional(),
  category: z.string().optional(),
  reason: z.string().optional(),
  outcome: z.string().optional(),
  complications: z.string().optional(),
  performedDate: z.string().optional(),
  status: z.string().optional(),
  veterinarianId: z.string().optional(),
})

// Props
interface UpdateProcedureProps {
  procedure: ProcedureDto | null
  patientId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component
export function UpdateProcedure({
  procedure,
  patientId,
  open,
  onOpenChange,
}: UpdateProcedureProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const updateMutation = useUpdateProcedure()

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
    resolver: zodResolver(schema),
    defaultValues: {
      name: undefined,
      code: undefined,
      category: undefined,
      reason: undefined,
      outcome: undefined,
      complications: undefined,
      performedDate: undefined,
      status: undefined,
      veterinarianId: undefined,
    },
  })

  useEffect(() => {
    if (procedure) {
      reset({
        name: procedure.name,
        code: procedure.code ?? undefined,
        category: procedure.category ?? undefined,
        reason: procedure.reason ?? undefined,
        outcome: procedure.outcome ?? undefined,
        complications: procedure.complications ?? undefined,
        performedDate: procedure.performedDate ?? undefined,
        status: procedure.status ?? undefined,
        veterinarianId: procedure.veterinarian?.id ?? "",
      })
    }
  }, [procedure, reset])

  const onSubmit = handleSubmit((data) => {
    if (!procedure) return

    updateMutation.mutate(
      {
        id: procedure.id,
        ...data,
        name: data.name!,
        code: data.code || undefined,
        category: data.category as OpenapiProcedureCategory | undefined,
        reason: data.reason || undefined,
        outcome: data.outcome || undefined,
        complications: data.complications || undefined,
        performedDate: data.performedDate || undefined,
        status: data.status as OpenapiProcedureStatus | undefined,
        veterinarianId: data.veterinarianId!,
        patientId,
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
        },
        onError: (error) => {
          toast.error((error as { detail?: string })?.detail ?? "Error al actualizar el procedimiento")
        },
      }
    )
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange} actionsRef={dialogActionsRef}>
      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Editar procedimiento</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput control={control} name="name" label="Nombre" />

          <ControlledInput control={control} name="code" label="Código" />

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
            name="performedDate"
            inputProps={{ type: "datetime-local" }}
            label="Fecha de realización"
          />

          <ControlledTextarea
            control={control}
            name="reason"
            label="Motivo"
          />

          <ControlledTextarea
            control={control}
            name="outcome"
            label="Resultado"
          />

          <ControlledTextarea
            control={control}
            name="complications"
            label="Complicaciones"
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
