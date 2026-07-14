import {
  useObservations,
  useDeleteObservation,
} from "@sanipatitas/desktop/clinical/hook/use-observation"
import { $observationQuery } from "@sanipatitas/desktop/clinical/store/observation-query-store"
import { CreateObservation } from "@sanipatitas/desktop/clinical/components/organisms/create-observation"
import { UpdateObservation } from "@sanipatitas/desktop/clinical/components/organisms/update-observation"
import type { ObservationDto } from "@sanipatitas/desktop/clinical/api/clinical-api"
import { Button } from "@sanipatitas/ui/components/ui/button"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sanipatitas/ui/components/ui/table"
import { Badge } from "@sanipatitas/ui/components/ui/badge"
import { Spinner } from "@sanipatitas/ui/components/ui/spinner"
import { useEffect, useState } from "react"
import { TbPencil, TbTrash } from "react-icons/tb"

// Labels
const CATEGORY_LABELS: Record<string, string> = {
  VITAL_SIGNS: "Signos Vitales",
  LABORATORY: "Laboratorio",
  EXAM: "Examen",
  GENERAL: "General",
}

const CATEGORY_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  VITAL_SIGNS: "default",
  LABORATORY: "secondary",
  EXAM: "outline",
  GENERAL: "default",
}

const STATUS_LABELS: Record<string, string> = {
  PRELIMINARY: "Preliminar",
  FINAL: "Final",
  AMENDED: "Modificado",
  CANCELLED: "Cancelado",
}

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive"> = {
  PRELIMINARY: "secondary",
  FINAL: "default",
  AMENDED: "default",
  CANCELLED: "destructive",
}

// Props
interface ObservationTableProps {
  patientId: string
}

// Component
export function ObservationTable({ patientId }: ObservationTableProps) {
  const observationsQuery = useObservations()
  const deleteMutation = useDeleteObservation()

  const observations = observationsQuery.data?.data ?? []
  const [editingObservation, setEditingObservation] = useState<ObservationDto | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ObservationDto | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    $observationQuery.set({ patientId, page: 0, size: 20 })
  }, [patientId])

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(
      deleteTarget.id,
      {
        onSuccess: () => {
          setDeleteOpen(false)
          setDeleteTarget(null)
        },
      }
    )
  }

  if (observationsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {observations.length} observación{observations.length !== 1 ? "es" : ""}
        </p>

        <CreateObservation patientId={patientId} />
      </div>

      {observations.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          No hay observaciones registradas.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {observations.map((observation) => (
              <TableRow key={observation.id}>
                <TableCell className="font-medium">{observation.code}</TableCell>
                <TableCell>{observation.value}</TableCell>
                <TableCell>{observation.unit ?? "—"}</TableCell>
                <TableCell>
                  {observation.category ? (
                    <Badge variant={CATEGORY_VARIANTS[observation.category] ?? "default"}>
                      {CATEGORY_LABELS[observation.category] ?? observation.category}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {observation.status ? (
                    <Badge variant={STATUS_VARIANTS[observation.status] ?? "default"}>
                      {STATUS_LABELS[observation.status] ?? observation.status}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setEditingObservation(observation)
                        setEditOpen(true)
                      }}
                    >
                      <TbPencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setDeleteTarget(observation)
                        setDeleteOpen(true)
                      }}
                    >
                      <TbTrash className="text-destructive size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <UpdateObservation
        observation={editingObservation}
        patientId={patientId}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingObservation(null)
        }}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar observación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar &quot;{deleteTarget?.code}&quot;? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}