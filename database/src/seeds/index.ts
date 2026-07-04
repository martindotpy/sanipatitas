import { db } from "@sanipatitas/database"
import { appointmentTable } from "@sanipatitas/database/appointment/schema/appointment-schema"
import { breedTable } from "@sanipatitas/database/patient/schema/breed-schema"
import { clientTable } from "@sanipatitas/database/patient/schema/client-schema"
import { patientTable } from "@sanipatitas/database/patient/schema/patient-schema"
import { speciesTable } from "@sanipatitas/database/patient/schema/species-schema"
import { userTable } from "@sanipatitas/database/auth/schema/auth-schema"
import { serverLog } from "@sanipatitas/shared/log/server-logger"
import { eq } from "drizzle-orm"

// Data
import { appointmentSeed } from "@sanipatitas/database/seeds/data/appointments"
import { breedSeed } from "@sanipatitas/database/seeds/data/breeds"
import { clientSeed } from "@sanipatitas/database/seeds/data/clients"
import { patientSeed } from "@sanipatitas/database/seeds/data/patients"
import { speciesSeed } from "@sanipatitas/database/seeds/data/species"

// Seed business tables (species, breed, client, patient)
export async function seedDatabase() {
  const [row] = await db.select().from(speciesTable).limit(1)

  if (row) {
    serverLog.debug("Species already seeded, skipping")

    return
  }

  serverLog.info("Seeding database with test data...")

  // Species
  const insertedSpecies = await db
    .insert(speciesTable)
    .values(speciesSeed)
    .returning()

  const speciesMap = new Map(insertedSpecies.map((s) => [s.name, s.id]))

  // Breeds
  const breedValues = breedSeed.map((b) => ({
    speciesId: speciesMap.get(b.speciesName)!,
    name: b.name,
    description: b.description,
  }))

  const insertedBreeds = await db.insert(breedTable).values(breedValues).returning()

  const breedMap = new Map(insertedBreeds.map((b) => [b.name, b.id]))

  // Clients
  const insertedClients = await db.insert(clientTable).values(clientSeed).returning()

  // Patients
  const patientValues = patientSeed.map((p) => {
    const client = insertedClients[p.clientIndex]
    const breedId = breedMap.get(p.breedName)

    if (!client || !breedId) {
      throw new Error(`Invalid seed data: client[${p.clientIndex}] or breed "${p.breedName}" not found`)
    }

    return {
      clientId: client.id,
      name: p.name,
      breedId,
      gender: p.gender,
      birthDate: p.birthDate,
      approximateAge: p.approximateAge,
      weightKg: p.weightKg,
      description: p.description,
      isSterilized: p.isSterilized,
      isDeceased: p.isDeceased,
    }
  })

  await db.insert(patientTable).values(patientValues).returning()

  serverLog.info("Database seeded: %d species, %d breeds, %d clients, %d patients",
    insertedSpecies.length,
    insertedBreeds.length,
    insertedClients.length,
    patientValues.length
  )
}

// Seed appointments (requires users to exist)
export async function seedAppointments() {
  const [existing] = await db.select().from(appointmentTable).limit(1)

  if (existing) {
    serverLog.debug("Appointments already seeded, skipping")

    return
  }

  // Get all clients and patients in order
  const clients = await db.select().from(clientTable)
  const patients = await db.select().from(patientTable)

  // Get veterinarians
  const veterinarians = await db
    .select()
    .from(userTable)
    .where(eq(userTable.role, "veterinarian"))

  if (veterinarians.length === 0) {
    serverLog.debug("No veterinarians found, skipping appointment seed")

    return
  }

  // Map seed data to actual IDs
  const appointmentValues = appointmentSeed.map((a) => {
    const client = clients[a.clientIndex]
    const patient = patients[a.patientIndex]
    const veterinarian = veterinarians[a.veterinarianIndex % veterinarians.length]

    if (!client || !patient || !veterinarian) {
      throw new Error(`Invalid seed data: client[${a.clientIndex}] or patient[${a.patientIndex}] not found`)
    }

    return {
      clientId: client.id,
      patientId: patient.id,
      veterinarianId: veterinarian.id,
      date: a.date,
      startTime: a.startTime,
      endTime: a.endTime,
      status: a.status,
      appointmentClass: a.appointmentClass,
      reason: a.reason,
      notes: a.notes,
    }
  })

  await db.insert(appointmentTable).values(appointmentValues)

  serverLog.info("Appointments seeded: %d records", appointmentValues.length)
}
