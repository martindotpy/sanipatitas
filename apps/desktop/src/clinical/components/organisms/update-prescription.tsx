import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import type {
  OpenapiPrescriptionStatus,
  PrescriptionDto,
} from "@sanipatitas/desktop/clinical/api/clinical-api"
import { useUpdatePrescription } from "@sanipatitas/desktop/clinical/hook/use-prescription"
import { zOpenapiUpdatePrescriptionRequest } from "@sanipatitas/shared/api/client/zod.gen"
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
import { useFieldArray, useForm } from "react-hook-form"
import { TbPlus, TbTrashX } from "react-icons/tb"
import { toast } from "sonner"

// Options
const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Activa" },
  { value: "COMPLETED", label: "Completada" },
  { value: "CANCELLED", label: "Cancelada" },
]

// Props
interface UpdatePrescriptionProps {
  prescription: PrescriptionDto | null
  patientId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component
export function UpdatePrescription({
  prescription,
  patientId,
  open,
  onOpenChange,
}: UpdatePrescriptionProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const updateMutation = useUpdatePrescription()

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
    resolver: zodResolver(zOpenapiUpdatePrescriptionRequest),
    defaultValues: {
      issueDate: "",
      expirationDate: "",
      notes: "",
      status: "",
      patientId: "",
      veterinarianId: "",
      items: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  useEffect(() => {
    if (prescription) {
      reset({
        issueDate: prescription.issueDate ?? "",
        expirationDate: prescription.expirationDate ?? "",
        notes: prescription.notes ?? "",
        status: prescription.status ?? "",
        veterinarianId: prescription.veterinarian?.id ?? "",
        items: prescription.items.map((item) => ({
          medicationName: item.medicationName,
          dosage: item.dosage ?? "",
          frequency: item.frequency ?? "",
          duration: item.duration ?? "",
          route: item.route ?? "",
          notes: item.notes ?? "",
        })),
      })
    }
  }, [prescription, reset])

  const onSubmit = handleSubmit((data) => {
    if (!prescription) return

    updateMutation.mutate(
      {
        id: prescription.id,
        body: {
          issueDate: data.issueDate!,
          expirationDate: data.expirationDate,
          notes: data.notes,
          status: data.status as OpenapiPrescriptionStatus,
          patientId,
          veterinarianId: data.veterinarianId!,
          items: (data.items ?? []).map((item) => ({
            medicationName: item.medicationName,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            route: item.route,
            notes: item.notes,
          })),
        },
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
          toast.success("Receta actualizada correctamente")
        },
        onError: (error) => {
          toast.error(
            (error as { detail?: string })?.detail ??
              "Error al actualizar la receta"
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
          <DialogTitle>Editar receta</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledDatetimeInput
            control={control}
            name="issueDate"
            mode="date"
            label="Fecha de emisión"
          />

          <ControlledDatetimeInput
            control={control}
            name="expirationDate"
            mode="date"
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
              <div key={field.id} className="space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-xs">
                    Medicamento {index + 1}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(index)}
                    className="cursor-pointer"
                  >
                    <TbTrashX className="text-destructive size-4" />
                  </Button>
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
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
