import { useSpeciesQuery } from "@sanipatitas/desktop/species/store/species-query-store"
import {
  getApiSpeciesOptions,
  postApiSpeciesMutation,
} from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"

// Hook
export function useSpecies() {
  const speciesQuery = useSpeciesQuery()

  const query = useQuery({
    ...getApiSpeciesOptions({ query: speciesQuery }),
    placeholderData: keepPreviousData,
  })

  return query
}

export function useCreateSpecies() {
  const createSpeciesMutation = useMutation({
    ...postApiSpeciesMutation(),
  })

  return createSpeciesMutation
}
