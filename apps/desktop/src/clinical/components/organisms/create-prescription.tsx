import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreatePrescription } from "@sanipatitas/desktop/clinical/hook/use-prescription"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
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
import type { OpenapiPrescriptionStatus } from "@sanipatitas/desktop/clinical/api/clinical-api"
import { useForm, useFieldArray } from "react-hook-form"
import { TbPlus, TbTrashX } from "react-icons/tb"
import { toast } from "sonner"
import { z } from "zod"

// Options
const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Activa" },
  { value: "COMPLETED", label: "Completada" },
  { value: "CANCELLED", label: "Cancelada" },
]

// Schema
const prescriptionItemSchema = z.object({
  medicationName: z.string().min(1, "El nombre del medicamento es obligatorio"),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  route: z.string().optional(),
  notes: z.string().optional(),
})

const createPrescriptionSchema = z.object({
  issueDate: z.string().min(1, "La fecha de emisión es obligatoria"),
  expirationDate: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
  veterinarianId: z.string().min(1, "El veterinario es obligatorio"),
  items: z.array(prescriptionItemSchema).min(1, "Debe agregar al menos un medicamento"),
})

// Props
interface CreatePrescriptionProps {
  patientId: string
}

// Component
export function CreatePrescription({ patientId }: CreatePrescriptionProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const createMutation = useCreatePrescription()

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
    resolver: zodResolver(createPrescriptionSchema),
    defaultValues: {
      issueDate: "",
      expirationDate: "",
      notes: "",
      status: "ACTIVE",
      veterinarianId: "",
      items: [{ medicationName: "", dosage: "", frequency: "", duration: "", route: "", notes: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const onSubmit = handleSubmit((data) => {
    createMutation.mutate(
      {
        issueDate: data.issueDate,
        expirationDate: data.expirationDate ?? undefined,
        notes: data.notes ?? undefined,
        status: (data.status || "ACTIVE") as OpenapiPrescriptionStatus,
        patientId,
        veterinarianId: data.veterinarianId,
        items: data.items.map((item) => ({
          medicationName: item.medicationName,
          dosage: item.dosage ?? undefined,
          frequency: item.frequency ?? undefined,
          duration: item.duration ?? undefined,
          route: item.route ?? undefined,
          notes: item.notes ?? undefined,
        })),
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
          reset()
          toast.success("Receta creada correctamente")
        },
        onError: () => {
          toast.error("Error al crear la receta")
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
          <DialogTitle>Crear receta</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput
            control={control}
            name="issueDate"
            inputProps={{ type: "date" }}
            label="Fecha de emisión"
          />

          <ControlledInput
            control={control}
            name="expirationDate"
            inputProps={{ type: "date" }}
            label="Fecha de vencimiento"
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

          <ControlledTextarea control={control} name="notes" label="Notas" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Medicamentos</p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  append({
                    medicationName: "",
                    dosage: "",
                    frequency: "",
                    duration: "",
                    route: "",
                    notes: "",
                  })
                }
              >
                <TbPlus className="size-4" />
                Agregar medicamento
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Medicamento {index + 1}</p>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => remove(index)}
                      className="cursor-pointer"
                    >
                      <TbTrashX className="text-destructive size-4" />
                    </Button>
                  )}
                </div>

                <ControlledInput
                  control={control}
                  name={`items.${index}.medicationName`}
                  label="Nombre del medicamento"
                  inputProps={{ placeholder: "Ej: Amoxicilina" }}
                />

                <div className="grid grid-cols-2 gap-2">
                  <ControlledInput
                    control={control}
                    name={`items.${index}.dosage`}
                    label="Dosis"
                    inputProps={{ placeholder: "Ej: 500 mg" }}
                  />
                  <ControlledInput
                    control={control}
                    name={`items.${index}.frequency`}
                    label="Frecuencia"
                    inputProps={{ placeholder: "Ej: Cada 8 horas" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <ControlledInput
                    control={control}
                    name={`items.${index}.duration`}
                    label="Duración"
                    inputProps={{ placeholder: "Ej: 7 días" }}
                  />
                  <ControlledInput
                    control={control}
                    name={`items.${index}.route`}
                    label="Vía"
                    inputProps={{ placeholder: "Ej: Oral" }}
                  />
                </div>

                <ControlledTextarea
                  control={control}
                  name={`items.${index}.notes`}
                  label="Notas del medicamento"
                />
              </div>
            ))}
          </div>
        </FieldGroup>

        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cancelar</Button>} />
          <Button type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
