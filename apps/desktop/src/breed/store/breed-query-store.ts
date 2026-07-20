import { useStore } from "@nanostores/react"
import { atom } from "nanostores"

export interface BreedQuery {
  page: number
  size: number
  search?: string
  speciesIds: string[]
}

export const $breedQuery = atom<BreedQuery>({
  page: 0,
  size: 20,
  speciesIds: [],
})

export const useBreedQuery = () => useStore($breedQuery)
