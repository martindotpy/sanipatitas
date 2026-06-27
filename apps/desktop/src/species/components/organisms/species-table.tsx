import { CreateSpecies } from "@sanipatitas/desktop/species/components/organisms/create-species"
import { DeleteSpecies } from "@sanipatitas/desktop/species/components/organisms/delete-species"
import { SearchSpeciesForm } from "@sanipatitas/desktop/species/components/organisms/search-species-form"
import { SpeciesDetailsSheet } from "@sanipatitas/desktop/species/components/organisms/species-details-sheet"
import { UpdateSpecies } from "@sanipatitas/desktop/species/components/organisms/update-species"
import { useSpecies } from "@sanipatitas/desktop/species/hook/use-species"
import { $speciesQuery } from "@sanipatitas/desktop/species/store/species-query-store"
import type { OpenapiSpeciesDto } from "@sanipatitas/shared/api/client/types.gen"
import { withSelectionColumns } from "@sanipatitas/ui/components/ui/data-column"
import { DataTable } from "@sanipatitas/ui/components/ui/data-table"
import type { RowAction } from "@sanipatitas/ui/components/ui/data-table-row-actions"
import { DataTableRowActions } from "@sanipatitas/ui/components/ui/data-table-row-actions"
import { useState } from "react"
import { TbEye, TbPencil, TbTrash } from "react-icons/tb"

// Columns
const baseColumns = withSelectionColumns<OpenapiSpeciesDto>([
  {
    accessorKey: "name",
    meta: {
      label: "Nombre",
    },
  },
  {
    accessorKey: "description",
    meta: {
      label: "Descripción",
    },
  },
])

// Component
export function SpeciesTable() {
  const speciesQueryState = useSpecies()

  const species = speciesQueryState.data?.data ?? []
  const speciesPageCount = speciesQueryState.data?.totalPages

  // Action state
  const [viewingSpecies, setViewingSpecies] =
    useState<OpenapiSpeciesDto | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editingSpecies, setEditingSpecies] =
    useState<OpenapiSpeciesDto | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deletingSpecies, setDeletingSpecies] =
    useState<OpenapiSpeciesDto | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Actions
  const actions: RowAction<OpenapiSpeciesDto>[] = [
    {
      label: "Ver detalles",
      icon: TbEye,
      onClick: (species) => {
        setViewingSpecies(species)
        setDetailsOpen(true)
      },
    },
    {
      label: "Editar",
      icon: TbPencil,
      onClick: (species) => {
        setEditingSpecies(species)
        setEditOpen(true)
      },
    },
    {
      label: "Eliminar",
      icon: TbTrash,
      variant: "destructive",
      onClick: (species) => {
        setDeletingSpecies(species)
        setDeleteOpen(true)
      },
    },
  ]

  return (
    <>
      <DataTable
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
        pageCount={speciesPageCount}
        searchRender={({ table }) => (
          <>
            <SearchSpeciesForm table={table} />
            <CreateSpecies />
          </>
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

      <DeleteSpecies
        species={deletingSpecies}
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open)
          if (!open) setDeletingSpecies(null)
        }}
      />
    </>
  )
}
