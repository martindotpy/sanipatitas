import type {
  BillingDto,
  BillingItemDto,
  PaymentDto,
} from "@sanipatitas/desktop/billing/api/billing-api"
import {
  useBillingItems,
  useBillingPayments,
  useCreateBillingItem,
  useCreatePayment,
} from "@sanipatitas/desktop/billing/hook/use-billing"
import { Badge } from "@sanipatitas/ui/components/ui/badge"
import { Button } from "@sanipatitas/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@sanipatitas/ui/components/ui/dialog"
import { Spinner } from "@sanipatitas/ui/components/ui/spinner"
import { TbCash, TbPackage, TbPlus } from "react-icons/tb"
import { toast } from "sonner"

// Payment status labels & colors
const paymentStatusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  PARTIAL: "Parcial",
  PAID: "Pagado",
  REFUNDED: "Reembolsado",
  CANCELLED: "Anulado",
}

const paymentStatusColors: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  PARTIAL: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  REFUNDED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
}

const paymentMethodLabels: Record<string, string> = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  TRANSFER: "Transferencia",
  CHECK: "Cheque",
  OTHER: "Otro",
}

const itemTypeLabels: Record<string, string> = {
  CONSULTATION: "Consulta",
  MEDICATION: "Medicamento",
  PROCEDURE: "Procedimiento",
  LABORATORY: "Laboratorio",
  OTHER: "Otro",
}

const formatCurrency = (value: number | string | null | undefined) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    Number(value ?? 0)
  )

function asList<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[]
  }

  if (value && typeof value === "object" && "data" in value) {
    const nested = (value as { data: unknown }).data

    if (Array.isArray(nested)) {
      return nested as T[]
    }

    if (nested && typeof nested === "object" && "data" in nested) {
      const list = (nested as { data: unknown }).data
      if (Array.isArray(list)) {
        return list as T[]
      }
    }
  }

  return []
}

// Props
interface BillingDetailProps {
  billing: BillingDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component
export function BillingDetail({
  billing,
  open,
  onOpenChange,
}: BillingDetailProps) {
  const itemsQuery = useBillingItems(billing?.id ?? null)
  const paymentsQuery = useBillingPayments(billing?.id ?? null)
  const createItemMutation = useCreateBillingItem(billing?.id ?? "")
  const createPaymentMutation = useCreatePayment(billing?.id ?? "")

  const getErrorDetail = (error: unknown) =>
    (error as { detail?: string })?.detail

  const items = asList<BillingItemDto>(itemsQuery.data)
  const payments = asList<PaymentDto>(paymentsQuery.data)

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount ?? 0), 0)
  const remaining = billing
    ? Math.max(0, Number(billing.totalAmount ?? 0) - totalPaid)
    : 0

  const handleAddPayment = () => {
    if (!billing) return
    createPaymentMutation.mutate(
      {
        billingId: billing.id,
        amount: remaining,
        paymentMethod: "CASH",
      },
      {
        onError: (error) => {
          toast.error(getErrorDetail(error) ?? "Error al registrar el pago")
        },
      }
    )
  }

  if (!billing) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="pr-8">
          <div className="flex min-w-0 items-center gap-3">
            <DialogTitle className="truncate">
              Factura #{billing.id.slice(0, 8)}
            </DialogTitle>
            <Badge className={paymentStatusColors[billing.paymentStatus] ?? ""}>
              {paymentStatusLabels[billing.paymentStatus] ??
                billing.paymentStatus}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-xs">Subtotal</p>
              <p className="text-lg font-semibold">
                {formatCurrency(billing.subtotal)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-xs">Descuento</p>
              <p className="text-lg font-semibold">
                {formatCurrency(billing.discount)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-xs">Total</p>
              <p className="text-lg font-semibold">
                {formatCurrency(billing.totalAmount)}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <TbPackage className="size-4" />
                Items
              </h4>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  if (!billing) return
                  createItemMutation.mutate(
                    {
                      billingId: billing.id,
                      description: "Nuevo item",
                      unitPrice: 0,
                      itemType: "OTHER",
                    },
                    {
                      onError: (error) => {
                        toast.error(
                          getErrorDetail(error) ?? "Error al agregar el item"
                        )
                      },
                    }
                  )
                }}
              >
                <TbPlus className="size-4" />
              </Button>
            </div>

            {itemsQuery.isLoading ? (
              <Spinner />
            ) : items.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Sin items registrados.
              </p>
            ) : (
              <div className="space-y-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.description}</span>
                      <Badge variant="outline" className="text-xs">
                        {itemTypeLabels[item.itemType] ?? item.itemType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">
                        x{item.quantity ?? 1}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.unitPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payments */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <TbCash className="size-4" />
                Pagos
              </h4>
              {remaining > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddPayment}
                >
                  <TbPlus className="size-4" />
                  Pagar {formatCurrency(remaining)}
                </Button>
              )}
            </div>

            {paymentsQuery.isLoading ? (
              <Spinner />
            ) : payments.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Sin pagos registrados.
              </p>
            ) : (
              <div className="space-y-1">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {formatCurrency(payment.amount)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {paymentMethodLabels[payment.paymentMethod] ??
                          payment.paymentMethod}
                      </Badge>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {payment.reference ?? ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {billing.notes && (
            <div>
              <h4 className="mb-1 text-sm font-medium">Notas</h4>
              <p className="text-muted-foreground text-sm">{billing.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cerrar</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
