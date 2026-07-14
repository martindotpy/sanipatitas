import { db } from "@sanipatitas/database"
import { appointmentTable } from "@sanipatitas/database/appointment/schema/appointment-schema"
import { billingItemTable, type BillingItemType } from "@sanipatitas/database/payment/schema/billing-item-schema"
import { billingTable, type PaymentStatus } from "@sanipatitas/database/payment/schema/billing-schema"
import { paymentTable, type PaymentMethod } from "@sanipatitas/database/payment/schema/payment-schema"
import { breedTable } from "@sanipatitas/database/patient/schema/breed-schema"
import { clientTable } from "@sanipatitas/database/patient/schema/client-schema"
import { patientTable } from "@sanipatitas/database/patient/schema/patient-schema"
import { speciesTable } from "@sanipatitas/database/patient/schema/species-schema"
import { userTable } from "@sanipatitas/database/auth/schema/auth-schema"
import { serverLog } from "@sanipatitas/shared/log/server-logger"
import { eq, sql } from "drizzle-orm"

// Inventory schemas
import { productCategoryTable } from "@sanipatitas/database/inventory/schema/product-category-schema"
import { supplierTable } from "@sanipatitas/database/inventory/schema/supplier-schema"
import { productTable } from "@sanipatitas/database/inventory/schema/product-schema"
import { stockTable } from "@sanipatitas/database/inventory/schema/stock-schema"
import { stockMovementTable } from "@sanipatitas/database/inventory/schema/stock-movement-schema"

// Inventory seed data
import {
  productCategorySeed,
  productSeed,
  stockMovementSeed,
  stockSeed,
  supplierSeed,
} from "@sanipatitas/database/seeds/data/inventory"

// Billing seed data
import { billingSeed, billingItemSeed, paymentSeed } from "@sanipatitas/database/seeds/data/billing"

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

// Seed inventory (categories, suppliers, products, stock, stock movements)
export async function seedInventory() {
  const [existing] = await db.select().from(productCategoryTable).limit(1)

  if (existing) {
    serverLog.debug("Inventory already seeded, skipping")

    return
  }

  serverLog.info("Seeding inventory data...")

  // Product categories
  await db.insert(productCategoryTable).values(productCategorySeed)

  // Suppliers
  await db.insert(supplierTable).values(supplierSeed)

  // Products
  await db.insert(productTable).values(
    productSeed.map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      description: p.description,
      price: p.price.toString(),
      categoryId: p.categoryId,
      supplierId: p.supplierId,
    })),
  )

  // Stock
  await db.insert(stockTable).values(
    stockSeed.map((s) => ({
      id: s.id,
      productId: s.productId,
      quantity: s.quantity,
      location: s.location,
      minStock: s.minStock,
    })),
  )

  // Stock movements
  await db.insert(stockMovementTable).values(
    stockMovementSeed.map((m) => ({
      type: m.type,
      quantity: m.quantity,
      unitCost: m.unitCost.toString(),
      unitPrice: m.unitPrice.toString(),
      reference: m.reference,
      notes: m.notes,
      stockId: m.stockId,
    })),
  )

  serverLog.info(
    "Inventory seeded: %d categories, %d suppliers, %d products, %d stock records, %d movements",
    productCategorySeed.length,
    supplierSeed.length,
    productSeed.length,
    stockSeed.length,
    stockMovementSeed.length,
  )
}

// Seed billing (bills, items, and payments)
export async function seedBilling() {
  const [existing] = await db.select().from(billingTable).limit(1)

  if (existing) {
    serverLog.debug("Billing already seeded, skipping")

    return
  }

  serverLog.info("Seeding billing data...")

  // Get existing clients
  const clients = await db.select().from(clientTable)

  const now = new Date()

  // Insert billings
  const insertedBillings = await db
    .insert(billingTable)
    .values(
      billingSeed.map((b) => {
        const client = clients[b.clientIndex]
        if (!client) {
          throw new Error(`Client at index ${b.clientIndex} not found`)
        }

        return {
          clientId: client.id,
          subtotal: b.subtotal.toString(),
          discount: b.discount.toString(),
          taxAmount: b.taxAmount.toString(),
          totalAmount: b.totalAmount.toString(),
          paymentStatus: "PENDING" as PaymentStatus,
          notes: b.notes,
          createdAt: now,
          updatedAt: now,
        }
      })
    )
    .returning()

  // Insert billing items
  await db
    .insert(billingItemTable)
    .values(
      billingItemSeed.map((item) => {
        const billing = insertedBillings[item.billingIndex]
        if (!billing) {
          throw new Error(`Billing at index ${item.billingIndex} not found`)
        }

        return {
          billingId: billing.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          total: item.total.toString(),
          itemType: item.itemType as BillingItemType,
          createdAt: now,
        }
      })
    )

  // Insert payments
  for (const payment of paymentSeed) {
    const billing = insertedBillings[payment.billingIndex]
    if (!billing) {
      throw new Error(`Billing at index ${payment.billingIndex} not found`)
    }

    const paidAt = new Date()

    await db.insert(paymentTable).values({
      billingId: billing.id,
      amount: payment.amount.toString(),
      paymentMethod: payment.paymentMethod as PaymentMethod,
      reference: payment.reference,
      paidAt,
      createdAt: paidAt,
    })

    // Calculate total paid for this billing
    const payments = await db
      .select({ totalPaid: sql<string>`COALESCE(SUM(${paymentTable.amount}), 0)::numeric` })
      .from(paymentTable)
      .where(eq(paymentTable.billingId, billing.id))

    const totalPaid = Number(payments[0]?.totalPaid ?? 0)
    const billingTotal = Number(billing.totalAmount)

    if (totalPaid >= billingTotal) {
      await db
        .update(billingTable)
        .set({
          paymentStatus: "PAID" as PaymentStatus,
          updatedAt: new Date(),
        })
        .where(eq(billingTable.id, billing.id))
    } else if (totalPaid > 0) {
      await db
        .update(billingTable)
        .set({
          paymentStatus: "PARTIAL" as PaymentStatus,
          updatedAt: new Date(),
        })
        .where(eq(billingTable.id, billing.id))
    }
  }

  serverLog.info(
    "Billing seeded: %d bills, %d items, %d payments",
    billingSeed.length,
    billingItemSeed.length,
    paymentSeed.length,
  )
}
