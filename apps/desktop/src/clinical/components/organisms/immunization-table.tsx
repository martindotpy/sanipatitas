import {
  useImmunizations,
  useDeleteImmunization,
} from "@sanipatitas/desktop/clinical/hook/use-immunization"
import { $immunizationQuery } from "@sanipatitas/desktop/clinical/store/immunization-query-store"
import { CreateImmunization } from "@sanipatitas/desktop/clinical/components/organisms/create-immunization"
import { UpdateImmunization } from "@sanipatitas/desktop/clinical/components/organisms/update-immunization"
import type { ImmunizationDto } from "@sanipatitas/desktop/clinical/api/clinical-api"
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
const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Completada",
  ENTERED_IN_ERROR: "Ingresada por error",
  NOT_DONE: "No realizada",
}

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive"> = {
  COMPLETED: "default",
  ENTERED_IN_ERROR: "secondary",
  NOT_DONE: "destructive",
}

// Props
interface ImmunizationTableProps {
  patientId: string
}

// Component
export function ImmunizationTable({ patientId }: ImmunizationTableProps) {
  const immunizationsQuery = useImmunizations()
  const deleteMutation = useDeleteImmunization()

  const immunizations = immunizationsQuery.data?.data ?? []
  const [editingImmunization, setEditingImmunization] = useState<ImmunizationDto | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ImmunizationDto | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    $immunizationQuery.set({ patientId, page: 0, size: 20 })
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

  if (immunizationsQuery.isLoading) {
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
          {immunizations.length} inmunizacion{immunizations.length !== 1 ? "es" : ""}
        </p>

        <CreateImmunization patientId={patientId} />
      </div>

      {immunizations.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          No hay inmunizaciones registradas.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vacuna</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Fecha Admin.</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {immunizations.map((immunization) => (
              <TableRow key={immunization.id}>
                <TableCell className="font-medium">{immunization.vaccineName}</TableCell>
                <TableCell>{immunization.vaccineCode}</TableCell>
                <TableCell>{immunization.administrationDate}</TableCell>
                <TableCell>{immunization.lotNumber ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[immunization.status ?? ""] ?? "default"}>
                    {STATUS_LABELS[immunization.status ?? ""] ?? immunization.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setEditingImmunization(immunization)
                        setEditOpen(true)
                      }}
                    >
                      <TbPencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setDeleteTarget(immunization)
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

      <UpdateImmunization
        immunization={editingImmunization}
        patientId={patientId}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingImmunization(null)
        }}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar inmunización</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar &quot;{deleteTarget?.vaccineName}&quot;? Esta acción no se puede deshacer.
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