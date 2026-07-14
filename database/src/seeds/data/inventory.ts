// Types
type ProductCategorySeed = {
  id: string
  name: string
  description: string
}

type SupplierSeed = {
  id: string
  name: string
  ruc: string
  contactPhone: string
}

// Product categories
export const productCategorySeed: ProductCategorySeed[] = [
  {
    id: "11111111-1111-1111-1111-111111111101",
    name: "Medicamentos",
    description: "Fármacos y medicamentos para uso veterinario",
  },
  {
    id: "11111111-1111-1111-1111-111111111102",
    name: "Vacunas",
    description: "Vacunas para mascotas",
  },
  {
    id: "11111111-1111-1111-1111-111111111103",
    name: "Insumos quirúrgicos",
    description: "Materiales e insumos para procedimientos quirúrgicos",
  },
  {
    id: "11111111-1111-1111-1111-111111111104",
    name: "Higiene y cuidado",
    description: "Productos de higiene y cuidado personal para mascotas",
  },
]

// Suppliers
export const supplierSeed: SupplierSeed[] = [
  {
    id: "11111111-1111-1111-1111-111111111201",
    name: "Laboratorios VetLife S.A.C.",
    ruc: "20123456789",
    contactPhone: "999888111",
  },
  {
    id: "11111111-1111-1111-1111-111111111202",
    name: "Distribuidora AnimalCare E.I.R.L.",
    ruc: "20987654321",
    contactPhone: "999888222",
  },
  {
    id: "11111111-1111-1111-1111-111111111203",
    name: "Proveedora PetHealth S.A.",
    ruc: "20555555555",
    contactPhone: "999888333",
  },
]
