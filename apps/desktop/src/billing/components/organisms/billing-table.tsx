import type { BillingDto } from "@sanipatitas/desktop/billing/api/billing-api"
import { BillingDetail } from "@sanipatitas/desktop/billing/components/organisms/billing-detail"
import { UpdateBilling } from "@sanipatitas/desktop/billing/components/organisms/update-billing"
import {
  useBillings,
  useDeleteBilling,
} from "@sanipatitas/desktop/billing/hook/use-billing"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sanipatitas/ui/components/ui/table"
import { Spinner } from "@sanipatitas/ui/components/ui/spinner"
import { useState } from "react"
import { toast } from "sonner"
import { TbEye, TbPencil, TbTrash } from "react-icons/tb"

// Payment status labels & colors
const paymentStatusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  PARTIAL: "Parcial",
  PAID: "Pagado",
  REFUNDED: "Reembolsado",
  CANCELLED: "Anulado",
}

const paymentStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  PARTIAL: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  REFUNDED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
}

// Component
export function BillingTable() {
  const billingsQuery = useBillings()
  const deleteMutation = useDeleteBilling()

  const billings = billingsQuery.data?.data ?? []
  const [selectedBilling, setSelectedBilling] = useState<BillingDto | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editingBilling, setEditingBilling] = useState<BillingDto | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<BillingDto | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value)

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
            "Error al eliminar la factura"
        )
      },
    })
  }

  if (billingsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <p className="text-muted-foreground text-sm">
        {billings.length} factura{billings.length !== 1 ? "s" : ""}
      </p>

      {billings.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          No hay facturas registradas.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {billings.map((billing) => (
              <TableRow key={billing.id}>
                <TableCell className="font-mono text-xs">
                  {billing.id.slice(0, 8)}...
                </TableCell>
                <TableCell>{billing.clientId.slice(0, 8)}...</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(billing.totalAmount)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={paymentStatusColors[billing.paymentStatus] ?? ""}
                  >
                    {paymentStatusLabels[billing.paymentStatus] ??
                      billing.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(billing.createdAt).toLocaleDateString("es-PE", {
                    dateStyle: "medium",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setSelectedBilling(billing)
                        setDetailOpen(true)
                      }}
                    >
                      <TbEye className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setEditingBilling(billing)
                        setEditOpen(true)
                      }}
                    >
                      <TbPencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setDeleteTarget(billing)
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

      <BillingDetail
        billing={selectedBilling}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open)
          if (!open) setSelectedBilling(null)
        }}
      />

      <UpdateBilling
        billing={editingBilling}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingBilling(null)
        }}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar factura</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar la factura #
              {deleteTarget?.id.slice(0, 8)}? Esta acción no se puede deshacer.
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
