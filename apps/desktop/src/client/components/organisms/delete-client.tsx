import { useClient } from "@sanipatitas/desktop/client/hook/use-client"
import { deleteApiClientById } from "@sanipatitas/shared/api/client/sdk.gen"
import type { OpenapiClientDto } from "@sanipatitas/shared/api/client/types.gen"
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

interface DeleteClientAlertProps {
  clients: OpenapiClientDto[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteClientAlert({
  clients,
  open,
  onOpenChange,
  onSuccess,
}: DeleteClientAlertProps) {
  const clientQuery = useClient()
  const isSingle = clients.length === 1
  const clientName = isSingle
    ? `${clients[0]?.firstName} ${clients[0]?.lastName}`
    : ""

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(
        ids.map((id) => deleteApiClientById({ path: { id }, throwOnError: true }))
      )
    },
    onSuccess: () => {
      clientQuery.refetch()
      onOpenChange(false)
      onSuccess?.()
      toast.success(isSingle ? "Cliente eliminado" : "Clientes eliminados")
    },
    onError: (error) => {
      const detail =
        error && typeof error === "object" && "detail" in error && typeof error.detail === "string"
          ? error.detail
          : null
      toast.error(detail ?? "Error al eliminar cliente(s)")
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Eliminar {isSingle ? "cliente" : "clientes"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isSingle
              ? `¿Estás seguro de que deseas eliminar "${clientName}"? Esta acción no se puede deshacer.`
              : `¿Estás seguro de que deseas eliminar ${clients.length} clientes? Esta acción no se puede deshacer.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() =>
              deleteMutation.mutate(clients.map((c) => c.id))
            }
          >
            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
