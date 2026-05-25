import type { GetApiSpeciesData } from "@sanipatitas/shared/api/client/types.gen"
import { useStore } from "better-auth/react"
import { atom } from "nanostores"

// Store
export const $speciesQuery = atom<NonNullable<GetApiSpeciesData["query"]>>({
  page: 0,
  search: "",
  size: 10,
})

// Hook
export function useSpeciesQuery() {
  const speciesQuery = useStore($speciesQuery)

  return speciesQuery
}
