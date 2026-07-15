import { InventoryTable } from "@sanipatitas/desktop/inventory/components/organisms/inventory-table"
import { CreateCategory } from "@sanipatitas/desktop/inventory/components/organisms/create-category"
import { UpdateCategory } from "@sanipatitas/desktop/inventory/components/organisms/update-category"
import { CreateSupplier } from "@sanipatitas/desktop/inventory/components/organisms/create-supplier"
import { UpdateSupplier } from "@sanipatitas/desktop/inventory/components/organisms/update-supplier"
import {
  useCategories,
  useDeleteCategory,
} from "@sanipatitas/desktop/inventory/hook/use-category"
import {
  useDeleteSupplier,
  useSuppliers,
} from "@sanipatitas/desktop/inventory/hook/use-supplier"
import type {
  ProductCategoryDto,
  SupplierDto,
} from "@sanipatitas/desktop/inventory/api/inventory-api"
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
import { Tabs, TabsList, TabsTab, TabsPanel } from "@sanipatitas/ui/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sanipatitas/ui/components/ui/table"
import { H2 } from "@sanipatitas/ui/components/ui/typography"
import { Muted } from "@sanipatitas/ui/components/ui/typography/muted"
import { Section } from "@sanipatitas/ui/components/organisms/section"
import { Spinner } from "@sanipatitas/ui/components/ui/spinner"
import { useState } from "react"
import { TbPencil, TbTrash } from "react-icons/tb"

// Categories table
function CategoriesTab() {
  const categoriesQuery = useCategories()
  const deleteMutation = useDeleteCategory()
  const categories = categoriesQuery.data?.data ?? []
  const [editingCategory, setEditingCategory] = useState<ProductCategoryDto | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ProductCategoryDto | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteOpen(false)
        setDeleteTarget(null)
      },
    })
  }

  if (categoriesQuery.isLoading) {
    return <div className="flex items-center justify-center py-8"><Spinner /></div>
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
                    <Button variant="ghost" size="icon-sm" onClick={() => { setEditingCategory(category); setEditOpen(true) }}>
                      <TbPencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => { setDeleteTarget(category); setDeleteOpen(true) }}>
                      <TbTrash className="text-destructive size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <UpdateCategory category={editingCategory} open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setEditingCategory(null) }} />
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar categoría</AlertDialogTitle>
            <AlertDialogDescription>¿Estás seguro? Esta acción no se puede deshacer.</AlertDialogDescription>
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
  const [editingSupplier, setEditingSupplier] = useState<SupplierDto | null>(null)
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
    })
  }

  if (suppliersQuery.isLoading) {
    return <div className="flex items-center justify-center py-8"><Spinner /></div>
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
                    <Button variant="ghost" size="icon-sm" onClick={() => { setEditingSupplier(supplier); setEditOpen(true) }}>
                      <TbPencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => { setDeleteTarget(supplier); setDeleteOpen(true) }}>
                      <TbTrash className="text-destructive size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <UpdateSupplier supplier={editingSupplier} open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setEditingSupplier(null) }} />
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar proveedor</AlertDialogTitle>
            <AlertDialogDescription>¿Estás seguro? Esta acción no se puede deshacer.</AlertDialogDescription>
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

// Component
export function InventorySection() {
  return (
    <Section className="flex w-full min-w-0 flex-1 flex-col gap-4 p-4">
      <div>
        <H2>Inventario</H2>
        <Muted>Gestión de productos, stock y movimientos de inventario.</Muted>
      </div>        <Tabs defaultValue="products">
        <TabsList>
          <TabsTab value="products">Productos</TabsTab>
          <TabsTab value="categories">Categorías</TabsTab>
          <TabsTab value="suppliers">Proveedores</TabsTab>
        </TabsList>
        <TabsPanel value="products">
          <InventoryTable />
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
