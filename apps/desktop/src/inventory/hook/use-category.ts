import {
  deleteApiInventoryProductCategoryById,
  postApiInventoryProductCategory,
  putApiInventoryProductCategoryById,
} from "@sanipatitas/shared/api/client"
import { getApiInventoryProductCategoryOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import type {
  CreateProductCategoryRequest,
  UpdateProductCategoryRequest,
} from "@sanipatitas/desktop/inventory/api/inventory-api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Query key
const categoryKey = ["inventory-categories"] as const

// Hook
export function useCategories() {
  return useQuery({
    ...getApiInventoryProductCategoryOptions(),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateProductCategoryRequest) =>
      postApiInventoryProductCategory({ body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKey })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & UpdateProductCategoryRequest) =>
      putApiInventoryProductCategoryById({ path: { id }, body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKey })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      deleteApiInventoryProductCategoryById({ path: { id }, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKey })
    },
  })
}
