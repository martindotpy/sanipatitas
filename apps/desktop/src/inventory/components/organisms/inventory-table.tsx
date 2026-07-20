import type { ProductDto } from "@sanipatitas/desktop/inventory/api/inventory-api"
import { CreateProduct } from "@sanipatitas/desktop/inventory/components/organisms/create-product"
import { UpdateProduct } from "@sanipatitas/desktop/inventory/components/organisms/update-product"
import {
  useDeleteProduct,
  useProducts,
} from "@sanipatitas/desktop/inventory/hook/use-product"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@sanipatitas/ui/components/ui/alert-dialog"
import { Button } from "@sanipatitas/ui/components/ui/button"
import { Spinner } from "@sanipatitas/ui/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sanipatitas/ui/components/ui/table"
import { useState } from "react"
import { TbPencil, TbTrash } from "react-icons/tb"
import { toast } from "sonner"

// Component
export function InventoryTable() {
  const productsQuery = useProducts()
  const deleteMutation = useDeleteProduct()

  const products = productsQuery.data?.data ?? []
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ProductDto | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value)

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteOpen(false)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error(
          (error as { detail?: string })?.detail ??
            "Error al eliminar el producto"
        )
      },
    })
  }

  if (productsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {products.length} producto{products.length !== 1 ? "s" : ""}
        </p>
        <CreateProduct />
      </div>

      {products.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          No hay productos registrados.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.code ?? "—"}</TableCell>
                <TableCell>
                  {product.price != null ? formatCurrency(product.price) : "—"}
                </TableCell>
                <TableCell>
                  {product.category?.name ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {product.supplier?.name ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setEditingProduct(product)
                        setEditOpen(true)
                      }}
                    >
                      <TbPencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setDeleteTarget(product)
                        setDeleteOpen(true)
                      }}
                    >
                      <TbTrash className="text-destructive size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <UpdateProduct
        product={editingProduct}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingProduct(null)
        }}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar &quot;{deleteTarget?.name}
              &quot;? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
