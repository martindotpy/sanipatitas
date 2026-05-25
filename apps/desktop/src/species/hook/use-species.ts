import { useSpeciesQuery } from "@sanipatitas/desktop/species/store/species-query-store"
import { getApiSpeciesOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { useQuery } from "@tanstack/react-query"

// Hook
export function useSpecies() {
  const speciesQuery = useSpeciesQuery()

  const query = useQuery({
    ...getApiSpeciesOptions({ query: speciesQuery }),
  })

  return query
}
