import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppointment } from "@sanipatitas/desktop/appointment/hook/use-appointment"
import { useUser } from "@sanipatitas/desktop/auth/hook/use-user"
import {
  getApiClientOptions,
  getApiPatientOptions,
  postApiAppointmentMutation,
} from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { zOpenapiCreateAppointmentRequest } from "@sanipatitas/shared/api/client/zod.gen"
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
import { useMutation, useQuery } from "@tanstack/react-query"
import { useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { TbPlus } from "react-icons/tb"
import { toast } from "sonner"

// Constants
const STATUS_OPTIONS = [
  { value: "SCHEDULED", label: "Programada" },
  { value: "IN_PROGRESS", label: "En curso" },
  { value: "COMPLETED", label: "Completada" },
  { value: "CANCELLED", label: "Cancelada" },
  { value: "NO_SHOW", label: "No asistió" },
]

const CLASS_OPTIONS = [
  { value: "AMBULATORY", label: "Ambulatorio" },
  { value: "EMERGENCY", label: "Emergencia" },
  { value: "HOME_VISIT", label: "Visita domiciliaria" },
]

export function CreateAppointment() {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const user = useUser()

  const appointmentQuery = useAppointment()

  const patientsQuery = useQuery({
    ...getApiPatientOptions({ query: { size: 1000 } }),
  })

  const clientsQuery = useQuery({
    ...getApiClientOptions({ query: { size: 1000 } }),
  })

  const patientOptions = useMemo(
    () =>
      (patientsQuery.data?.data ?? []).map((p) => ({
        value: p.id,
        label: `${p.name} - ${p.client.firstName} ${p.client.lastName}`,
      })),
    [patientsQuery.data]
  )

  const clientOptions = useMemo(
    () =>
      (clientsQuery.data?.data ?? []).map((c) => ({
        value: c.id,
        label: `${c.firstName} ${c.lastName} (${c.idNumber})`,
      })),
    [clientsQuery.data]
  )

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiCreateAppointmentRequest),
    defaultValues: {
      date: "",
      startTime: "",
      endTime: "",
      status: "SCHEDULED",
      appointmentClass: "AMBULATORY",
      reason: "",
      notes: "",
      patientId: "",
      clientId: "",
      veterinarianId: user?.id ?? "",
    },
  })

  const createMutation = useMutation({
    ...postApiAppointmentMutation(),
    onSuccess: () => {
      dialogActionsRef.current?.close()
      appointmentQuery.refetch()
      reset()
    },
    onError: (error) => {
      toast.error(
        (error as { detail?: string })?.detail ?? "Error al crear la cita"
      )
    },
  })

  const onSubmit = handleSubmit((data) => {
    createMutation.mutate({
      body: {
        id: uuidV7(),
        ...data,
        endTime: data.endTime,
        reason: data.reason,
        notes: data.notes,
        appointmentClass: data.appointmentClass as
          "AMBULATORY" | "EMERGENCY" | "HOME_VISIT",
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
          <DialogTitle>Crear cita</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <ControlledInput
              control={control}
              name="date"
              inputProps={{ type: "date" }}
              label="Fecha"
            />
            <ControlledInput
              control={control}
              name="startTime"
              inputProps={{ type: "time" }}
              label="Hora inicio"
            />
            <ControlledInput
              control={control}
              name="endTime"
              inputProps={{ type: "time" }}
              label="Hora fin"
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
              name="appointmentClass"
              label="Tipo"
              options={CLASS_OPTIONS}
              placeholder="Seleccionar tipo..."
            />
          </div>

          <ControlledCombobox
            control={control}
            name="patientId"
            label="Paciente"
            options={patientOptions}
            placeholder="Buscar paciente..."
            searchPlaceholder="Buscar paciente..."
          />

          <ControlledCombobox
            control={control}
            name="clientId"
            label="Dueño"
            options={clientOptions}
            placeholder="Buscar dueño..."
            searchPlaceholder="Buscar dueño..."
          />

          <ControlledTextarea control={control} name="reason" label="Motivo" />

          <ControlledTextarea control={control} name="notes" label="Notas" />
        </FieldGroup>

        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cancelar</Button>} />
          <Button type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
