import { CreateCondition } from "@sanipatitas/desktop/clinical/components/organisms/create-condition"
import { UpdateCondition } from "@sanipatitas/desktop/clinical/components/organisms/update-condition"
import {
  useConditions,
  useDeleteCondition,
} from "@sanipatitas/desktop/clinical/hook/use-condition"
import { $conditionQuery } from "@sanipatitas/desktop/clinical/store/condition-query-store"
import type { OpenapiMedicalConditionDto } from "@sanipatitas/shared/api/client/types.gen"
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
const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Activa",
  RESOLVED: "Resuelta",
  RELAPSE: "Recaída",
}

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive"> =
  {
    ACTIVE: "default",
    RESOLVED: "secondary",
    RELAPSE: "destructive",
  }

const SEVERITY_LABELS: Record<string, string> = {
  MILD: "Leve",
  MODERATE: "Moderada",
  SEVERE: "Grave",
}

// Props
interface ConditionTableProps {
  patientId: string
}

// Component
export function ConditionTable({ patientId }: ConditionTableProps) {
  const conditionsQuery = useConditions()
  const deleteMutation = useDeleteCondition()

  const conditions = conditionsQuery.data?.data ?? []
  const [editingCondition, setEditingCondition] =
    useState<OpenapiMedicalConditionDto | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] =
    useState<OpenapiMedicalConditionDto | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    $conditionQuery.set({ patientId, page: 0, size: 20 })
  }, [patientId])

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(
      { path: { id: deleteTarget.id } },
      {
        onSuccess: () => {
          setDeleteOpen(false)
          setDeleteTarget(null)
        },
        onError: (error) => {
          toast.error(
            (error as { detail?: string })?.detail ??
              "Error al eliminar la condición"
          )
        },
      }
    )
  }

  if (conditionsQuery.isLoading) {
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
          {conditions.length} condicion{conditions.length !== 1 ? "es" : ""}
        </p>

        <CreateCondition patientId={patientId} />
      </div>

      {conditions.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          No hay condiciones médicas registradas.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Severidad</TableHead>
              <TableHead>Veterinario</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {conditions.map((condition) => (
              <TableRow key={condition.id}>
                <TableCell className="font-medium">{condition.name}</TableCell>
                <TableCell>{condition.code ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={STATUS_VARIANTS[condition.status] ?? "default"}
                  >
                    {STATUS_LABELS[condition.status] ?? condition.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {condition.severity
                    ? (SEVERITY_LABELS[condition.severity] ??
                      condition.severity)
                    : "—"}
                </TableCell>
                <TableCell>
                  {condition.veterinarian.name}{" "}
                  {condition.veterinarian.lastName}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setEditingCondition(condition)
                        setEditOpen(true)
                      }}
                    >
                      <TbPencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setDeleteTarget(condition)
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

      <UpdateCondition
        condition={editingCondition}
        patientId={patientId}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingCondition(null)
        }}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar condición</AlertDialogTitle>
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
