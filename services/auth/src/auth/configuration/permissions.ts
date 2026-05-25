import { createAccessControl } from "better-auth/plugins/access"
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access"

// Statement
export const statement = {
  ...defaultStatements,
  clinical: ["view", "create", "update", "delete"],
  inventory: ["view", "create", "update", "delete"],
  sales: ["view", "create"],
  appointment: ["view", "create", "update", "delete"],
} as const

// Role
export const ac = createAccessControl(statement)

export const admin = ac.newRole({
  ...adminAc.statements,
  clinical: ["view", "create", "update", "delete"],
  inventory: ["view", "create", "update", "delete"],
  sales: ["view", "create"],
  appointment: ["view", "create", "update", "delete"],
})

export const veterinarian = ac.newRole({
  clinical: ["view", "create", "update"],
  appointment: ["view", "create", "update"],
  session: ["list"],
  user: [],
})

export const worker = ac.newRole({
  inventory: ["view", "create", "update"],
  sales: ["view", "create"],
  appointment: ["view", "create", "update"],
  session: [],
  user: [],
})

export const roleNames = ["admin", "veterinarian", "worker"] as const

export type Role = (typeof roleNames)[number]
