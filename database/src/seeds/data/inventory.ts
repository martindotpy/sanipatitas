// Types
export type ProductCategorySeed = {
  id: string
  name: string
  description: string
}

export type SupplierSeed = {
  id: string
  name: string
  ruc: string
  contactName: string
  contactPhone: string
  email: string
  address: string
}

export type ProductSeed = {
  id: string
  name: string
  code: string
  description: string
  price: number
  categoryId: string
  supplierId: string
}

export type StockSeed = {
  id: string
  productId: string
  quantity: number
  location: string
  minStock: number
}

export type StockMovementSeed = {
  type: "PURCHASE_ENTRY"
  quantity: number
  unitCost: number
  unitPrice: number
  reference: string
  notes: string
  stockId: string
}

// Fixed IDs for seed data references
export const CATEGORY_IDS = {
  MEDICAMENTOS: "11111111-1111-1111-1111-111111111101",
  VACUNAS: "11111111-1111-1111-1111-111111111102",
  INSUMOS_QUIRURGICOS: "11111111-1111-1111-1111-111111111103",
  HIGIENE_CUIDADO: "11111111-1111-1111-1111-111111111104",
} as const

export const SUPPLIER_IDS = {
  VETLIFE: "11111111-1111-1111-1111-111111111201",
  ANIMALCARE: "11111111-1111-1111-1111-111111111202",
  PETHEALTH: "11111111-1111-1111-1111-111111111203",
} as const

export const PRODUCT_IDS = {
  AMOXICILINA: "11111111-1111-1111-1111-111111111301",
  MELOXICAM: "11111111-1111-1111-1111-111111111302",
  VACUNA_TRIPLE: "11111111-1111-1111-1111-111111111303",
  VACUNA_ANTIRRABICA: "11111111-1111-1111-1111-111111111304",
  GASAS: "11111111-1111-1111-1111-111111111305",
  GUANTES: "11111111-1111-1111-1111-111111111306",
  SHAMPOO: "11111111-1111-1111-1111-111111111307",
  CEPILLO: "11111111-1111-1111-1111-111111111308",
} as const

export const STOCK_IDS = {
  AMOXICILINA: "11111111-1111-1111-1111-111111111401",
  MELOXICAM: "11111111-1111-1111-1111-111111111402",
  VACUNA_TRIPLE: "11111111-1111-1111-1111-111111111403",
  VACUNA_ANTIRRABICA: "11111111-1111-1111-1111-111111111404",
  GASAS: "11111111-1111-1111-1111-111111111405",
  GUANTES: "11111111-1111-1111-1111-111111111406",
  SHAMPOO: "11111111-1111-1111-1111-111111111407",
  CEPILLO: "11111111-1111-1111-1111-111111111408",
} as const

// Product categories
export const productCategorySeed: ProductCategorySeed[] = [
  {
    id: CATEGORY_IDS.MEDICAMENTOS,
    name: "Medicamentos",
    description: "Fármacos y medicamentos para uso veterinario",
  },
  {
    id: CATEGORY_IDS.VACUNAS,
    name: "Vacunas",
    description: "Vacunas para mascotas",
  },
  {
    id: CATEGORY_IDS.INSUMOS_QUIRURGICOS,
    name: "Insumos quirúrgicos",
    description: "Materiales e insumos para procedimientos quirúrgicos",
  },
  {
    id: CATEGORY_IDS.HIGIENE_CUIDADO,
    name: "Higiene y cuidado",
    description: "Productos de higiene y cuidado personal para mascotas",
  },
]

// Suppliers
export const supplierSeed: SupplierSeed[] = [
  {
    id: SUPPLIER_IDS.VETLIFE,
    name: "Laboratorios VetLife S.A.C.",
    ruc: "20123456789",
    contactName: "Carlos Mendoza",
    contactPhone: "999888111",
    email: "ventas@vetlife.pe",
    address: "Av. Los Olivos 123, Lima",
  },
  {
    id: SUPPLIER_IDS.ANIMALCARE,
    name: "Distribuidora AnimalCare E.I.R.L.",
    ruc: "20987654321",
    contactName: "María García",
    contactPhone: "999888222",
    email: "pedidos@animalcare.pe",
    address: "Jr. Las Palmeras 456, Arequipa",
  },
  {
    id: SUPPLIER_IDS.PETHEALTH,
    name: "Proveedora PetHealth S.A.",
    ruc: "20555555555",
    contactName: "José Torres",
    contactPhone: "999888333",
    email: "info@pethealth.pe",
    address: "Calle Los Sauces 789, Cusco",
  },
]

// Products
export const productSeed: ProductSeed[] = [
  {
    id: PRODUCT_IDS.AMOXICILINA,
    name: "Amoxicilina 500mg",
    code: "AMX-500",
    description: "Antibiótico de amplio espectro para infecciones bacterianas en perros y gatos",
    price: 35.00,
    categoryId: CATEGORY_IDS.MEDICAMENTOS,
    supplierId: SUPPLIER_IDS.VETLIFE,
  },
  {
    id: PRODUCT_IDS.MELOXICAM,
    name: "Meloxicam 0.5mg",
    code: "MLX-05",
    description: "Antiinflamatorio no esteroideo para control del dolor y la inflamación",
    price: 28.00,
    categoryId: CATEGORY_IDS.MEDICAMENTOS,
    supplierId: SUPPLIER_IDS.VETLIFE,
  },
  {
    id: PRODUCT_IDS.VACUNA_TRIPLE,
    name: "Vacuna Triple Felina",
    code: "VTF-001",
    description: "Vacuna combinada contra panleucopenia, calicivirus y rinotraqueítis felina",
    price: 85.00,
    categoryId: CATEGORY_IDS.VACUNAS,
    supplierId: SUPPLIER_IDS.ANIMALCARE,
  },
  {
    id: PRODUCT_IDS.VACUNA_ANTIRRABICA,
    name: "Vacuna Antirrábica",
    code: "VAR-001",
    description: "Vacuna contra la rabia para perros y gatos",
    price: 45.00,
    categoryId: CATEGORY_IDS.VACUNAS,
    supplierId: SUPPLIER_IDS.ANIMALCARE,
  },
  {
    id: PRODUCT_IDS.GASAS,
    name: "Gasas Estériles 10x10cm",
    code: "GAS-10",
    description: "Gasas estériles de algodón para curaciones y procedimientos quirúrgicos",
    price: 12.50,
    categoryId: CATEGORY_IDS.INSUMOS_QUIRURGICOS,
    supplierId: SUPPLIER_IDS.PETHEALTH,
  },
  {
    id: PRODUCT_IDS.GUANTES,
    name: "Guantes Quirúrgicos Talla M",
    code: "GQM-M",
    description: "Guantes de látex estériles para procedimientos quirúrgicos",
    price: 25.00,
    categoryId: CATEGORY_IDS.INSUMOS_QUIRURGICOS,
    supplierId: SUPPLIER_IDS.PETHEALTH,
  },
  {
    id: PRODUCT_IDS.SHAMPOO,
    name: "Shampoo Antipulgas",
    code: "SAP-001",
    description: "Shampoo medicado para el control de pulgas y garrapatas",
    price: 32.00,
    categoryId: CATEGORY_IDS.HIGIENE_CUIDADO,
    supplierId: SUPPLIER_IDS.ANIMALCARE,
  },
  {
    id: PRODUCT_IDS.CEPILLO,
    name: "Cepillo Dental para Mascotas",
    code: "CDM-001",
    description: "Cepillo dental diseñado para la limpieza de dientes de perros y gatos",
    price: 18.00,
    categoryId: CATEGORY_IDS.HIGIENE_CUIDADO,
    supplierId: SUPPLIER_IDS.PETHEALTH,
  },
]

// Stock
export const stockSeed: StockSeed[] = [
  {
    id: STOCK_IDS.AMOXICILINA,
    productId: PRODUCT_IDS.AMOXICILINA,
    quantity: 100,
    location: "Estante A1",
    minStock: 10,
  },
  {
    id: STOCK_IDS.MELOXICAM,
    productId: PRODUCT_IDS.MELOXICAM,
    quantity: 50,
    location: "Estante A2",
    minStock: 5,
  },
  {
    id: STOCK_IDS.VACUNA_TRIPLE,
    productId: PRODUCT_IDS.VACUNA_TRIPLE,
    quantity: 30,
    location: "Refrigerador B1",
    minStock: 5,
  },
  {
    id: STOCK_IDS.VACUNA_ANTIRRABICA,
    productId: PRODUCT_IDS.VACUNA_ANTIRRABICA,
    quantity: 25,
    location: "Refrigerador B2",
    minStock: 5,
  },
  {
    id: STOCK_IDS.GASAS,
    productId: PRODUCT_IDS.GASAS,
    quantity: 200,
    location: "Estante C1",
    minStock: 20,
  },
  {
    id: STOCK_IDS.GUANTES,
    productId: PRODUCT_IDS.GUANTES,
    quantity: 150,
    location: "Estante C2",
    minStock: 20,
  },
  {
    id: STOCK_IDS.SHAMPOO,
    productId: PRODUCT_IDS.SHAMPOO,
    quantity: 40,
    location: "Estante D1",
    minStock: 10,
  },
  {
    id: STOCK_IDS.CEPILLO,
    productId: PRODUCT_IDS.CEPILLO,
    quantity: 20,
    location: "Estante D2",
    minStock: 5,
  },
]

// Stock movements (initial purchase entries)
export const stockMovementSeed: StockMovementSeed[] = [
  {
    type: "PURCHASE_ENTRY",
    quantity: 100,
    unitCost: 18.00,
    unitPrice: 35.00,
    reference: "OC-001",
    notes: "Compra inicial de inventario",
    stockId: STOCK_IDS.AMOXICILINA,
  },
  {
    type: "PURCHASE_ENTRY",
    quantity: 50,
    unitCost: 14.00,
    unitPrice: 28.00,
    reference: "OC-002",
    notes: "Compra inicial de inventario",
    stockId: STOCK_IDS.MELOXICAM,
  },
  {
    type: "PURCHASE_ENTRY",
    quantity: 30,
    unitCost: 45.00,
    unitPrice: 85.00,
    reference: "OC-003",
    notes: "Compra inicial de inventario",
    stockId: STOCK_IDS.VACUNA_TRIPLE,
  },
  {
    type: "PURCHASE_ENTRY",
    quantity: 25,
    unitCost: 22.00,
    unitPrice: 45.00,
    reference: "OC-004",
    notes: "Compra inicial de inventario",
    stockId: STOCK_IDS.VACUNA_ANTIRRABICA,
  },
  {
    type: "PURCHASE_ENTRY",
    quantity: 200,
    unitCost: 6.00,
    unitPrice: 12.50,
    reference: "OC-005",
    notes: "Compra inicial de inventario",
    stockId: STOCK_IDS.GASAS,
  },
  {
    type: "PURCHASE_ENTRY",
    quantity: 150,
    unitCost: 12.00,
    unitPrice: 25.00,
    reference: "OC-006",
    notes: "Compra inicial de inventario",
    stockId: STOCK_IDS.GUANTES,
  },
  {
    type: "PURCHASE_ENTRY",
    quantity: 40,
    unitCost: 16.00,
    unitPrice: 32.00,
    reference: "OC-007",
    notes: "Compra inicial de inventario",
    stockId: STOCK_IDS.SHAMPOO,
  },
  {
    type: "PURCHASE_ENTRY",
    quantity: 20,
    unitCost: 9.00,
    unitPrice: 18.00,
    reference: "OC-008",
    notes: "Compra inicial de inventario",
    stockId: STOCK_IDS.CEPILLO,
  },
]
