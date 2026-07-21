import type {
  BillingItemDto,
  CreateBillingItemRequest,
  CreateBillingRequest,
  CreatePaymentRequest,
  PaymentDto,
  UpdateBillingRequest,
} from "@sanipatitas/desktop/billing/api/billing-api"
import {
  deleteApiBillingById,
  getApiBillingByBillingIdItem,
  getApiBillingByBillingIdPayment,
  postApiBilling,
  postApiBillingByBillingIdItem,
  postApiBillingByBillingIdPayment,
  putApiBillingById,
} from "@sanipatitas/shared/api/client"
import {
  getApiBillingOptions,
  getApiBillingQueryKey,
} from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Invalidate the codegen billing list query (not a custom ["billings"] key)
const invalidateBillings = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: getApiBillingQueryKey() })

// Hook
export function useBillings() {
  return useQuery({
    ...getApiBillingOptions(),
  })
}

export function useBillingItems(billingId: string | null) {
  return useQuery<BillingItemDto[]>({
    queryKey: ["billing-items", billingId],
    queryFn: async () => {
      const result = await getApiBillingByBillingIdItem({
        path: { billingId: billingId! },
        throwOnError: true,
      })

      return result.data?.data ?? []
    },
    enabled: !!billingId,
  })
}

export function useBillingPayments(billingId: string | null) {
  return useQuery<PaymentDto[]>({
    queryKey: ["billing-payments", billingId],
    queryFn: async () => {
      const result = await getApiBillingByBillingIdPayment({
        path: { billingId: billingId! },
        throwOnError: true,
      })

      return result.data?.data ?? []
    },
    enabled: !!billingId,
  })
}

export function useCreateBilling() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateBillingRequest) =>
      postApiBilling({ body, throwOnError: true }),
    onSuccess: () => {
      void invalidateBillings(queryClient)
    },
  })
}

export function useUpdateBilling() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & UpdateBillingRequest) =>
      putApiBillingById({ path: { id }, body, throwOnError: true }),
    onSuccess: () => {
      void invalidateBillings(queryClient)
    },
  })
}

export function useDeleteBilling() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      deleteApiBillingById({ path: { id }, throwOnError: true }),
    onSuccess: () => {
      void invalidateBillings(queryClient)
    },
  })
}

export function useCreateBillingItem(billingId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateBillingItemRequest) =>
      postApiBillingByBillingIdItem({
        path: { billingId },
        body,
        throwOnError: true,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["billing-items", billingId],
      })
      void invalidateBillings(queryClient)
    },
  })
}

export function useCreatePayment(billingId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreatePaymentRequest) =>
      postApiBillingByBillingIdPayment({
        path: { billingId },
        body,
        throwOnError: true,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["billing-payments", billingId],
      })
      void invalidateBillings(queryClient)
    },
  })
}
