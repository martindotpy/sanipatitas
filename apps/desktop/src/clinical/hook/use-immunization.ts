import { useImmunizationQuery } from "@sanipatitas/desktop/clinical/store/immunization-query-store"
import { getApiClinicalImmunizationOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import {
  postApiClinicalImmunization,
  putApiClinicalImmunizationById,
  deleteApiClinicalImmunizationById,
} from "@sanipatitas/shared/api/client"
import type {
  OpenapiCreateImmunizationRequest,
  OpenapiUpdateImmunizationRequest,
} from "@sanipatitas/shared/api/client/types.gen"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Query key
const immunizationKey = ["immunizations"] as const

// Hook
export function useImmunizations() {
  const query = useImmunizationQuery()

  const result = useQuery({
    ...getApiClinicalImmunizationOptions({
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

export function useCreateImmunization() {
  const queryClient = useQueryClient()
  const query = useImmunizationQuery()

  return useMutation({
    mutationFn: (body: OpenapiCreateImmunizationRequest) =>
      postApiClinicalImmunization({ body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...immunizationKey, query.patientId] })
    },
  })
}

export function useUpdateImmunization() {
  const queryClient = useQueryClient()
  const query = useImmunizationQuery()

  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & OpenapiUpdateImmunizationRequest) =>
      putApiClinicalImmunizationById({ path: { id }, body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...immunizationKey, query.patientId] })
    },
  })
}

export function useDeleteImmunization() {
  const queryClient = useQueryClient()
  const query = useImmunizationQuery()

  return useMutation({
    mutationFn: (id: string) =>
      deleteApiClinicalImmunizationById({ path: { id }, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...immunizationKey, query.patientId] })
    },
  })
}
