import type { ProcedureDto } from "@sanipatitas/desktop/clinical/api/clinical-api"
import { CreateProcedure } from "@sanipatitas/desktop/clinical/components/organisms/create-procedure"
import { UpdateProcedure } from "@sanipatitas/desktop/clinical/components/organisms/update-procedure"
import {
  useDeleteProcedure,
  useProcedures,
} from "@sanipatitas/desktop/clinical/hook/use-procedure"
import { $procedureQuery } from "@sanipatitas/desktop/clinical/store/procedure-query-store"
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
import { Badge } from "@sanipatitas/ui/components/ui/badge"
import { Button } from "@sanipatitas/ui/components/ui/button"
import { Spinner } from "@sanipatitas/ui/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sanipatitas/ui/components/ui/table"
import { useEffect, useState } from "react"
import { TbPencil, TbTrash } from "react-icons/tb"
import { toast } from "sonner"

// Labels
const CATEGORY_LABELS: Record<string, string> = {
  SURGICAL: "Quirúrgico",
  DIAGNOSTIC: "Diagnóstico",
  THERAPEUTIC: "Terapéutico",
  PREVENTIVE: "Preventivo",
  OTHER: "Otro",
}

const CATEGORY_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  SURGICAL: "destructive",
  DIAGNOSTIC: "default",
  THERAPEUTIC: "secondary",
  PREVENTIVE: "secondary",
  OTHER: "outline",
}

const STATUS_LABELS: Record<string, string> = {
  PREPARATION: "En preparación",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completado",
  ABANDONED: "Abandonado",
}

const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PREPARATION: "outline",
  IN_PROGRESS: "default",
  COMPLETED: "secondary",
  ABANDONED: "destructive",
}

// Props
interface ProcedureTableProps {
  patientId: string
}

// Component
export function ProcedureTable({ patientId }: ProcedureTableProps) {
  const proceduresQuery = useProcedures()
  const deleteMutation = useDeleteProcedure()

  const procedures = proceduresQuery.data?.data ?? []
  const [editingProcedure, setEditingProcedure] = useState<ProcedureDto | null>(
    null
  )
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ProcedureDto | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    $procedureQuery.set({ patientId, page: 0, size: 20 })
  }, [patientId])

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteOpen(false)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error(
          (error as { detail?: string })?.detail ??
            "Error al eliminar el procedimiento"
        )
      },
    })
  }

  if (proceduresQuery.isLoading) {
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
          {procedures.length} procedimiento{procedures.length !== 1 ? "s" : ""}
        </p>

        <CreateProcedure patientId={patientId} />
      </div>

      {procedures.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          No hay procedimientos registrados.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {procedures.map((procedure) => (
              <TableRow key={procedure.id}>
                <TableCell className="font-medium">{procedure.name}</TableCell>
                <TableCell>{procedure.code ?? "—"}</TableCell>
                <TableCell>
                  {procedure.category ? (
                    <Badge
                      variant={
                        CATEGORY_VARIANTS[procedure.category] ?? "default"
                      }
                    >
                      {CATEGORY_LABELS[procedure.category] ??
                        procedure.category}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {procedure.status ? (
                    <Badge
                      variant={STATUS_VARIANTS[procedure.status] ?? "default"}
                    >
                      {STATUS_LABELS[procedure.status] ?? procedure.status}
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
                        setEditingProcedure(procedure)
                        setEditOpen(true)
                      }}
                    >
                      <TbPencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setDeleteTarget(procedure)
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

      <UpdateProcedure
        procedure={editingProcedure}
        patientId={patientId}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingProcedure(null)
        }}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar procedimiento</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar &quot;{deleteTarget?.name}
              &quot;? Esta acción no se puede deshacer.
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
