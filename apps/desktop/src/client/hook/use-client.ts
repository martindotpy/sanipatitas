import { $clientQuery, useClientQuery } from "@sanipatitas/desktop/client/store/client-query-store"
import {
  deleteApiClientByIdMutation,
  getApiClientOptions,
  postApiClientMutation,
  putApiClientByIdMutation,
} from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { useQuery, useMutation } from "@tanstack/react-query"

export const useClient = () => {
  const clientQuery = useClientQuery()

  return useQuery({
    ...getApiClientOptions({
      query: {
        page: clientQuery.page,
        size: clientQuery.size,
        search: clientQuery.search,
      },
    }),
  })
}

export const useCreateClient = () =>
  useMutation({
    ...postApiClientMutation(),
  })

export const useUpdateClient = () =>
  useMutation({
    ...putApiClientByIdMutation(),
  })

export const useDeleteClient = () =>
  useMutation({
    ...deleteApiClientByIdMutation(),
  })
