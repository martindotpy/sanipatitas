import type {
  CreateProductRequest,
  UpdateProductRequest,
} from "@sanipatitas/desktop/inventory/api/inventory-api"
import {
  deleteApiInventoryProductById,
  postApiInventoryProduct,
  putApiInventoryProductById,
} from "@sanipatitas/shared/api/client"
import { getApiInventoryProductOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Query key
const productKey = ["inventory-products"] as const

// Hook
export function useProducts() {
  return useQuery({
    ...getApiInventoryProductOptions(),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateProductRequest) =>
      postApiInventoryProduct({ body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKey })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & UpdateProductRequest) =>
      putApiInventoryProductById({ path: { id }, body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKey })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      deleteApiInventoryProductById({ path: { id }, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKey })
    },
  })
}
