import { CreateSpecies } from "@sanipatitas/desktop/species/components/organisms/create-species"
import { DeleteSpeciesAlert } from "@sanipatitas/desktop/species/components/organisms/delete-species"
import { SearchSpeciesForm } from "@sanipatitas/desktop/species/components/organisms/search-species-form"
import { SpeciesDetailsSheet } from "@sanipatitas/desktop/species/components/organisms/species-details-sheet"
import { UpdateSpecies } from "@sanipatitas/desktop/species/components/organisms/update-species"
import { useSpecies } from "@sanipatitas/desktop/species/hook/use-species"
import { $speciesQuery } from "@sanipatitas/desktop/species/store/species-query-store"
import type { OpenapiSpeciesDto } from "@sanipatitas/shared/api/client/types.gen"
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
const baseColumns = withSelectionColumns<OpenapiSpeciesDto>([
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
export function SpeciesTable() {
  const speciesQueryState = useSpecies()

  const species = speciesQueryState.data?.data ?? []
  const speciesPageCount = speciesQueryState.data?.totalPages

  // Table key (bumps on delete to reset internal state)
  const [tableKey, setTableKey] = useState(0)

  // Selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>(
    {}
  )

  // Action bar state (separate from selection so it doesn't reopen after closing)
  const [actionBarOpen, setActionBarOpen] = useState(false)

  // Sync action bar with selection
  useEffect(() => {
    const selected = Object.keys(selectedRowIds).length > 0
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (selected) setActionBarOpen(true)
    else setActionBarOpen(false)
  }, [selectedRowIds])

  // Action state
  const [viewingSpecies, setViewingSpecies] =
    useState<OpenapiSpeciesDto | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editingSpecies, setEditingSpecies] =
    useState<OpenapiSpeciesDto | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<OpenapiSpeciesDto[]>([])
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Selected count
  const selectedCount = Object.keys(selectedRowIds).length

  // Actions
  const actions: RowAction<OpenapiSpeciesDto>[] = [
    {
      label: "Ver detalles",
      icon: TbEye,
      onClick: (s) => {
        setViewingSpecies(s)
        setDetailsOpen(true)
      },
    },
    {
      label: "Editar",
      icon: TbPencil,
      onClick: (s) => {
        setEditingSpecies(s)
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
    const selected = species.filter((_, i) => selectedRowIds[i.toString()])

    if (selected.length > 0) {
      setDeleteTarget(selected)
      setDeleteOpen(true)
    }
  }, [species, selectedRowIds])

  // Clear selection after delete
  const handleDeleteSuccess = useCallback(() => {
    setSelectedRowIds({})
    setTableKey((k) => k + 1)
  }, [])

  return (
    <>
      <DataTable
        key={tableKey}
        id="species-table"
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
        data={species}
        loading={speciesQueryState.isLoading}
        initialState={{
          pagination: {
            pageIndex: $speciesQuery.get().page,
            pageSize: $speciesQuery.get().size,
          },
        }}
        onPaginationChange={(pagination) => {
          $speciesQuery.set({
            ...$speciesQuery.get(),
            page: pagination.pageIndex,
            size: pagination.pageSize,
          })
        }}
        onRowSelectionChange={setSelectedRowIds}
        pageCount={speciesPageCount}
        searchRender={({ table }) => (
          <>
            <SearchSpeciesForm table={table} />
            <CreateSpecies />
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

      <SpeciesDetailsSheet
        species={viewingSpecies}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setViewingSpecies(null)
        }}
      />

      <UpdateSpecies
        species={editingSpecies}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingSpecies(null)
        }}
      />

      <DeleteSpeciesAlert
        species={deleteTarget}
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
