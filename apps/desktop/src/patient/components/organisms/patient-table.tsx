import { CreatePatient } from "@sanipatitas/desktop/patient/components/organisms/create-patient"
import { DeletePatientAlert } from "@sanipatitas/desktop/patient/components/organisms/delete-patient"
import { PatientDetailsSheet } from "@sanipatitas/desktop/patient/components/organisms/patient-details-sheet"
import { SearchPatientForm } from "@sanipatitas/desktop/patient/components/organisms/search-patient-form"
import { UpdatePatient } from "@sanipatitas/desktop/patient/components/organisms/update-patient"
import { usePatient } from "@sanipatitas/desktop/patient/hook/use-patient"
import { $patientQuery } from "@sanipatitas/desktop/patient/store/patient-query-store"
import { getApiPatientByIdOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import type { OpenapiPatientDto } from "@sanipatitas/shared/api/client/types.gen"
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
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { TbEye, TbPencil, TbTrash } from "react-icons/tb"

const GENDER_LABELS: Record<string, string> = {
  MALE: "Macho",
  FEMALE: "Hembra",
  UNKNOWN: "Desconocido",
}

// Columns
const baseColumns = withSelectionColumns<OpenapiPatientDto>([
  {
    accessorKey: "name",
    meta: { label: "Nombre" },
  },
  {
    accessorKey: "gender",
    meta: { label: "Sexo" },
    cell: ({ getValue }) => {
      const gender = getValue<string | undefined>()
      return gender ? (GENDER_LABELS[gender] ?? gender) : "—"
    },
  },
  {
    accessorKey: "breed.name",
    meta: { label: "Raza" },
  },
  {
    accessorFn: (row) => `${row.client.firstName} ${row.client.lastName}`,
    id: "clientName",
    meta: { label: "Dueño" },
  },
  {
    accessorKey: "birthDate",
    meta: { label: "F. nacimiento" },
  },
])

// Component
export function PatientTable() {
  const patientQueryState = usePatient()

  const patients = patientQueryState.data?.data ?? []
  const patientPageCount = patientQueryState.data?.totalPages

  // Router
  const router = useRouter()

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
  const [viewingPatient, setViewingPatient] =
    useState<OpenapiPatientDto | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editingPatient, setEditingPatient] =
    useState<OpenapiPatientDto | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<OpenapiPatientDto[]>([])
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Deep link
  const deepLinkHandled = useRef(false)

  const deepLinkId = deepLinkHandled.current
    ? null
    : new URLSearchParams(router.latestLocation.searchStr).get("id")

  const deepLinkPatientQuery = useQuery({
    ...getApiPatientByIdOptions({ path: { id: deepLinkId! } }),
    enabled: !!deepLinkId,
  })

  useEffect(() => {
    if (!deepLinkPatientQuery.data?.data || deepLinkHandled.current) return

    setViewingPatient(deepLinkPatientQuery.data.data)
    setDetailsOpen(true)
    deepLinkHandled.current = true
    router.navigate({ to: "/patient", replace: true })
  }, [deepLinkPatientQuery.data, router])

  useEffect(() => {
    if (!deepLinkPatientQuery.isError || deepLinkHandled.current) return

    deepLinkHandled.current = true
    router.navigate({ to: "/patient", replace: true })
  }, [deepLinkPatientQuery.isError, router])

  const selectedCount = Object.keys(selectedRowIds).length

  // Actions
  const actions: RowAction<OpenapiPatientDto>[] = [
    {
      label: "Ver detalles",
      icon: TbEye,
      onClick: (s) => {
        setViewingPatient(s)
        setDetailsOpen(true)
      },
    },
    {
      label: "Editar",
      icon: TbPencil,
      onClick: (s) => {
        setEditingPatient(s)
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
    const selected = patients.filter((_, i) => selectedRowIds[i.toString()])

    if (selected.length > 0) {
      setDeleteTarget(selected)
      setDeleteOpen(true)
    }
  }, [patients, selectedRowIds])

  // Clear selection after delete
  const handleDeleteSuccess = useCallback(() => {
    setSelectedRowIds({})
    setTableKey((k) => k + 1)
  }, [])

  return (
    <>
      <DataTable
        key={tableKey}
        id="patient-table"
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
        data={patients}
        loading={patientQueryState.isLoading}
        initialState={{
          pagination: {
            pageIndex: $patientQuery.get().page,
            pageSize: $patientQuery.get().size,
          },
        }}
        onPaginationChange={(pagination) => {
          $patientQuery.set({
            ...$patientQuery.get(),
            page: pagination.pageIndex,
            size: pagination.pageSize,
          })
        }}
        onRowSelectionChange={setSelectedRowIds}
        pageCount={patientPageCount}
        searchRender={({ table }) => (
          <>
            <SearchPatientForm table={table} />
            <CreatePatient />
          </>
        )}
        selectionActionsRender={() => (
          <ActionBar open={actionBarOpen} onOpenChange={setActionBarOpen}>
            <ActionBarSelection>
              {selectedCount} seleccionado
              {selectedCount !== 1 ? "s" : ""}
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

      <PatientDetailsSheet
        patient={viewingPatient}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setViewingPatient(null)
        }}
      />

      <UpdatePatient
        patient={editingPatient}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingPatient(null)
        }}
      />

      <DeletePatientAlert
        patients={deleteTarget}
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
