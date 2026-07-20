import { usePrescriptionQuery } from "@sanipatitas/desktop/clinical/store/prescription-query-store"
import {
  deleteApiClinicalPrescriptionById,
  postApiClinicalPrescription,
  putApiClinicalPrescriptionById,
} from "@sanipatitas/shared/api/client"
import { getApiClinicalPrescriptionOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import type {
  OpenapiCreatePrescriptionRequest,
  OpenapiUpdatePrescriptionRequest,
} from "@sanipatitas/shared/api/client/types.gen"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Query key
const prescriptionKey = ["prescriptions"] as const

// Hook
export function usePrescriptions() {
  const query = usePrescriptionQuery()

  const result = useQuery({
    ...getApiClinicalPrescriptionOptions({
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

export function useCreatePrescription() {
  const queryClient = useQueryClient()
  const query = usePrescriptionQuery()

  return useMutation({
    mutationFn: (body: OpenapiCreatePrescriptionRequest) =>
      postApiClinicalPrescription({ body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...prescriptionKey, query.patientId],
      })
    },
  })
}

export function useUpdatePrescription() {
  const queryClient = useQueryClient()
  const query = usePrescriptionQuery()

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: OpenapiUpdatePrescriptionRequest
    }) =>
      putApiClinicalPrescriptionById({
        path: { id },
        body,
        throwOnError: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...prescriptionKey, query.patientId],
      })
    },
  })
}

export function useDeletePrescription() {
  const queryClient = useQueryClient()
  const query = usePrescriptionQuery()

  return useMutation({
    mutationFn: (id: string) =>
      deleteApiClinicalPrescriptionById({ path: { id }, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...prescriptionKey, query.patientId],
      })
    },
  })
}
