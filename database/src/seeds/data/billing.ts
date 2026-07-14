// Types
type BillingSeed = {
  clientIndex: number
  subtotal: number
  discount: number
  taxAmount: number
  totalAmount: number
  notes: string
}

type BillingItemSeed = {
  billingIndex: number
  description: string
  quantity: number
  unitPrice: number
  total: number
  itemType: string
}

type PaymentSeed = {
  billingIndex: number
  amount: number
  paymentMethod: string
  reference: string
}

export const billingSeed: BillingSeed[] = [
  {
    clientIndex: 0,
    subtotal: 150.00,
    discount: 0.00,
    taxAmount: 27.00,
    totalAmount: 177.00,
    notes: "Consulta general + vacunación",
  },
  {
    clientIndex: 1,
    subtotal: 80.00,
    discount: 10.00,
    taxAmount: 12.60,
    totalAmount: 82.60,
    notes: "Control de rutina",
  },
  {
    clientIndex: 2,
    subtotal: 350.00,
    discount: 0.00,
    taxAmount: 63.00,
    totalAmount: 413.00,
    notes: "Cirugía de esterilización",
  },
  {
    clientIndex: 3,
    subtotal: 200.00,
    discount: 20.00,
    taxAmount: 32.40,
    totalAmount: 212.40,
    notes: "Limpieza dental",
  },
]

export const billingItemSeed: BillingItemSeed[] = [
  { billingIndex: 0, description: "Consulta general", quantity: 1, unitPrice: 50.00, total: 50.00, itemType: "CONSULTATION" },
  { billingIndex: 0, description: "Vacuna triple felina", quantity: 1, unitPrice: 100.00, total: 100.00, itemType: "MEDICATION" },
  { billingIndex: 1, description: "Control de peso", quantity: 1, unitPrice: 40.00, total: 40.00, itemType: "CONSULTATION" },
  { billingIndex: 1, description: "Desparasitación", quantity: 1, unitPrice: 40.00, total: 40.00, itemType: "MEDICATION" },
  { billingIndex: 2, description: "Cirugía esterilización", quantity: 1, unitPrice: 300.00, total: 300.00, itemType: "PROCEDURE" },
  { billingIndex: 2, description: "Medicamento post-op", quantity: 1, unitPrice: 50.00, total: 50.00, itemType: "MEDICATION" },
  { billingIndex: 3, description: "Limpieza dental", quantity: 1, unitPrice: 200.00, total: 200.00, itemType: "PROCEDURE" },
]

export const paymentSeed: PaymentSeed[] = [
  { billingIndex: 0, amount: 177.00, paymentMethod: "CASH", reference: "PAGO-001" },
  { billingIndex: 1, amount: 82.60, paymentMethod: "CARD", reference: "PAGO-002" },
  { billingIndex: 2, amount: 200.00, paymentMethod: "CASH", reference: "PAGO-003" },
]
