import {
  deleteApiInventorySupplierById,
  postApiInventorySupplier,
  putApiInventorySupplierById,
} from "@sanipatitas/shared/api/client"
import { getApiInventorySupplierOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import type {
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from "@sanipatitas/desktop/inventory/api/inventory-api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Query key
const supplierKey = ["inventory-suppliers"] as const

// Hook
export function useSuppliers() {
  return useQuery({
    ...getApiInventorySupplierOptions(),
  })
}

export function useCreateSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateSupplierRequest) =>
      postApiInventorySupplier({ body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKey })
    },
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & UpdateSupplierRequest) =>
      putApiInventorySupplierById({ path: { id }, body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKey })
    },
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      deleteApiInventorySupplierById({ path: { id }, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKey })
    },
  })
}
