import { useObservationQuery } from "@sanipatitas/desktop/clinical/store/observation-query-store"
import { getApiClinicalObservationOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import {
  postApiClinicalObservation,
  putApiClinicalObservationById,
  deleteApiClinicalObservationById,
} from "@sanipatitas/shared/api/client"
import type {
  OpenapiCreateMedicalObservationRequest,
  OpenapiUpdateMedicalObservationRequest,
} from "@sanipatitas/shared/api/client/types.gen"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Query key
const observationKey = ["observations"] as const

// Hook
export function useObservations() {
  const query = useObservationQuery()

  const result = useQuery({
    ...getApiClinicalObservationOptions({
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

export function useCreateObservation() {
  const queryClient = useQueryClient()
  const query = useObservationQuery()

  return useMutation({
    mutationFn: (body: OpenapiCreateMedicalObservationRequest) =>
      postApiClinicalObservation({ body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...observationKey, query.patientId] })
    },
  })
}

export function useUpdateObservation() {
  const queryClient = useQueryClient()
  const query = useObservationQuery()

  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & OpenapiUpdateMedicalObservationRequest) =>
      putApiClinicalObservationById({ path: { id }, body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...observationKey, query.patientId] })
    },
  })
}

export function useDeleteObservation() {
  const queryClient = useQueryClient()
  const query = useObservationQuery()

  return useMutation({
    mutationFn: (id: string) =>
      deleteApiClinicalObservationById({ path: { id }, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...observationKey, query.patientId] })
    },
  })
}
