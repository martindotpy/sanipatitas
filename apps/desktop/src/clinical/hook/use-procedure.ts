import { useProcedureQuery } from "@sanipatitas/desktop/clinical/store/procedure-query-store"
import { getApiClinicalProcedureOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import {
  postApiClinicalProcedure,
  putApiClinicalProcedureById,
  deleteApiClinicalProcedureById,
} from "@sanipatitas/shared/api/client"
import type {
  OpenapiCreateProcedureRequest,
  OpenapiUpdateProcedureRequest,
} from "@sanipatitas/shared/api/client/types.gen"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Query key
const procedureKey = ["procedures"] as const

// Hook
export function useProcedures() {
  const query = useProcedureQuery()

  const result = useQuery({
    ...getApiClinicalProcedureOptions({
      query: {
        patientId: query.patientId ?? undefined,
        page: query.page,
        size: query.size,
      },
    }),
    enabled: !!query.patientId,
  })

  return {
    data: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    refetch: result.refetch,
  }
}

export function useCreateProcedure() {
  const queryClient = useQueryClient()
  const query = useProcedureQuery()

  return useMutation({
    mutationFn: (body: OpenapiCreateProcedureRequest) =>
      postApiClinicalProcedure({ body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...procedureKey, query.patientId] })
    },
  })
}

export function useUpdateProcedure() {
  const queryClient = useQueryClient()
  const query = useProcedureQuery()

  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & OpenapiUpdateProcedureRequest) =>
      putApiClinicalProcedureById({ path: { id }, body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...procedureKey, query.patientId] })
    },
  })
}

export function useDeleteProcedure() {
  const queryClient = useQueryClient()
  const query = useProcedureQuery()

  return useMutation({
    mutationFn: (id: string) =>
      deleteApiClinicalProcedureById({ path: { id }, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...procedureKey, query.patientId] })
    },
  })
}
