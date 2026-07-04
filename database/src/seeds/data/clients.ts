// Types
type ClientSeed = {
  firstName: string
  lastName: string
  idType: "DNI"
  idNumber: string
  phone: string
  email: string
  address: string
}

// Clients (Peruvian persons)
export const clientSeed: ClientSeed[] = [
  {
    firstName: "María Elena",
    lastName: "García López",
    idType: "DNI",
    idNumber: "45123678",
    phone: "987654321",
    email: "maria.garcia@email.com",
    address: "Av. Javier Prado Este 4200, Santiago de Surco, Lima",
  },
  {
    firstName: "Juan Carlos",
    lastName: "Ramírez Quispe",
    idType: "DNI",
    idNumber: "46234789",
    phone: "976543210",
    email: "juan.ramirez@email.com",
    address: "Jr. de la Unión 520, Cercado de Lima",
  },
  {
    firstName: "Ana Lucía",
    lastName: "Flores Mendoza",
    idType: "DNI",
    idNumber: "47345890",
    phone: "965432109",
    email: "ana.flores@email.com",
    address: "Ca. Los Olivos 123, San Isidro, Lima",
  },
  {
    firstName: "Roberto",
    lastName: "Huanca Torres",
    idType: "DNI",
    idNumber: "48456901",
    phone: "954321098",
    email: "roberto.huanca@email.com",
    address: "Av. La Marina 2100, San Miguel, Lima",
  },
  {
    firstName: "Carmen Rosa",
    lastName: "Paredes Vargas",
    idType: "DNI",
    idNumber: "49567012",
    phone: "943210987",
    email: "carmen.paredes@email.com",
    address: "Jr. Huancavelica 315, Cercado de Lima",
  },
  {
    firstName: "Luis Alberto",
    lastName: "Medina Castillo",
    idType: "DNI",
    idNumber: "40678123",
    phone: "932109876",
    email: "luis.medina@email.com",
    address: "Av. Angamos 1500, Surquillo, Lima",
  },
]
