import {
  getApiInventoryStockByProduct,
  getApiInventoryStockMovementByStockByStockId,
  postApiInventoryStock,
  putApiInventoryStockById,
} from "@sanipatitas/shared/api/client"
import type {
  CreateStockRequest,
  StockDto,
} from "@sanipatitas/desktop/inventory/api/inventory-api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Query keys
const allProductsKey = ["inventory-products"] as const

// Hook to get stock by product ID
export function useStockByProduct(productId: string | null) {
  return useQuery({
    queryKey: ["stock", productId],
    queryFn: () =>
      getApiInventoryStockByProduct({
        query: { productId: productId! },
        throwOnError: true,
      }),
    enabled: !!productId,
  })
}

// Hook to get stock movements
export function useStockMovements(stockId: string | null) {
  return useQuery({
    queryKey: ["stock-movements", stockId],
    queryFn: () =>
      getApiInventoryStockMovementByStockByStockId({
        path: { stockId: stockId! },
        throwOnError: true,
      }),
    enabled: !!stockId,
  })
}

// Hook to create stock
export function useCreateStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateStockRequest) =>
      postApiInventoryStock({ body, throwOnError: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] })
      queryClient.invalidateQueries({ queryKey: allProductsKey })
    },
  })
}

// Hook to update stock
export function useUpdateStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, productId, ...body }: { id: string; productId: string } & Partial<CreateStockRequest>) =>
      putApiInventoryStockById({
        path: { id },
        body: { productId, ...body },
        throwOnError: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] })
    },
  })
}
