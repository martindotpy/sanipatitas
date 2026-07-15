import {
  usePrescriptions,
  useDeletePrescription,
} from "@sanipatitas/desktop/clinical/hook/use-prescription"
import { $prescriptionQuery } from "@sanipatitas/desktop/clinical/store/prescription-query-store"
import { CreatePrescription } from "@sanipatitas/desktop/clinical/components/organisms/create-prescription"
import { UpdatePrescription } from "@sanipatitas/desktop/clinical/components/organisms/update-prescription"
import type { PrescriptionDto } from "@sanipatitas/desktop/clinical/api/clinical-api"
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
import { toast } from "sonner"

// Labels
const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Activa",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
}

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive"> = {
  ACTIVE: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
}

// Props
interface PrescriptionTableProps {
  patientId: string
}

// Component
export function PrescriptionTable({ patientId }: PrescriptionTableProps) {
  const prescriptionsQuery = usePrescriptions()
  const deleteMutation = useDeletePrescription()

  const prescriptions = prescriptionsQuery.data?.data ?? []
  const [editingPrescription, setEditingPrescription] = useState<PrescriptionDto | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PrescriptionDto | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    $prescriptionQuery.set({ patientId, page: 0, size: 20 })
  }, [patientId])

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteOpen(false)
        setDeleteTarget(null)
        toast.success("Receta eliminada correctamente")
      },
      onError: (error) => {
        toast.error((error as { detail?: string })?.detail ?? "Error al eliminar la receta")
      },
    })
  }

  if (prescriptionsQuery.isLoading) {
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
          {prescriptions.length} receta{prescriptions.length !== 1 ? "s" : ""}
        </p>

        <CreatePrescription patientId={patientId} />
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          No hay recetas registradas.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha Emisión</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Medicamentos</TableHead>
              <TableHead>Veterinario</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell className="font-medium">
                  {new Date(prescription.issueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[prescription.status ?? ""] ?? "default"}>
                    {STATUS_LABELS[prescription.status ?? ""] ?? prescription.status}
                  </Badge>
                </TableCell>
                <TableCell>{prescription.items.length} medicamento{prescription.items.length !== 1 ? "s" : ""}</TableCell>
                <TableCell>
                  {prescription.veterinarian?.name} {prescription.veterinarian?.lastName ?? ""}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setEditingPrescription(prescription)
                        setEditOpen(true)
                      }}
                    >
                      <TbPencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setDeleteTarget(prescription)
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

      <UpdatePrescription
        prescription={editingPrescription}
        patientId={patientId}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingPrescription(null)
        }}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar receta</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta receta? Esta acción no se puede deshacer.
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
