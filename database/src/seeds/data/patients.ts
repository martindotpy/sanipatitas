// Types
type PatientSeed = {
  clientIndex: number
  name: string
  speciesName: string
  breedName: string
  gender: "MALE" | "FEMALE" | "UNKNOWN"
  birthDate: string
  approximateAge: string
  weightKg: string
  description: string
  isSterilized: boolean
  isDeceased: boolean
}

// Patients
export const patientSeed: PatientSeed[] = [
  // María García - 2 mascotas
  {
    clientIndex: 0,
    name: "Max",
    speciesName: "Perro",
    breedName: "Labrador Retriever",
    gender: "MALE",
    birthDate: "2021-03-15",
    approximateAge: "5 años",
    weightKg: "32.50",
    description: "Perro energético y cariñoso, le encita jugar con pelota",
    isSterilized: true,
    isDeceased: false,
  },
  {
    clientIndex: 0,
    name: "Luna",
    speciesName: "Gato",
    breedName: "Persa",
    gender: "FEMALE",
    birthDate: "2022-07-20",
    approximateAge: "3 años",
    weightKg: "4.20",
    description: "Gata tranquila y independiente, pelo largo blanco",
    isSterilized: true,
    isDeceased: false,
  },

  // Juan Ramírez - 2 mascotas
  {
    clientIndex: 1,
    name: "Toby",
    speciesName: "Perro",
    breedName: "Mestizo",
    gender: "MALE",
    birthDate: "2020-01-10",
    approximateAge: "6 años",
    weightKg: "18.00",
    description: "Perro mestizo rescatado, muy agradecido y leal",
    isSterilized: true,
    isDeceased: false,
  },
  {
    clientIndex: 1,
    name: "Mishi",
    speciesName: "Gato",
    breedName: "Mestizo",
    gender: "FEMALE",
    birthDate: "2023-05-05",
    approximateAge: "2 años",
    weightKg: "3.80",
    description: "Gata atigrada, juguetona y curiosa",
    isSterilized: false,
    isDeceased: false,
  },

  // Ana Flores - 3 mascotas
  {
    clientIndex: 2,
    name: "Rocky",
    speciesName: "Perro",
    breedName: "Buldog Francés",
    gender: "MALE",
    birthDate: "2022-11-01",
    approximateAge: "3 años",
    weightKg: "12.30",
    description: "Buldog francés negro, tranquilo y juguetón",
    isSterilized: true,
    isDeceased: false,
  },
  {
    clientIndex: 2,
    name: "Nieve",
    speciesName: "Conejo",
    breedName: "Angora",
    gender: "FEMALE",
    birthDate: "2023-08-15",
    approximateAge: "2 años",
    weightKg: "1.80",
    description: "Coneja blanca de pelaje largo, muy dócil",
    isSterilized: false,
    isDeceased: false,
  },
  {
    clientIndex: 2,
    name: "Piolín",
    speciesName: "Ave",
    breedName: "Canario",
    gender: "MALE",
    birthDate: "2024-01-20",
    approximateAge: "1 año",
    weightKg: "0.02",
    description: "Canario amarillo cantor, alegre y activo",
    isSterilized: false,
    isDeceased: false,
  },

  // Roberto Huanca - 2 mascotas
  {
    clientIndex: 3,
    name: "Bruno",
    speciesName: "Perro",
    breedName: "Pastor Alemán",
    gender: "MALE",
    birthDate: "2019-06-30",
    approximateAge: "7 años",
    weightKg: "38.00",
    description: "Pastor alemán entrenado, servicial y protector",
    isSterilized: true,
    isDeceased: false,
  },
  {
    clientIndex: 3,
    name: "Sofía",
    speciesName: "Gato",
    breedName: "Siamés",
    gender: "FEMALE",
    birthDate: "2023-02-14",
    approximateAge: "3 años",
    weightKg: "3.50",
    description: "Gata siamesa de ojos azules, muy vocal y cariñosa",
    isSterilized: false,
    isDeceased: false,
  },

  // Carmen Paredes - 2 mascotas
  {
    clientIndex: 4,
    name: "Canelo",
    speciesName: "Perro",
    breedName: "Golden Retriever",
    gender: "MALE",
    birthDate: "2021-09-10",
    approximateAge: "4 años",
    weightKg: "29.00",
    description: "Golden retriever pelaje dorado, amoroso con los niños",
    isSterilized: true,
    isDeceased: false,
  },
  {
    clientIndex: 4,
    name: "Nina",
    speciesName: "Hurón",
    breedName: "Hurón Doméstico",
    gender: "FEMALE",
    birthDate: "2023-12-01",
    approximateAge: "2 años",
    weightKg: "0.90",
    description: "Hurón blanca y gris, muy activa y curiosa",
    isSterilized: false,
    isDeceased: false,
  },

  // Luis Medina - 1 mascota
  {
    clientIndex: 5,
    name: "Capitán",
    speciesName: "Tortuga",
    breedName: "Tortuga Terrestre",
    gender: "MALE",
    birthDate: "2015-04-22",
    approximateAge: "11 años",
    weightKg: "2.50",
    description: "Tortuga terrestre longeva, tranquila y robusta",
    isSterilized: false,
    isDeceased: false,
  },
]
