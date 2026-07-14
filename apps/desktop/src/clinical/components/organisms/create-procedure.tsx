import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateProcedure } from "@sanipatitas/desktop/clinical/hook/use-procedure"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import type { CreateProcedureRequest } from "@sanipatitas/desktop/clinical/api/clinical-api"
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
import { ControlledTextarea } from "@sanipatitas/ui/components/form/controlled/controlled-textarea"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { TbPlus } from "react-icons/tb"
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
  name: z.string().min(1, "El nombre es requerido"),
  code: z.string().optional(),
  category: z.string().optional(),
  reason: z.string().optional(),
  outcome: z.string().optional(),
  complications: z.string().optional(),
  performedDate: z.string().optional(),
  status: z.string().optional(),
  veterinarianId: z.string().min(1, "El veterinario es requerido"),
})

// Props
interface CreateProcedureProps {
  patientId: string
}

// Component
export function CreateProcedure({ patientId }: CreateProcedureProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const createMutation = useCreateProcedure()

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
      name: "",
      code: undefined,
      category: undefined,
      reason: undefined,
      outcome: undefined,
      complications: undefined,
      performedDate: undefined,
      status: undefined,
      veterinarianId: "",
    },
  })

  const onSubmit = handleSubmit((data) => {
    createMutation.mutate(
      {
        ...data,
        patientId,
        code: data.code || undefined,
        category: data.category || undefined,
        reason: data.reason || undefined,
        outcome: data.outcome || undefined,
        complications: data.complications || undefined,
        performedDate: data.performedDate || undefined,
        status: data.status || undefined,
      } as CreateProcedureRequest,
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
          reset()
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
          <DialogTitle>Crear procedimiento</DialogTitle>
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
          <Button type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
