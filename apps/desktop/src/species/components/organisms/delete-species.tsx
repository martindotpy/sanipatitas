import { type DialogRoot } from "@base-ui/react"
import { useSpecies } from "@sanipatitas/desktop/species/hook/use-species"
import { deleteApiSpeciesByIdMutation } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import type { OpenapiSpeciesDto } from "@sanipatitas/shared/api/client/types.gen"
import { Button } from "@sanipatitas/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@sanipatitas/ui/components/ui/dialog"
import { useMutation } from "@tanstack/react-query"
import { useRef } from "react"

// Types
interface DeleteSpeciesProps {
  species: OpenapiSpeciesDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component
export function DeleteSpecies({
  species,
  open,
  onOpenChange,
}: DeleteSpeciesProps) {
  // Dialog
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)

  // Query
  const speciesQuery = useSpecies()

  // Mutation
  const deleteSpeciesMutation = useMutation({
    ...deleteApiSpeciesByIdMutation(),
    onSuccess: () => {
      dialogActionsRef.current?.close()
      speciesQuery.refetch()
    },
  })

  const handleDelete = () => {
    if (!species) return

    deleteSpeciesMutation.mutate({
      path: { id: species.id },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      actionsRef={dialogActionsRef}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar especie</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar "{species?.name}"? Esta acción
            no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cancelar</Button>} />
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteSpeciesMutation.isPending}
          >
            {deleteSpeciesMutation.isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
