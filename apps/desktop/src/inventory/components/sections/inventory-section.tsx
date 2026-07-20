import type {
  ProductCategoryDto,
  ProductDto,
  SupplierDto,
} from "@sanipatitas/desktop/inventory/api/inventory-api"
import { CreateCategory } from "@sanipatitas/desktop/inventory/components/organisms/create-category"
import { CreateStockDialog } from "@sanipatitas/desktop/inventory/components/organisms/create-stock-dialog"
import { CreateSupplier } from "@sanipatitas/desktop/inventory/components/organisms/create-supplier"
import { InventoryTable } from "@sanipatitas/desktop/inventory/components/organisms/inventory-table"
import { UpdateCategory } from "@sanipatitas/desktop/inventory/components/organisms/update-category"
import { UpdateSupplier } from "@sanipatitas/desktop/inventory/components/organisms/update-supplier"
import {
  useCategories,
  useDeleteCategory,
} from "@sanipatitas/desktop/inventory/hook/use-category"
import { useProducts } from "@sanipatitas/desktop/inventory/hook/use-product"
import {
  useStockByProduct,
  useStockMovements,
} from "@sanipatitas/desktop/inventory/hook/use-stock"
import {
  useDeleteSupplier,
  useSuppliers,
} from "@sanipatitas/desktop/inventory/hook/use-supplier"
import { Section } from "@sanipatitas/ui/components/organisms/section"
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
import { Badge } from "@sanipatitas/ui/components/ui/badge"
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
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@sanipatitas/ui/components/ui/tabs"
import { H2 } from "@sanipatitas/ui/components/ui/typography"
import { Muted } from "@sanipatitas/ui/components/ui/typography/muted"
import { useState } from "react"
import { TbHistory, TbPencil, TbTrash } from "react-icons/tb"
import { toast } from "sonner"

// Categories table
function CategoriesTab() {
  const categoriesQuery = useCategories()
  const deleteMutation = useDeleteCategory()
  const categories = categoriesQuery.data?.data ?? []
  const [editingCategory, setEditingCategory] =
    useState<ProductCategoryDto | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ProductCategoryDto | null>(
    null
  )
  const [deleteOpen, setDeleteOpen] = useState(false)

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
            "Error al eliminar la categoría"
        )
      },
    })
  }

  if (categoriesQuery.isLoading) {
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
          {categories.length} categoría{categories.length !== 1 ? "s" : ""}
        </p>
        <CreateCategory />
      </div>

      {categories.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          No hay categorías registradas.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setEditingCategory(category)
                        setEditOpen(true)
                      }}
                    >
                      <TbPencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setDeleteTarget(category)
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

      <UpdateCategory
        category={editingCategory}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingCategory(null)
        }}
      />
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar categoría</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro? Esta acción no se puede deshacer.
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

// Suppliers table
function SuppliersTab() {
  const suppliersQuery = useSuppliers()
  const deleteMutation = useDeleteSupplier()
  const suppliers = suppliersQuery.data?.data ?? []
  const [editingSupplier, setEditingSupplier] = useState<SupplierDto | null>(
    null
  )
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<SupplierDto | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

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
            "Error al eliminar el proveedor"
        )
      },
    })
  }

  if (suppliersQuery.isLoading) {
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
          {suppliers.length} proveedor{suppliers.length !== 1 ? "es" : ""}
        </p>
        <CreateSupplier />
      </div>

      {suppliers.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          No hay proveedores registrados.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>RUC</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.ruc ?? "—"}</TableCell>
                <TableCell>{supplier.contactName ?? "—"}</TableCell>
                <TableCell>{supplier.contactPhone ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setEditingSupplier(supplier)
                        setEditOpen(true)
                      }}
                    >
                      <TbPencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setDeleteTarget(supplier)
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

      <UpdateSupplier
        supplier={editingSupplier}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingSupplier(null)
        }}
      />
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar proveedor</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro? Esta acción no se puede deshacer.
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

// Stock table per product
function StockTab() {
  const productsQuery = useProducts()
  const products = productsQuery.data?.data ?? []
  const [showMovementsFor, setShowMovementsFor] = useState<string | null>(null)

  if (productsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Stock actual</TableHead>
            <TableHead>Stock mínimo</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-36" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-muted-foreground py-8 text-center"
              >
                No hay productos registrados.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <StockRow
                key={product.id}
                product={product}
                onViewMovements={() =>
                  setShowMovementsFor(
                    showMovementsFor === product.id ? null : product.id
                  )
                }
                showMovements={showMovementsFor === product.id}
              />
            ))
          )}
        </TableBody>
      </Table>
    </>
  )
}

interface StockRowProps {
  product: ProductDto
  onViewMovements: () => void
  showMovements: boolean
}

function StockRow({ product, onViewMovements, showMovements }: StockRowProps) {
  const stockQuery = useStockByProduct(product.id)
  const stock = stockQuery.data ?? null
  const movementsQuery = useStockMovements(
    showMovements ? (stock?.id ?? null) : null
  )
  const movements = movementsQuery.data ?? []

  const quantity = stock?.quantity ?? 0
  const minStock = stock?.minStock
  const isLowStock = minStock != null && quantity <= minStock

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{product.name}</TableCell>
        <TableCell>
          {stockQuery.isLoading ? "…" : stock ? quantity : "—"}
        </TableCell>
        <TableCell>
          {stockQuery.isLoading ? "…" : (minStock?.toString() ?? "—")}
        </TableCell>
        <TableCell>
          {stockQuery.isLoading ? "…" : (stock?.location ?? "—")}
        </TableCell>
        <TableCell>
          {stockQuery.isLoading ? (
            <Badge variant="outline">Cargando</Badge>
          ) : stock ? (
            isLowStock ? (
              <Badge variant="destructive">Stock bajo</Badge>
            ) : quantity > 0 ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              >
                Disponible
              </Badge>
            ) : (
              <Badge variant="outline">Sin stock</Badge>
            )
          ) : (
            <Badge variant="outline">Sin registrar</Badge>
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              className="cursor-pointer"
              onClick={onViewMovements}
              disabled={!stock}
            >
              <TbHistory className="size-4" />
            </Button>
            {!stock && !stockQuery.isLoading && (
              <CreateStockDialog product={product} />
            )}
          </div>
        </TableCell>
      </TableRow>
      {showMovements && stock && (
        <TableRow>
          <TableCell colSpan={6} className="bg-muted/30 p-3">
            {movementsQuery.isLoading ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : movements.length === 0 ? (
              <p className="text-muted-foreground text-center text-sm">
                Sin movimientos registrados.
              </p>
            ) : (
              <div className="space-y-1">
                {movements.map((m) => (
                  <div
                    key={m.id}
                    className="text-muted-foreground flex items-center justify-between text-sm"
                  >
                    <span>
                      {m.type === "PURCHASE_ENTRY"
                        ? "Entrada"
                        : m.type === "SALE_EXIT"
                          ? "Salida"
                          : m.type}
                    </span>
                    <span>
                      {m.quantity != null ? `x${m.quantity}` : ""}{" "}
                      {m.unitPrice != null ? `S/ ${m.unitPrice}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

// Component
export function InventorySection() {
  return (
    <Section className="flex w-full min-w-0 flex-1 flex-col gap-4 p-4">
      <div>
        <H2>Inventario</H2>
        <Muted>Gestión de productos, stock y movimientos de inventario.</Muted>
      </div>
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTab value="products">Productos</TabsTab>
          <TabsTab value="stock">Stock</TabsTab>
          <TabsTab value="categories">Categorías</TabsTab>
          <TabsTab value="suppliers">Proveedores</TabsTab>
        </TabsList>
        <TabsPanel value="products">
          <InventoryTable />
        </TabsPanel>
        <TabsPanel value="stock">
          <StockTab />
        </TabsPanel>
        <TabsPanel value="categories">
          <CategoriesTab />
        </TabsPanel>
        <TabsPanel value="suppliers">
          <SuppliersTab />
        </TabsPanel>
      </Tabs>
    </Section>
  )
}
