// Types
export type MedicalConditionSeed = {
  patientIndex: number
  name: string
  code?: string
  description?: string
  onsetDate?: string
  status: "ACTIVE" | "RESOLVED" | "RELAPSE"
  severity?: "MILD" | "MODERATE" | "SEVERE"
}

export type MedicalObservationSeed = {
  patientIndex: number
  category: "VITAL_SIGNS" | "LABORATORY" | "EXAM" | "GENERAL"
  code: string
  value: string
  unit?: string
  interpretation?: string
  bodySite?: string
  method?: string
  referenceRange?: string
  status: "PRELIMINARY" | "FINAL" | "AMENDED" | "CANCELLED"
  issuedDate?: string
}

export type ImmunizationSeed = {
  patientIndex: number
  vaccineCode: string
  vaccineName: string
  manufacturer?: string
  lotNumber?: string
  expirationDate?: string
  administrationDate: string
  doseNumber?: string
  doseUnit?: string
  route?: "SUBCUTANEOUS" | "INTRAMUSCULAR" | "ORAL" | "INTRADERMAL" | "TOPICAL"
  site?: string
  reaction?: string
  status: "COMPLETED" | "ENTERED_IN_ERROR" | "NOT_DONE"
}

export type ProcedureSeed = {
  patientIndex: number
  code?: string
  name: string
  category?: "SURGICAL" | "DIAGNOSTIC" | "THERAPEUTIC" | "PREVENTIVE" | "OTHER"
  reason?: string
  outcome?: string
  complications?: string
  performedDate?: string
  status: "PREPARATION" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED"
}

export type PrescriptionSeed = {
  patientIndex: number
  issueDate: string
  expirationDate?: string
  notes?: string
  status: "ACTIVE" | "COMPLETED" | "CANCELLED"
  items: PrescriptionItemSeed[]
}

export type PrescriptionItemSeed = {
  medicationName: string
  dosage?: string
  frequency?: string
  duration?: string
  route?: string
  notes?: string
}

// Medical conditions
export const medicalConditionSeed: MedicalConditionSeed[] = [
  // Max (0) - Labrador
  {
    patientIndex: 0,
    name: "Otitis crónica",
    description:
      "Infección recurrente del oído externo, asociada a alergias estacionales",
    onsetDate: "2024-03-10T00:00:00Z",
    status: "ACTIVE",
    severity: "MILD",
  },

  // Luna (1) - Persa
  {
    patientIndex: 1,
    name: "Bolas de pelo recurrentes",
    description:
      "Tricobezoares gastrointestinales recurrentes, requiere pasta malta regular",
    onsetDate: "2024-08-15T00:00:00Z",
    status: "ACTIVE",
    severity: "MILD",
  },

  // Toby (2) - Mestizo
  {
    patientIndex: 2,
    name: "Dermatitis alérgica",
    description:
      "Dermatitis atópica con prurito intenso en zonas ventrales y extremidades",
    onsetDate: "2023-08-15T00:00:00Z",
    status: "ACTIVE",
    severity: "MODERATE",
  },
  {
    patientIndex: 2,
    name: "Sobrepeso",
    description:
      "Índice corporal elevado, requiere dieta controlada y ejercicio regular",
    onsetDate: "2024-01-20T00:00:00Z",
    status: "ACTIVE",
    severity: "MILD",
  },

  // Mishi (3) - Gato Mestizo
  {
    patientIndex: 3,
    name: "Gingivitis crónica",
    description:
      "Inflamación gingival leve-moderada, asociada a placa bacteriana",
    onsetDate: "2025-01-20T00:00:00Z",
    status: "ACTIVE",
    severity: "MILD",
  },

  // Rocky (4) - Buldog Francés
  {
    patientIndex: 4,
    name: "Displasia de cadera",
    description:
      "Displasia coxofemoral bilateral leve-moderada, confirmada por radiografía",
    onsetDate: "2024-06-01T00:00:00Z",
    status: "ACTIVE",
    severity: "MODERATE",
  },
  {
    patientIndex: 4,
    name: "Alergia alimentaria",
    description:
      "Intolerancia a proteínas de pollo y maíz, dieta de eliminación en curso",
    onsetDate: "2024-09-10T00:00:00Z",
    status: "ACTIVE",
    severity: "MILD",
  },

  // Nieve (5) - Conejo Angora
  {
    patientIndex: 5,
    name: "Maloclusión dental",
    description:
      "Crecimiento excesivo de incisivos que requiere limado periódico cada 3 meses",
    onsetDate: "2024-05-22T00:00:00Z",
    status: "ACTIVE",
    severity: "MODERATE",
  },

  // Piolín (6) - Canario
  {
    patientIndex: 6,
    name: "Deficiencia de calcio",
    description:
      "Hipocalcemia leve durante época de postura, suplementación en curso",
    onsetDate: "2025-03-10T00:00:00Z",
    status: "RESOLVED",
    severity: "MILD",
  },

  // Bruno (7) - Pastor Alemán
  {
    patientIndex: 7,
    name: "Artritis degenerativa",
    description:
      "Osteoartritis en articulaciones de cadera y rodillas, empeora con el frío",
    onsetDate: "2024-02-28T00:00:00Z",
    status: "ACTIVE",
    severity: "MODERATE",
  },
  {
    patientIndex: 7,
    name: "Soplido cardíaco",
    description:
      "Soplio sistólico grado III/IV, posible endocardiosis mitral. Requiere ecocardiograma anual",
    onsetDate: "2023-11-15T00:00:00Z",
    status: "ACTIVE",
    severity: "SEVERE",
  },

  // Sofía (8) - Gato Siamés
  {
    patientIndex: 8,
    name: "Infección urinaria recurrente",
    description: "Cistitis bacteriana recurrente, cultivo positivo a E. coli",
    onsetDate: "2024-07-05T00:00:00Z",
    status: "RELAPSE",
    severity: "MODERATE",
  },

  // Canelo (9) - Golden Retriever
  {
    patientIndex: 9,
    name: "Otitis externa recurrente",
    description:
      "Infecciones óticas recurrentes asociadas a natación frecuente",
    onsetDate: "2024-04-12T00:00:00Z",
    status: "ACTIVE",
    severity: "MILD",
  },

  // Nina (10) - Hurón
  {
    patientIndex: 10,
    name: "Enfermedad suprarrenal",
    description:
      "Hiperplasia suprarrenal izquierda con pérdida de pelaje simétrica",
    onsetDate: "2025-01-20T00:00:00Z",
    status: "ACTIVE",
    severity: "MODERATE",
  },

  // Capitán (11) - Tortuga
  {
    patientIndex: 11,
    name: "Deficiencia de vitamina A",
    description:
      "Hipovitaminosis A con descamación de caparazón y debilidad general",
    onsetDate: "2025-02-10T00:00:00Z",
    status: "ACTIVE",
    severity: "MILD",
  },
]

// Medical observations
export const medicalObservationSeed: MedicalObservationSeed[] = [
  // Max (0) - Labrador
  {
    patientIndex: 0,
    category: "VITAL_SIGNS",
    code: "weight",
    value: "32.5",
    unit: "kg",
    interpretation: "Normal",
    method: "Báscula digital",
    referenceRange: "25-35",
    status: "FINAL",
  },
  {
    patientIndex: 0,
    category: "VITAL_SIGNS",
    code: "temperature",
    value: "38.5",
    unit: "°C",
    interpretation: "Normal",
    method: "Termómetro digital",
    referenceRange: "37.5-39.2",
    status: "FINAL",
  },
  {
    patientIndex: 0,
    category: "EXAM",
    code: "ear-cytology",
    value: "Levaduras ++, cocos +",
    unit: "",
    interpretation: "Anormal",
    bodySite: "Oído izquierdo",
    method: "Citología ótica",
    referenceRange: "Negativo",
    status: "FINAL",
  },

  // Luna (1) - Persa
  {
    patientIndex: 1,
    category: "VITAL_SIGNS",
    code: "weight",
    value: "4.2",
    unit: "kg",
    interpretation: "Normal",
    method: "Báscula digital",
    referenceRange: "3.5-5.5",
    status: "FINAL",
  },

  // Toby (2) - Mestizo
  {
    patientIndex: 2,
    category: "VITAL_SIGNS",
    code: "weight",
    value: "18.0",
    unit: "kg",
    interpretation: "Sobrepeso",
    method: "Báscula digital",
    referenceRange: "14-17",
    status: "FINAL",
  },
  {
    patientIndex: 2,
    category: "EXAM",
    code: "skin-scraping",
    value: "Negativo a sarna",
    unit: "",
    interpretation: "Normal",
    bodySite: "Zona lumbar",
    method: "Raspado cutáneo",
    status: "FINAL",
  },

  // Mishi (3) - Gato Mestizo
  {
    patientIndex: 3,
    category: "VITAL_SIGNS",
    code: "weight",
    value: "3.8",
    unit: "kg",
    interpretation: "Normal",
    method: "Báscula digital",
    referenceRange: "3.0-5.0",
    status: "FINAL",
  },

  // Rocky (4) - Buldog Francés
  {
    patientIndex: 4,
    category: "VITAL_SIGNS",
    code: "weight",
    value: "12.3",
    unit: "kg",
    interpretation: "Normal",
    method: "Báscula digital",
    referenceRange: "10-14",
    status: "FINAL",
  },
  {
    patientIndex: 4,
    category: "VITAL_SIGNS",
    code: "heart-rate",
    value: "90",
    unit: "lpm",
    interpretation: "Normal",
    method: "Estetoscopio",
    referenceRange: "60-120",
    status: "FINAL",
  },

  // Nieve (5) - Conejo Angora
  {
    patientIndex: 5,
    category: "VITAL_SIGNS",
    code: "weight",
    value: "1.8",
    unit: "kg",
    interpretation: "Normal",
    method: "Báscula digital",
    referenceRange: "1.5-2.5",
    status: "FINAL",
  },

  // Piolín (6) - Canario
  {
    patientIndex: 6,
    category: "VITAL_SIGNS",
    code: "weight",
    value: "0.02",
    unit: "kg",
    interpretation: "Normal",
    method: "Báscula de precisión",
    referenceRange: "0.015-0.025",
    status: "FINAL",
  },

  // Bruno (7) - Pastor Alemán
  {
    patientIndex: 7,
    category: "VITAL_SIGNS",
    code: "weight",
    value: "38.0",
    unit: "kg",
    interpretation: "Normal",
    method: "Báscula digital",
    referenceRange: "30-40",
    status: "FINAL",
  },
  {
    patientIndex: 7,
    category: "VITAL_SIGNS",
    code: "temperature",
    value: "38.2",
    unit: "°C",
    interpretation: "Normal",
    method: "Termómetro digital",
    referenceRange: "37.5-39.2",
    status: "FINAL",
  },

  // Sofía (8) - Siamés
  {
    patientIndex: 8,
    category: "VITAL_SIGNS",
    code: "weight",
    value: "3.5",
    unit: "kg",
    interpretation: "Normal",
    method: "Báscula digital",
    referenceRange: "3.0-4.5",
    status: "FINAL",
  },

  // Canelo (9) - Golden Retriever
  {
    patientIndex: 9,
    category: "VITAL_SIGNS",
    code: "weight",
    value: "29.0",
    unit: "kg",
    interpretation: "Normal",
    method: "Báscula digital",
    referenceRange: "25-34",
    status: "FINAL",
  },

  // Nina (10) - Hurón
  {
    patientIndex: 10,
    category: "VITAL_SIGNS",
    code: "weight",
    value: "0.9",
    unit: "kg",
    interpretation: "Normal",
    method: "Báscula digital",
    referenceRange: "0.7-1.5",
    status: "FINAL",
  },

  // Capitán (11) - Tortuga
  {
    patientIndex: 11,
    category: "VITAL_SIGNS",
    code: "weight",
    value: "2.5",
    unit: "kg",
    interpretation: "Normal",
    method: "Báscula digital",
    referenceRange: "2.0-3.5",
    status: "FINAL",
  },
  {
    patientIndex: 11,
    category: "EXAM",
    code: "shell-examination",
    value: "Manchas blancas en escudos costales",
    unit: "",
    interpretation: "Anormal",
    bodySite: "Caparazón",
    method: "Inspección visual",
    status: "FINAL",
  },
]

// Immunizations (todos los pacientes tienen al menos 1)
export const immunizationSeed: ImmunizationSeed[] = [
  // Max (0) - Labrador
  {
    patientIndex: 0,
    vaccineCode: "RAB-001",
    vaccineName: "Vacuna Antirrábica",
    manufacturer: "Zoetis",
    lotNumber: "LOT-RAB-2025-01",
    expirationDate: "2025-07-15T00:00:00Z",
    administrationDate: "2025-01-15T10:00:00Z",
    doseNumber: "1",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },
  {
    patientIndex: 0,
    vaccineCode: "DHPPL-001",
    vaccineName: "Vacuna Óctuple Canina",
    manufacturer: "MSD Animal Health",
    lotNumber: "LOT-DHP-2025-01",
    expirationDate: "2025-08-20T00:00:00Z",
    administrationDate: "2025-01-15T10:15:00Z",
    doseNumber: "Refuerzo",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },

  // Luna (1) - Persa
  {
    patientIndex: 1,
    vaccineCode: "FVRCP-001",
    vaccineName: "Vacuna Triple Felina",
    manufacturer: "Zoetis",
    lotNumber: "LOT-TRF-2025-02",
    expirationDate: "2025-09-20T00:00:00Z",
    administrationDate: "2025-03-20T11:00:00Z",
    doseNumber: "Refuerzo",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },
  {
    patientIndex: 1,
    vaccineCode: "RAB-001",
    vaccineName: "Vacuna Antirrábica Felina",
    manufacturer: "Zoetis",
    lotNumber: "LOT-RAB-2025-03",
    expirationDate: "2025-09-20T00:00:00Z",
    administrationDate: "2025-03-20T11:15:00Z",
    doseNumber: "1",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },

  // Toby (2) - Mestizo
  {
    patientIndex: 2,
    vaccineCode: "RAB-001",
    vaccineName: "Vacuna Antirrábica",
    manufacturer: "MSD Animal Health",
    lotNumber: "LOT-RAB-2024-04",
    expirationDate: "2025-05-10T00:00:00Z",
    administrationDate: "2024-11-10T09:30:00Z",
    doseNumber: "Refuerzo",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },

  // Mishi (3) - Gato Mestizo
  {
    patientIndex: 3,
    vaccineCode: "FVRCP-001",
    vaccineName: "Vacuna Triple Felina",
    manufacturer: "Zoetis",
    lotNumber: "LOT-TRF-2025-05",
    expirationDate: "2025-12-01T00:00:00Z",
    administrationDate: "2025-06-01T10:00:00Z",
    doseNumber: "1",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },
  {
    patientIndex: 3,
    vaccineCode: "RAB-001",
    vaccineName: "Vacuna Antirrábica Felina",
    manufacturer: "Zoetis",
    lotNumber: "LOT-RAB-2025-05",
    expirationDate: "2025-12-01T00:00:00Z",
    administrationDate: "2025-06-01T10:15:00Z",
    doseNumber: "1",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },

  // Rocky (4) - Buldog Francés
  {
    patientIndex: 4,
    vaccineCode: "RAB-001",
    vaccineName: "Vacuna Antirrábica",
    manufacturer: "MSD Animal Health",
    lotNumber: "LOT-RAB-2025-07",
    expirationDate: "2025-08-15T00:00:00Z",
    administrationDate: "2025-02-15T10:00:00Z",
    doseNumber: "Refuerzo",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },
  {
    patientIndex: 4,
    vaccineCode: "DHPPL-001",
    vaccineName: "Vacuna Óctuple Canina",
    manufacturer: "MSD Animal Health",
    lotNumber: "LOT-DHP-2025-03",
    expirationDate: "2025-08-15T00:00:00Z",
    administrationDate: "2025-02-15T10:15:00Z",
    doseNumber: "Refuerzo",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },

  // Nieve (5) - Conejo Angora
  {
    patientIndex: 5,
    vaccineCode: "MYXO-001",
    vaccineName: "Vacuna contra Mixomatosis",
    manufacturer: "Zoetis",
    lotNumber: "LOT-MYX-2025-01",
    expirationDate: "2025-12-01T00:00:00Z",
    administrationDate: "2025-06-01T09:00:00Z",
    doseNumber: "1",
    doseUnit: "0.5 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },
  {
    patientIndex: 5,
    vaccineCode: "VHD-001",
    vaccineName: "Vacuna contra Enfermedad Hemorrágica Vírica",
    manufacturer: "Zoetis",
    lotNumber: "LOT-VHD-2025-01",
    expirationDate: "2025-12-01T00:00:00Z",
    administrationDate: "2025-06-01T09:15:00Z",
    doseNumber: "1",
    doseUnit: "0.5 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },

  // Piolín (6) - Canario - No aplican vacunas estándar
  {
    patientIndex: 6,
    vaccineCode: "NONE",
    vaccineName: "No aplica vacunación en aves de jaula",
    manufacturer: "N/A",
    administrationDate: "2025-01-01T00:00:00Z",
    status: "NOT_DONE",
  },

  // Bruno (7) - Pastor Alemán
  {
    patientIndex: 7,
    vaccineCode: "RAB-001",
    vaccineName: "Vacuna Antirrábica",
    manufacturer: "MSD Animal Health",
    lotNumber: "LOT-RAB-2025-02",
    expirationDate: "2025-08-28T00:00:00Z",
    administrationDate: "2025-02-28T14:00:00Z",
    doseNumber: "Refuerzo",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },
  {
    patientIndex: 7,
    vaccineCode: "PARVO-001",
    vaccineName: "Vacuna Antiparvovirus",
    manufacturer: "MSD Animal Health",
    lotNumber: "LOT-PAR-2025-02",
    expirationDate: "2025-08-28T00:00:00Z",
    administrationDate: "2025-02-28T14:15:00Z",
    doseNumber: "Refuerzo",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },

  // Sofía (8) - Siamés
  {
    patientIndex: 8,
    vaccineCode: "FVRCP-001",
    vaccineName: "Vacuna Triple Felina",
    manufacturer: "Zoetis",
    lotNumber: "LOT-TRF-2025-06",
    expirationDate: "2026-01-15T00:00:00Z",
    administrationDate: "2025-07-15T11:00:00Z",
    doseNumber: "1",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },
  {
    patientIndex: 8,
    vaccineCode: "RAB-001",
    vaccineName: "Vacuna Antirrábica Felina",
    manufacturer: "Zoetis",
    lotNumber: "LOT-RAB-2025-08",
    expirationDate: "2026-01-15T00:00:00Z",
    administrationDate: "2025-07-15T11:15:00Z",
    doseNumber: "1",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },

  // Canelo (9) - Golden Retriever
  {
    patientIndex: 9,
    vaccineCode: "RAB-001",
    vaccineName: "Vacuna Antirrábica",
    manufacturer: "Zoetis",
    lotNumber: "LOT-RAB-2025-06",
    expirationDate: "2026-03-15T00:00:00Z",
    administrationDate: "2025-09-15T11:00:00Z",
    doseNumber: "Refuerzo",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },
  {
    patientIndex: 9,
    vaccineCode: "HCP-001",
    vaccineName: "Vacuna contra Hepatitis Canina",
    manufacturer: "Zoetis",
    lotNumber: "LOT-HCP-2025-06",
    expirationDate: "2026-03-15T00:00:00Z",
    administrationDate: "2025-09-15T11:15:00Z",
    doseNumber: "Refuerzo",
    doseUnit: "1 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },

  // Nina (10) - Hurón
  {
    patientIndex: 10,
    vaccineCode: "CDV-001",
    vaccineName: "Vacuna contra Distemper Canino (Hurón)",
    manufacturer: "MSD Animal Health",
    lotNumber: "LOT-CDV-2025-01",
    expirationDate: "2025-11-01T00:00:00Z",
    administrationDate: "2025-05-01T10:00:00Z",
    doseNumber: "1",
    doseUnit: "0.5 mL",
    route: "SUBCUTANEOUS",
    site: "Región interescapular",
    status: "COMPLETED",
  },

  // Capitán (11) - Tortuga - No aplican vacunas estándar
  {
    patientIndex: 11,
    vaccineCode: "NONE",
    vaccineName: "No aplica vacunación en quelonios",
    manufacturer: "N/A",
    administrationDate: "2025-01-01T00:00:00Z",
    status: "NOT_DONE",
  },
]

// Procedures (todos los pacientes tienen al menos 1)
export const procedureSeed: ProcedureSeed[] = [
  // Max (0) - Labrador
  {
    patientIndex: 0,
    code: "EAR-CLEAN-001",
    name: "Limpieza de oídos bajo sedación",
    category: "THERAPEUTIC",
    reason: "Otitis externa severa con acumulación de cerumen",
    outcome: "Oídos limpios, se prescriben gotas óticas",
    performedDate: "2025-01-20T09:00:00Z",
    status: "COMPLETED",
  },

  // Luna (1) - Persa
  {
    patientIndex: 1,
    code: "GROOM-001",
    name: "Cepillado y desanudado de pelaje bajo sedación",
    category: "THERAPEUTIC",
    reason: "Formación de nudos y bolas de pelo",
    outcome: "Pelaje desanudado y cepillado sin complicaciones",
    performedDate: "2025-03-25T10:00:00Z",
    status: "COMPLETED",
  },

  // Toby (2) - Mestizo
  {
    patientIndex: 2,
    code: "DEWORM-001",
    name: "Desparasitación interna",
    category: "PREVENTIVE",
    reason: "Protocolo de desparasitación trimestral",
    outcome: "Tolerancia adecuada, sin efectos adversos",
    performedDate: "2025-03-10T10:00:00Z",
    status: "COMPLETED",
  },

  // Mishi (3) - Gato Mestizo
  {
    patientIndex: 3,
    code: "DENT-CLEAN-001",
    name: "Limpieza dental con ultrasonido",
    category: "PREVENTIVE",
    reason: "Gingivitis leve, acumulación de sarro",
    outcome: "Dientes limpios, encías con mejor aspecto",
    performedDate: "2025-06-15T09:00:00Z",
    status: "COMPLETED",
  },

  // Rocky (4) - Buldog Francés
  {
    patientIndex: 4,
    code: "XRAY-HIP-001",
    name: "Radiografía de cadera (displasia)",
    category: "DIAGNOSTIC",
    reason: "Evaluación de displasia de cadera",
    outcome: "Displasia coxofemoral bilateral grado II/IV",
    performedDate: "2024-06-15T14:30:00Z",
    status: "COMPLETED",
  },

  // Nieve (5) - Conejo Angora
  {
    patientIndex: 5,
    code: "DENT-TRIM-001",
    name: "Limado dental de incisivos",
    category: "THERAPEUTIC",
    reason: "Maloclusión dental con sobrecrecimiento de incisivos",
    outcome: "Incisivos limados a longitud normal, sin complicaciones",
    performedDate: "2025-02-20T11:00:00Z",
    status: "COMPLETED",
  },

  // Piolín (6) - Canario
  {
    patientIndex: 6,
    code: "NAIL-TRIM-001",
    name: "Corte de uñas y revisión general",
    category: "PREVENTIVE",
    reason: "Control de rutina y mantenimiento",
    outcome: "Uñas cortadas, paciente en buen estado general",
    performedDate: "2025-04-10T09:30:00Z",
    status: "COMPLETED",
  },

  // Bruno (7) - Pastor Alemán
  {
    patientIndex: 7,
    code: "ECHO-001",
    name: "Ecocardiograma Doppler",
    category: "DIAGNOSTIC",
    reason: "Evaluación de soplido cardíaco grado III/IV",
    outcome: "Endocardiosis mitral leve, fracción de acortamiento 32%",
    performedDate: "2024-11-20T15:00:00Z",
    status: "COMPLETED",
  },

  // Sofía (8) - Siamés
  {
    patientIndex: 8,
    code: "URINE-CULTURE-001",
    name: "Urocultivo y antibiograma",
    category: "DIAGNOSTIC",
    reason: "Infección urinaria recurrente, sospecha de resistencia",
    outcome: "Cultivo positivo a E. coli multisensible",
    performedDate: "2025-01-20T11:00:00Z",
    status: "COMPLETED",
  },

  // Canelo (9) - Golden Retriever
  {
    patientIndex: 9,
    code: "SPAY-001",
    name: "Esterilización electiva (orquiectomía)",
    category: "SURGICAL",
    reason: "Esterilización electiva solicitada por la propietaria",
    outcome: "Procedimiento sin complicaciones, recuperación exitosa",
    performedDate: "2025-01-10T08:00:00Z",
    status: "COMPLETED",
  },

  // Nina (10) - Hurón
  {
    patientIndex: 10,
    code: "ADRENAL-ULTRA-001",
    name: "Ecografía abdominal (glándulas suprarrenales)",
    category: "DIAGNOSTIC",
    reason: "Pérdida de pelaje simétrica, sospecha de enfermedad suprarrenal",
    outcome: "Glándula suprarrenal izquierda aumentada de tamaño",
    performedDate: "2025-02-01T10:00:00Z",
    status: "COMPLETED",
  },

  // Capitán (11) - Tortuga
  {
    patientIndex: 11,
    code: "SHELL-REPAIR-001",
    name: "Limpieza y tratamiento de caparazón",
    category: "THERAPEUTIC",
    reason: "Manchas blancas en caparazón por hongos",
    outcome: "Caparazón limpio, se indica tratamiento tópico",
    performedDate: "2025-02-20T09:00:00Z",
    status: "COMPLETED",
  },
]

// Prescriptions (todos los pacientes tienen al menos 1)
export const prescriptionSeed: PrescriptionSeed[] = [
  // Max (0) - Labrador - Otitis
  {
    patientIndex: 0,
    issueDate: "2025-01-20T00:00:00Z",
    expirationDate: "2025-02-20T00:00:00Z",
    notes: "Suspender si hay irritación excesiva",
    status: "COMPLETED",
    items: [
      {
        medicationName: "Suspensión ótica Otomax",
        dosage: "3 gotas",
        frequency: "Cada 12 horas",
        duration: "14 días",
        route: "Ótico",
        notes:
          "Agitar antes de usar, masajear base del oído después de aplicar",
      },
    ],
  },

  // Luna (1) - Persa - Bolas de pelo
  {
    patientIndex: 1,
    issueDate: "2025-03-20T00:00:00Z",
    expirationDate: "2025-09-20T00:00:00Z",
    notes: "Administrar de por vida como prevención",
    status: "ACTIVE",
    items: [
      {
        medicationName: "Pasta malta Felix",
        dosage: "2 cm",
        frequency: "Cada 48 horas",
        duration: "Continuo",
        route: "Oral",
        notes:
          "Administrar directamente en la boca o mezclar con comida húmeda",
      },
      {
        medicationName: "Royal Canin Hairball Care",
        dosage: "40 gramos",
        frequency: "Dividido en 2 comidas al día",
        duration: "Continuo",
        route: "Oral",
        notes: "Dieta formulada para control de bolas de pelo",
      },
    ],
  },

  // Toby (2) - Mestizo - Dermatitis + Sobrepeso
  {
    patientIndex: 2,
    issueDate: "2025-03-10T00:00:00Z",
    expirationDate: "2025-06-10T00:00:00Z",
    notes: "Controlar peso semanalmente",
    status: "ACTIVE",
    items: [
      {
        medicationName: "Apoquel 16mg",
        dosage: "1 tableta",
        frequency: "Cada 12 horas por 14 días, luego cada 24 horas",
        duration: "30 días",
        route: "Oral",
        notes: "Administrar con comida",
      },
      {
        medicationName: "Champú Douxo Calm",
        dosage: "Aplicar",
        frequency: "Cada 72 horas",
        duration: "4 semanas",
        route: "Tópico",
        notes: "Dejar actuar 5-10 minutos antes de enjuagar",
      },
      {
        medicationName: "Dieta Royal Canin Satiety",
        dosage: "320 gramos",
        frequency: "Dividido en 2 comidas al día",
        duration: "3 meses",
        route: "Oral",
        notes: "Reducir gradualmente según pérdida de peso",
      },
    ],
  },

  // Mishi (3) - Gato Mestizo - Gingivitis
  {
    patientIndex: 3,
    issueDate: "2025-06-15T00:00:00Z",
    expirationDate: "2025-09-15T00:00:00Z",
    notes: "Cepillado dental diario recomendado",
    status: "ACTIVE",
    items: [
      {
        medicationName: "Gel dental PetsDent",
        dosage: "0.5 cm",
        frequency: "Cada 24 horas",
        duration: "Continuo",
        route: "Tópico (encias)",
        notes: "Aplicar sobre encías después del cepillado",
      },
    ],
  },

  // Rocky (4) - Buldog Francés - Displasia + Alergia
  {
    patientIndex: 4,
    issueDate: "2025-06-15T00:00:00Z",
    expirationDate: "2026-06-15T00:00:00Z",
    notes: "Evitar ejercicio intenso y saltos",
    status: "ACTIVE",
    items: [
      {
        medicationName: "Cartrophen Vet 100mg",
        dosage: "1 mL",
        frequency: "Cada 7 días",
        duration: "4 semanas (series)",
        route: "Subcutáneo",
        notes: "Repetir serie cada 6 meses",
      },
      {
        medicationName: "Yumove Advance",
        dosage: "2 tabletas",
        frequency: "Cada 24 horas",
        duration: "Continuo",
        route: "Oral",
        notes: "Suplemento articular de por vida",
      },
      {
        medicationName: "Dieta Royal Canin Anallergenic",
        dosage: "150 gramos",
        frequency: "Dividido en 2 comidas al día",
        duration: "8 semanas (prueba)",
        route: "Oral",
        notes: "Dieta de eliminación. No dar otros alimentos",
      },
    ],
  },

  // Nieve (5) - Conejo Angora - Post dental
  {
    patientIndex: 5,
    issueDate: "2025-02-20T00:00:00Z",
    expirationDate: "2025-05-20T00:00:00Z",
    notes: "Control dental en 3 meses",
    status: "COMPLETED",
    items: [
      {
        medicationName: "Meloxicam 0.5mg/mL",
        dosage: "0.1 mL",
        frequency: "Cada 24 horas",
        duration: "3 días",
        route: "Oral",
        notes: "Antiinflamatorio post-procedimiento dental",
      },
    ],
  },

  // Piolín (6) - Canario - Deficiencia de calcio
  {
    patientIndex: 6,
    issueDate: "2025-03-10T00:00:00Z",
    expirationDate: "2025-09-10T00:00:00Z",
    notes: "Mejorar la alimentación con vegetales verdes",
    status: "COMPLETED",
    items: [
      {
        medicationName: "Suplemento de calcio líquido aves",
        dosage: "2 gotas",
        frequency: "Cada 24 horas en agua de bebida",
        duration: "30 días",
        route: "Oral",
        notes: "Cambiar el agua del bebedero diariamente",
      },
    ],
  },

  // Bruno (7) - Pastor Alemán - Artritis + Cardíaco
  {
    patientIndex: 7,
    issueDate: "2025-02-28T00:00:00Z",
    expirationDate: "2025-08-28T00:00:00Z",
    notes: "Controles cardiológicos trimestrales",
    status: "ACTIVE",
    items: [
      {
        medicationName: "Gabapentina 100mg",
        dosage: "1 cápsula",
        frequency: "Cada 8 horas",
        duration: "Continuo",
        route: "Oral",
        notes: "Para dolor articular crónico",
      },
      {
        medicationName: "Pimobendán 5mg",
        dosage: "1 tableta",
        frequency: "Cada 12 horas",
        duration: "Continuo",
        route: "Oral",
        notes: "Cardioprotector. Administrar 1 hora antes de comida",
      },
      {
        medicationName: "Ácidos grasos Omega-3",
        dosage: "2 mL",
        frequency: "Cada 24 horas",
        duration: "Continuo",
        route: "Oral",
        notes: "Antiinflamatorio natural, mezclar con comida",
      },
    ],
  },

  // Sofía (8) - Siamés - Infección urinaria
  {
    patientIndex: 8,
    issueDate: "2025-01-15T00:00:00Z",
    expirationDate: "2025-02-15T00:00:00Z",
    notes: "Reevaluar al finalizar tratamiento",
    status: "COMPLETED",
    items: [
      {
        medicationName: "Amoxicilina-Ácido Clavulánico 50mg",
        dosage: "1 tableta",
        frequency: "Cada 12 horas",
        duration: "14 días",
        route: "Oral",
        notes: "Administrar con comida para evitar náuseas",
      },
      {
        medicationName: "Dieta Urinary Royal Canin",
        dosage: "40 gramos",
        frequency: "Dividido en 2 comidas",
        duration: "Continuo",
        route: "Oral",
        notes: "Dieta exclusiva, no mezclar con otros alimentos",
      },
    ],
  },

  // Canelo (9) - Golden Retriever - Otitis
  {
    patientIndex: 9,
    issueDate: "2025-04-15T00:00:00Z",
    expirationDate: "2025-05-15T00:00:00Z",
    status: "COMPLETED",
    items: [
      {
        medicationName: "Solución ótica Surolan",
        dosage: "4 gotas",
        frequency: "Cada 8 horas",
        duration: "10 días",
        route: "Ótico",
        notes: "Secar oídos con algodón antes de aplicar",
      },
    ],
  },

  // Nina (10) - Hurón - Enfermedad suprarrenal
  {
    patientIndex: 10,
    issueDate: "2025-02-01T00:00:00Z",
    expirationDate: "2026-02-01T00:00:00Z",
    notes: "Control ecográfico en 6 meses",
    status: "ACTIVE",
    items: [
      {
        medicationName: "Melatonina 3mg",
        dosage: "1 tableta",
        frequency: "Cada 24 horas",
        duration: "Continuo",
        route: "Oral",
        notes: "Para control de enfermedad suprarrenal",
      },
    ],
  },

  // Capitán (11) - Tortuga - Vitamina A
  {
    patientIndex: 11,
    issueDate: "2025-02-15T00:00:00Z",
    expirationDate: "2025-08-15T00:00:00Z",
    notes: "Incluir vegetales ricos en vitamina A en la dieta",
    status: "ACTIVE",
    items: [
      {
        medicationName: "Suplemento Vitamínico Reptil A",
        dosage: "0.5 mL",
        frequency: "Cada 48 horas",
        duration: "60 días",
        route: "Oral",
        notes: "Mezclar con la comida húmeda",
      },
    ],
  },
]
