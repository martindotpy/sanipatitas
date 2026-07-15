import { useBreedQuery } from "@sanipatitas/desktop/breed/store/breed-query-store"
import {
  deleteApiBreedByIdMutation,
  getApiBreedOptions,
  postApiBreedMutation,
  putApiBreedByIdMutation,
} from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"

export const useBreed = () => {
  const breedQuery = useBreedQuery()

  return useQuery({
    ...getApiBreedOptions({
      query: {
        page: breedQuery.page,
        size: breedQuery.size,
        search: breedQuery.search,
        speciesId: breedQuery.speciesIds && breedQuery.speciesIds.length > 0
          ? breedQuery.speciesIds
          : undefined,
      },
    }),
    placeholderData: keepPreviousData,
  })
}

export const useCreateBreed = () =>
  useMutation({
    ...postApiBreedMutation(),
  })

export const useUpdateBreed = () =>
  useMutation({
    ...putApiBreedByIdMutation(),
  })

export const useDeleteBreed = () =>
  useMutation({
    ...deleteApiBreedByIdMutation(),
  })
