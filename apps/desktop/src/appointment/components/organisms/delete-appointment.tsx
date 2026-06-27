import { useAppointment } from "@sanipatitas/desktop/appointment/hook/use-appointment"
import { deleteApiAppointmentByIdMutation } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import type { OpenapiAppointmentDto } from "@sanipatitas/shared/api/client/types.gen"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@sanipatitas/ui/components/ui/alert-dialog"
import { useMutation } from "@tanstack/react-query"

// Props
interface DeleteAppointmentAlertProps {
  appointments: OpenapiAppointmentDto[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteAppointmentAlert({
  appointments,
  open,
  onOpenChange,
  onSuccess,
}: DeleteAppointmentAlertProps) {
  const appointmentQuery = useAppointment()

  const deleteMutation = useMutation({
    ...deleteApiAppointmentByIdMutation(),
    onSuccess: () => {
      onOpenChange(false)
      appointmentQuery.refetch()
      onSuccess?.()
    },
  })

  const handleDelete = () => {
    for (const appointment of appointments) {
      deleteMutation.mutate({ path: { id: appointment.id } })
    }
  }

  const isSingle = appointments.length === 1
  const label = isSingle
    ? `la cita de ${appointments[0]?.patient.name}`
    : `las ${appointments.length} citas seleccionadas`

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará{isSingle ? "" : "án"}{" "}
            permanentemente {label} del sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
