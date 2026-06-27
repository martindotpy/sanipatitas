import { type DialogRoot } from "@base-ui/react"
import { useUser } from "@sanipatitas/desktop/auth/hook/use-user"
import { useAppointment } from "@sanipatitas/desktop/appointment/hook/use-appointment"
import { getApiPatientOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { getApiClientOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { putApiAppointmentByIdMutation } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import type { OpenapiAppointmentDto } from "@sanipatitas/shared/api/client/types.gen"
import { zOpenapiUpdateAppointmentRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { zodResolver } from "@hookform/resolvers/zod"
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
} from "@sanipatitas/ui/components/ui/dialog"
import { FieldGroup } from "@sanipatitas/ui/components/ui/field"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useRef } from "react"
import { useForm } from "react-hook-form"

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

// Props
interface UpdateAppointmentProps {
  appointment: OpenapiAppointmentDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateAppointment({
  appointment,
  open,
  onOpenChange,
}: UpdateAppointmentProps) {
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
    resolver: zodResolver(zOpenapiUpdateAppointmentRequest),
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
    },
  })

  useEffect(() => {
    if (appointment) {
      reset({
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime ?? "",
        status: appointment.status,
        appointmentClass: appointment.appointmentClass,
        reason: appointment.reason ?? "",
        notes: appointment.notes ?? "",
        patientId: appointment.patient.id,
        clientId: appointment.client.id,
      })
    }
  }, [appointment, reset])

  const updateMutation = useMutation({
    ...putApiAppointmentByIdMutation(),
    onSuccess: () => {
      dialogActionsRef.current?.close()
      appointmentQuery.refetch()
    },
  })

  const onSubmit = handleSubmit((data) => {
    if (!appointment) return

    updateMutation.mutate({
      path: { id: appointment.id },
      body: {
        ...data,
        veterinarianId: user?.id ?? appointment.veterinarian.id,
        endTime: data.endTime || undefined,
        reason: data.reason || undefined,
        notes: data.notes || undefined,
        appointmentClass: (data.appointmentClass as
          | "AMBULATORY"
          | "EMERGENCY"
          | "HOME_VISIT"
          | undefined) || undefined,
      },
    })
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      actionsRef={dialogActionsRef}
    >
      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Editar cita</DialogTitle>
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

          <ControlledTextarea
            control={control}
            name="reason"
            label="Motivo"
          />

          <ControlledTextarea
            control={control}
            name="notes"
            label="Notas"
          />
        </FieldGroup>

        <DialogFooter>
          <DialogClose
            render={<Button variant="secondary">Cancelar</Button>}
          />
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
