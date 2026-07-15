import {
  deleteApiBillingById,
  getApiBillingByBillingIdItem,
  getApiBillingByBillingIdPayment,
  postApiBilling,
  postApiBillingByBillingIdItem,
  postApiBillingByBillingIdPayment,
  putApiBillingById,
} from "@sanipatitas/shared/api/client"
import { getApiBillingOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import type {
  BillingItemDto,
  CreateBillingItemRequest,
  CreateBillingRequest,
  CreatePaymentRequest,
  PaymentDto,
  UpdateBillingRequest,
} from "@sanipatitas/desktop/billing/api/billing-api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Query keys
const billingKey = ["billings"] as const

// Hook
export function useBillings() {
  return useQuery({
    ...getApiBillingOptions(),
  })
}

export function useBillingItems(billingId: string | null) {
  return useQuery({
    queryKey: ["billing-items", billingId],
    queryFn: () =>
      getApiBillingByBillingIdItem({
        path: { billingId: billingId! },
        throwOnError: true,
      }),
    enabled: !!billingId,
  })
}

export function useBillingPayments(billingId: string | null) {
  return useQuery({
    queryKey: ["billing-payments", billingId],
    queryFn: () =>
      getApiBillingByBillingIdPayment({
        path: { billingId: billingId! },
        throwOnError: true,
      }),
    enabled: !!billingId,
  })
}

export function useCreateBilling() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateBillingRequest) =>
      postApiBilling({ body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKey })
    },
  })
}

export function useUpdateBilling() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & UpdateBillingRequest) =>
      putApiBillingById({ path: { id }, body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKey })
    },
  })
}

export function useDeleteBilling() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      deleteApiBillingById({ path: { id }, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKey })
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
      queryClient.invalidateQueries({ queryKey: ["billing-items", billingId] })
      queryClient.invalidateQueries({ queryKey: billingKey })
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
      queryClient.invalidateQueries({ queryKey: ["billing-payments", billingId] })
      queryClient.invalidateQueries({ queryKey: billingKey })
    },
  })
}
