import { usePatient } from "@sanipatitas/desktop/patient/hook/use-patient"
import { deleteApiPatientById } from "@sanipatitas/shared/api/client/sdk.gen"
import type { OpenapiPatientDto } from "@sanipatitas/shared/api/client/types.gen"
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
import { toast } from "sonner"

interface DeletePatientAlertProps {
  patients: OpenapiPatientDto[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeletePatientAlert({
  patients,
  open,
  onOpenChange,
  onSuccess,
}: DeletePatientAlertProps) {
  const patientQuery = usePatient()
  const isSingle = patients.length === 1

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(
        ids.map((id) =>
          deleteApiPatientById({ path: { id }, throwOnError: true })
        )
      )
    },
    onSuccess: () => {
      patientQuery.refetch()
      onOpenChange(false)
      onSuccess?.()
      toast.success(isSingle ? "Paciente eliminado" : "Pacientes eliminados")
    },
    onError: (error) => {
      const detail =
        error &&
        typeof error === "object" &&
        "detail" in error &&
        typeof error.detail === "string"
          ? error.detail
          : null
      toast.error(detail ?? "Error al eliminar paciente(s)")
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Eliminar {isSingle ? "paciente" : "pacientes"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isSingle
              ? `¿Estás seguro de que deseas eliminar "${patients[0]?.name}"? Esta acción no se puede deshacer.`
              : `¿Estás seguro de que deseas eliminar ${patients.length} pacientes? Esta acción no se puede deshacer.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => deleteMutation.mutate(patients.map((p) => p.id))}
          >
            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
