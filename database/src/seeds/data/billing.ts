// Types
export type BillingSeed = {
  clientIndex: number
  subtotal: number
  discount: number
  taxAmount: number
  totalAmount: number
  notes: string
}

export type BillingItemSeed = {
  billingIndex: number
  description: string
  quantity: number
  unitPrice: number
  total: number
  itemType: string
}

export type PaymentSeed = {
  billingIndex: number
  amount: number
  paymentMethod: string
  reference: string
}

export const billingSeed: BillingSeed[] = [
  {
    clientIndex: 0,
    subtotal: 150.0,
    discount: 0.0,
    taxAmount: 27.0,
    totalAmount: 177.0,
    notes: "Consulta general + vacunación",
  },
  {
    clientIndex: 1,
    subtotal: 80.0,
    discount: 10.0,
    taxAmount: 12.6,
    totalAmount: 82.6,
    notes: "Control de rutina",
  },
  {
    clientIndex: 2,
    subtotal: 350.0,
    discount: 0.0,
    taxAmount: 63.0,
    totalAmount: 413.0,
    notes: "Cirugía de esterilización",
  },
  {
    clientIndex: 3,
    subtotal: 200.0,
    discount: 20.0,
    taxAmount: 32.4,
    totalAmount: 212.4,
    notes: "Limpieza dental",
  },
]

export const billingItemSeed: BillingItemSeed[] = [
  {
    billingIndex: 0,
    description: "Consulta general",
    quantity: 1,
    unitPrice: 50.0,
    total: 50.0,
    itemType: "CONSULTATION",
  },
  {
    billingIndex: 0,
    description: "Vacuna triple felina",
    quantity: 1,
    unitPrice: 100.0,
    total: 100.0,
    itemType: "MEDICATION",
  },
  {
    billingIndex: 1,
    description: "Control de peso",
    quantity: 1,
    unitPrice: 40.0,
    total: 40.0,
    itemType: "CONSULTATION",
  },
  {
    billingIndex: 1,
    description: "Desparasitación",
    quantity: 1,
    unitPrice: 40.0,
    total: 40.0,
    itemType: "MEDICATION",
  },
  {
    billingIndex: 2,
    description: "Cirugía esterilización",
    quantity: 1,
    unitPrice: 300.0,
    total: 300.0,
    itemType: "PROCEDURE",
  },
  {
    billingIndex: 2,
    description: "Medicamento post-op",
    quantity: 1,
    unitPrice: 50.0,
    total: 50.0,
    itemType: "MEDICATION",
  },
  {
    billingIndex: 3,
    description: "Limpieza dental",
    quantity: 1,
    unitPrice: 200.0,
    total: 200.0,
    itemType: "PROCEDURE",
  },
]

export const paymentSeed: PaymentSeed[] = [
  {
    billingIndex: 0,
    amount: 177.0,
    paymentMethod: "CASH",
    reference: "PAGO-001",
  },
  {
    billingIndex: 1,
    amount: 82.6,
    paymentMethod: "CARD",
    reference: "PAGO-002",
  },
  {
    billingIndex: 2,
    amount: 200.0,
    paymentMethod: "CASH",
    reference: "PAGO-003",
  },
]

// Additional billings
export const extendedBillingSeed: BillingSeed[] = [
  {
    clientIndex: 4,
    subtotal: 180.0,
    discount: 0.0,
    taxAmount: 32.4,
    totalAmount: 212.4,
    notes: "Consulta + ecografía suprarrenal hurón",
  },
  {
    clientIndex: 0,
    subtotal: 75.0,
    discount: 0.0,
    taxAmount: 13.5,
    totalAmount: 88.5,
    notes: "Vacunación antirrábica + óctuple (Max y Luna)",
  },
  {
    clientIndex: 5,
    subtotal: 45.0,
    discount: 5.0,
    taxAmount: 7.2,
    totalAmount: 47.2,
    notes: "Consulta general tortuga + suplemento vitamínico",
  },
]

export const extendedBillingItemSeed: BillingItemSeed[] = [
  {
    billingIndex: 4,
    description: "Consulta especialidad",
    quantity: 1,
    unitPrice: 80.0,
    total: 80.0,
    itemType: "CONSULTATION",
  },
  {
    billingIndex: 4,
    description: "Ecografía abdominal",
    quantity: 1,
    unitPrice: 100.0,
    total: 100.0,
    itemType: "PROCEDURE",
  },
  {
    billingIndex: 5,
    description: "Vacuna antirrábica",
    quantity: 1,
    unitPrice: 45.0,
    total: 45.0,
    itemType: "MEDICATION",
  },
  {
    billingIndex: 5,
    description: "Vacuna óctuple canina",
    quantity: 1,
    unitPrice: 30.0,
    total: 30.0,
    itemType: "MEDICATION",
  },
  {
    billingIndex: 6,
    description: "Consulta general",
    quantity: 1,
    unitPrice: 45.0,
    total: 45.0,
    itemType: "CONSULTATION",
  },
]

export const extendedPaymentSeed: PaymentSeed[] = [
  {
    billingIndex: 4,
    amount: 212.4,
    paymentMethod: "YAPE",
    reference: "PAGO-004",
  },
  {
    billingIndex: 5,
    amount: 88.5,
    paymentMethod: "TRANSFER",
    reference: "PAGO-005",
  },
  {
    billingIndex: 6,
    amount: 47.2,
    paymentMethod: "CASH",
    reference: "PAGO-006",
  },
]
