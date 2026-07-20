import type {
  CreateStockRequest,
  StockDto,
  StockMovementDto,
} from "@sanipatitas/desktop/inventory/api/inventory-api"
import {
  getApiInventoryStockByProduct,
  getApiInventoryStockMovementByStockByStockId,
  postApiInventoryStock,
  putApiInventoryStockById,
} from "@sanipatitas/shared/api/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Query keys
const allProductsKey = ["inventory-products"] as const
const stockKey = (productId: string) => ["stock", productId] as const

// Hook to get stock by product ID (null when not registered)
export function useStockByProduct(productId: string | null) {
  return useQuery({
    queryKey: stockKey(productId ?? ""),
    queryFn: async (): Promise<StockDto | null> => {
      const result = await getApiInventoryStockByProduct({
        query: { productId: productId! },
      })

      if (result.response?.status === 404) {
        return null
      }

      if (result.error) {
        throw result.error
      }

      return result.data?.data ?? null
    },
    enabled: !!productId,
    retry: false,
  })
}

// Hook to get stock movements
export function useStockMovements(stockId: string | null) {
  return useQuery({
    queryKey: ["stock-movements", stockId],
    queryFn: async (): Promise<StockMovementDto[]> => {
      const result = await getApiInventoryStockMovementByStockByStockId({
        path: { stockId: stockId! },
        throwOnError: true,
      })

      return result.data?.data ?? []
    },
    enabled: !!stockId,
  })
}

// Hook to create stock
export function useCreateStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateStockRequest) =>
      postApiInventoryStock({ body, throwOnError: true }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["stock", variables.productId],
      })
      queryClient.invalidateQueries({ queryKey: ["stock"] })
      queryClient.invalidateQueries({ queryKey: allProductsKey })
    },
  })
}

// Hook to update stock
export function useUpdateStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      productId,
      ...body
    }: { id: string; productId: string } & Partial<CreateStockRequest>) =>
      putApiInventoryStockById({
        path: { id },
        body: { productId, ...body },
        throwOnError: true,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["stock", variables.productId],
      })
      queryClient.invalidateQueries({ queryKey: ["stock"] })
    },
  })
}
