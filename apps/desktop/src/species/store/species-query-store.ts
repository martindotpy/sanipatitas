import { useStore } from "@nanostores/react"
import type { GetApiSpeciesData } from "@sanipatitas/shared/api/client/types.gen"
import { atom } from "nanostores"

// Store
export const $speciesQuery = atom<
  Omit<Required<NonNullable<GetApiSpeciesData["query"]>>, "search"> & {
    search?: string
  }
>({
  page: 0,
  size: 20,
})

// Hook
export function useSpeciesQuery() {
  const speciesQuery = useStore($speciesQuery)

  return speciesQuery
}
