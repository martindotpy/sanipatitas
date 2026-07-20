import { useConditionQuery } from "@sanipatitas/desktop/clinical/store/condition-query-store"
import {
  deleteApiClinicalConditionByIdMutation,
  getApiClinicalConditionOptions,
  postApiClinicalConditionMutation,
  putApiClinicalConditionByIdMutation,
} from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Query key
const conditionKey = ["conditions"] as const

// Hook
export function useConditions() {
  const query = useConditionQuery()

  const result = useQuery({
    ...getApiClinicalConditionOptions({
      query: {
        patientId: query.patientId,
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

export function useCreateCondition() {
  const queryClient = useQueryClient()
  const query = useConditionQuery()

  return useMutation({
    ...postApiClinicalConditionMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...conditionKey, query.patientId],
      })
    },
  })
}

export function useUpdateCondition() {
  const queryClient = useQueryClient()
  const query = useConditionQuery()

  return useMutation({
    ...putApiClinicalConditionByIdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...conditionKey, query.patientId],
      })
    },
  })
}

export function useDeleteCondition() {
  const queryClient = useQueryClient()
  const query = useConditionQuery()

  return useMutation({
    ...deleteApiClinicalConditionByIdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...conditionKey, query.patientId],
      })
    },
  })
}
