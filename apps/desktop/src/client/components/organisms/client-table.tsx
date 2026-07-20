import { ClientDetailsSheet } from "@sanipatitas/desktop/client/components/organisms/client-details-sheet"
import { CreateClient } from "@sanipatitas/desktop/client/components/organisms/create-client"
import { DeleteClientAlert } from "@sanipatitas/desktop/client/components/organisms/delete-client"
import { SearchClientForm } from "@sanipatitas/desktop/client/components/organisms/search-client-form"
import { UpdateClient } from "@sanipatitas/desktop/client/components/organisms/update-client"
import { useClient } from "@sanipatitas/desktop/client/hook/use-client"
import { $clientQuery } from "@sanipatitas/desktop/client/store/client-query-store"
import type { OpenapiClientDto } from "@sanipatitas/shared/api/client/types.gen"
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
const baseColumns = withSelectionColumns<OpenapiClientDto>([
  {
    accessorKey: "firstName",
    meta: { label: "Nombres" },
  },
  {
    accessorKey: "lastName",
    meta: { label: "Apellidos" },
  },
  {
    accessorKey: "idType",
    meta: { label: "Tipo doc." },
  },
  {
    accessorKey: "idNumber",
    meta: { label: "N° documento" },
  },
  {
    accessorKey: "phone",
    meta: { label: "Teléfono" },
  },
])

// Component
export function ClientTable() {
  const clientQueryState = useClient()

  const clients = clientQueryState.data?.data ?? []
  const clientPageCount = clientQueryState.data?.totalPages

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
  const [viewingClient, setViewingClient] = useState<OpenapiClientDto | null>(
    null
  )
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<OpenapiClientDto | null>(
    null
  )
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<OpenapiClientDto[]>([])
  const [deleteOpen, setDeleteOpen] = useState(false)

  const selectedCount = Object.keys(selectedRowIds).length

  // Actions
  const actions: RowAction<OpenapiClientDto>[] = [
    {
      label: "Ver detalles",
      icon: TbEye,
      onClick: (s) => {
        setViewingClient(s)
        setDetailsOpen(true)
      },
    },
    {
      label: "Editar",
      icon: TbPencil,
      onClick: (s) => {
        setEditingClient(s)
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
    const selected = clients.filter((_, i) => selectedRowIds[i.toString()])

    if (selected.length > 0) {
      setDeleteTarget(selected)
      setDeleteOpen(true)
    }
  }, [clients, selectedRowIds])

  // Clear selection after delete
  const handleDeleteSuccess = useCallback(() => {
    setSelectedRowIds({})
    setTableKey((k) => k + 1)
  }, [])

  return (
    <>
      <DataTable
        key={tableKey}
        id="client-table"
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
        data={clients}
        loading={clientQueryState.isLoading}
        initialState={{
          pagination: {
            pageIndex: $clientQuery.get().page,
            pageSize: $clientQuery.get().size,
          },
        }}
        onPaginationChange={(pagination) => {
          $clientQuery.set({
            ...$clientQuery.get(),
            page: pagination.pageIndex,
            size: pagination.pageSize,
          })
        }}
        onRowSelectionChange={setSelectedRowIds}
        pageCount={clientPageCount}
        searchRender={({ table }) => (
          <>
            <SearchClientForm table={table} />
            <CreateClient />
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

      <ClientDetailsSheet
        client={viewingClient}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setViewingClient(null)
        }}
      />

      <UpdateClient
        client={editingClient}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingClient(null)
        }}
      />

      <DeleteClientAlert
        clients={deleteTarget}
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
