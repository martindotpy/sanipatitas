import { BreedDetailsSheet } from "@sanipatitas/desktop/breed/components/organisms/breed-details-sheet"
import { CreateBreed } from "@sanipatitas/desktop/breed/components/organisms/create-breed"
import { DeleteBreedAlert } from "@sanipatitas/desktop/breed/components/organisms/delete-breed"
import { SearchBreedForm } from "@sanipatitas/desktop/breed/components/organisms/search-breed-form"
import { SpeciesFilterCombobox } from "@sanipatitas/desktop/breed/components/organisms/species-filter-combobox"
import { UpdateBreed } from "@sanipatitas/desktop/breed/components/organisms/update-breed"
import { useBreed } from "@sanipatitas/desktop/breed/hook/use-breed"
import { $breedQuery } from "@sanipatitas/desktop/breed/store/breed-query-store"
import type { OpenapiBreedDto } from "@sanipatitas/shared/api/client/types.gen"
import {
  ActionBar,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
} from "@sanipatitas/ui/components/ui/action-bar"
import { withSelectionColumns } from "@sanipatitas/ui/components/ui/data-column"
import { DataTable } from "@sanipatitas/ui/components/ui/data-table"
import type { RowAction } from "@sanipatitas/ui/components/ui/data-table-row-actions"
import { DataTableRowActions } from "@sanipatitas/ui/components/ui/data-table-row-actions"
import { useCallback, useEffect, useState } from "react"
import { TbEye, TbPencil, TbTrash } from "react-icons/tb"

// Columns
const baseColumns = withSelectionColumns<OpenapiBreedDto>([
  {
    accessorKey: "species.name",
    meta: { label: "Especie" },
  },
  {
    accessorKey: "name",
    meta: { label: "Nombre" },
  },
  {
    accessorKey: "description",
    meta: { label: "Descripción" },
  },
])

// Component
export function BreedTable() {
  const breedQueryState = useBreed()

  const breeds = breedQueryState.data?.data ?? []
  const breedPageCount = breedQueryState.data?.totalPages

  // Table key
  const [tableKey, setTableKey] = useState(0)

  // Selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>(
    {}
  )

  // Action bar state
  const [actionBarOpen, setActionBarOpen] = useState(false)

  useEffect(() => {
    const selected = Object.keys(selectedRowIds).length > 0
    if (selected) setActionBarOpen(true)
    else setActionBarOpen(false)
  }, [selectedRowIds])

  // Action state
  const [viewingBreed, setViewingBreed] = useState<OpenapiBreedDto | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editingBreed, setEditingBreed] = useState<OpenapiBreedDto | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<OpenapiBreedDto[]>([])
  const [deleteOpen, setDeleteOpen] = useState(false)

  const selectedCount = Object.keys(selectedRowIds).length

  // Actions
  const actions: RowAction<OpenapiBreedDto>[] = [
    {
      label: "Ver detalles",
      icon: TbEye,
      onClick: (s) => {
        setViewingBreed(s)
        setDetailsOpen(true)
      },
    },
    {
      label: "Editar",
      icon: TbPencil,
      onClick: (s) => {
        setEditingBreed(s)
        setEditOpen(true)
      },
    },
    {
      label: "Eliminar",
      icon: TbTrash,
      variant: "destructive",
      onClick: (s) => {
        setDeleteTarget([s])
        setDeleteOpen(true)
      },
    },
  ]

  // Bulk delete
  const handleBulkDelete = useCallback(() => {
    const selected = breeds.filter((_, i) => selectedRowIds[i.toString()])

    if (selected.length > 0) {
      setDeleteTarget(selected)
      setDeleteOpen(true)
    }
  }, [breeds, selectedRowIds])

  // Clear selection after delete
  const handleDeleteSuccess = useCallback(() => {
    setSelectedRowIds({})
    setTableKey((k) => k + 1)
  }, [])

  return (
    <>
      <DataTable
        key={tableKey}
        id="breed-table"
        columns={[
          ...baseColumns,
          {
            id: "actions",
            cell: ({ row }) => (
              <DataTableRowActions row={row} actions={actions} />
            ),
            enableSorting: false,
            enableHiding: false,
            maxSize: 48,
            minSize: 48,
            meta: { role: "actions" },
          },
        ]}
        data={breeds}
        loading={breedQueryState.isLoading}
        initialState={{
          pagination: {
            pageIndex: $breedQuery.get().page,
            pageSize: $breedQuery.get().size,
          },
        }}
        onPaginationChange={(pagination) => {
          $breedQuery.set({
            ...$breedQuery.get(),
            page: pagination.pageIndex,
            size: pagination.pageSize,
          })
        }}
        onRowSelectionChange={setSelectedRowIds}
        pageCount={breedPageCount}
        tableOptionsRender={<SpeciesFilterCombobox />}
        searchRender={({ table }) => (
          <>
            <SearchBreedForm table={table} />
            <CreateBreed />
          </>
        )}
        selectionActionsRender={() => (
          <ActionBar open={actionBarOpen} onOpenChange={setActionBarOpen}>
            <ActionBarSelection>
              {selectedCount} seleccionado{selectedCount !== 1 ? "s" : ""}
            </ActionBarSelection>

            <ActionBarGroup>
              <ActionBarItem variant="destructive" onSelect={handleBulkDelete}>
                <TbTrash />
                Eliminar
              </ActionBarItem>
            </ActionBarGroup>
          </ActionBar>
        )}
      />

      <BreedDetailsSheet
        breed={viewingBreed}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setViewingBreed(null)
        }}
      />

      <UpdateBreed
        breed={editingBreed}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingBreed(null)
        }}
      />

      <DeleteBreedAlert
        breeds={deleteTarget}
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open)
          if (!open) {
            setDeleteTarget([])
            setSelectedRowIds({})
          }
        }}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}
