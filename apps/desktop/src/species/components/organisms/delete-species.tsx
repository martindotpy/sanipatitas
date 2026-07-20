import { useSpecies } from "@sanipatitas/desktop/species/hook/use-species"
import { deleteApiSpeciesById } from "@sanipatitas/shared/api/client/sdk.gen"
import type { OpenapiSpeciesDto } from "@sanipatitas/shared/api/client/types.gen"
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

// Types
interface DeleteSpeciesAlertProps {
  species: OpenapiSpeciesDto[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

// Component
export function DeleteSpeciesAlert({
  species,
  open,
  onOpenChange,
  onSuccess,
}: DeleteSpeciesAlertProps) {
  // Query
  const speciesQuery = useSpecies()

  // Mutation
  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => deleteApiSpeciesById({ path: { id } })))
    },
    onSuccess: () => {
      speciesQuery.refetch()
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(
        (error as { detail?: string })?.detail ?? "Error al eliminar especie(s)"
      )
    },
  })

  const isSingle = species.length === 1

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Eliminar {isSingle ? "especie" : "especies"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isSingle
              ? `¿Estás seguro de que deseas eliminar "${species[0]?.name}"? Esta acción no se puede deshacer.`
              : `¿Estás seguro de que deseas eliminar ${species.length} especies? Esta acción no se puede deshacer.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => deleteMutation.mutate(species.map((s) => s.id))}
          >
            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
