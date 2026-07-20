import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import { useUpdateCondition } from "@sanipatitas/desktop/clinical/hook/use-condition"
import type { OpenapiMedicalConditionDto } from "@sanipatitas/shared/api/client/types.gen"
import { zOpenapiUpdateMedicalConditionRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledCombobox } from "@sanipatitas/ui/components/form/controlled/controlled-combobox"
import { ControlledDatetimeInput } from "@sanipatitas/ui/components/form/controlled/controlled-datetime-input"
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
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

// Options
const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Activa" },
  { value: "RESOLVED", label: "Resuelta" },
  { value: "RELAPSE", label: "Recaída" },
]

const SEVERITY_OPTIONS = [
  { value: "MILD", label: "Leve" },
  { value: "MODERATE", label: "Moderada" },
  { value: "SEVERE", label: "Grave" },
]

// Props
interface UpdateConditionProps {
  condition: OpenapiMedicalConditionDto | null
  patientId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component
export function UpdateCondition({
  condition,
  patientId,
  open,
  onOpenChange,
}: UpdateConditionProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const updateMutation = useUpdateCondition()

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
    resolver: zodResolver(zOpenapiUpdateMedicalConditionRequest),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      onsetDate: "",
      status: undefined,
      severity: undefined,
      patientId,
      veterinarianId: undefined,
    },
  })

  useEffect(() => {
    if (condition) {
      reset({
        name: condition.name,
        code: condition.code ?? "",
        description: condition.description ?? "",
        onsetDate: condition.onsetDate ?? "",
        status: condition.status ?? "",
        severity: condition.severity ?? undefined,
        patientId,
        veterinarianId: condition.veterinarian.id,
      })
    }
  }, [condition, reset, patientId])

  const onSubmit = handleSubmit((data) => {
    if (!condition) return

    updateMutation.mutate(
      {
        path: { id: condition.id },
        body: {
          ...data,
          patientId,
          code: data.code,
          description: data.description,
          status: data.status,
          severity: data.severity,
        },
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
        },
        onError: (error) => {
          toast.error(
            (error as { detail?: string })?.detail ??
              "Error al actualizar la condición"
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
          <DialogTitle>Editar condición médica</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput control={control} name="name" label="Nombre" />

          <ControlledInput
            control={control}
            name="code"
            label="Código (CIE-10)"
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
            name="severity"
            label="Severidad"
            options={SEVERITY_OPTIONS}
            placeholder="Seleccionar severidad..."
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
            name="onsetDate"
            mode="datetime-local"
            label="Fecha de inicio"
          />

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
