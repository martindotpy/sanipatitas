import { useBreed } from "@sanipatitas/desktop/breed/hook/use-breed"
import { deleteApiBreedById } from "@sanipatitas/shared/api/client/sdk.gen"
import type { OpenapiBreedDto } from "@sanipatitas/shared/api/client/types.gen"
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

interface DeleteBreedAlertProps {
  breeds: OpenapiBreedDto[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteBreedAlert({
  breeds,
  open,
  onOpenChange,
  onSuccess,
}: DeleteBreedAlertProps) {
  const breedQuery = useBreed()

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => deleteApiBreedById({ path: { id } })))
    },
    onSuccess: () => {
      breedQuery.refetch()
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(
        (error as { detail?: string })?.detail ?? "Error al eliminar raza(s)"
      )
    },
  })

  const isSingle = breeds.length === 1

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Eliminar {isSingle ? "raza" : "razas"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isSingle
              ? `¿Estás seguro de que deseas eliminar "${breeds[0]?.name}"? Esta acción no se puede deshacer.`
              : `¿Estás seguro de que deseas eliminar ${breeds.length} razas? Esta acción no se puede deshacer.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => deleteMutation.mutate(breeds.map((s) => s.id))}
          >
            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
