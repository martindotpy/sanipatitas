import { AppointmentDetailsSheet } from "@sanipatitas/desktop/appointment/components/organisms/appointment-details-sheet"
import { CreateAppointment } from "@sanipatitas/desktop/appointment/components/organisms/create-appointment"
import { DeleteAppointmentAlert } from "@sanipatitas/desktop/appointment/components/organisms/delete-appointment"
import { UpdateAppointment } from "@sanipatitas/desktop/appointment/components/organisms/update-appointment"
import { useAppointment } from "@sanipatitas/desktop/appointment/hook/use-appointment"
import { $appointmentQuery } from "@sanipatitas/desktop/appointment/store/appointment-query-store"
import type { OpenapiAppointmentDto } from "@sanipatitas/shared/api/client/types.gen"
import type { Feature, Status } from "@sanipatitas/ui/components/ui/calendar"
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
  useCalendarMonth,
  useCalendarYear,
} from "@sanipatitas/ui/components/ui/calendar"
import { useEffect, useMemo, useState } from "react"

// Constants
const STATUS_MAP: Record<string, Status> = {
  SCHEDULED: { id: "SCHEDULED", name: "Programada", color: "#3B82F6" },
  IN_PROGRESS: { id: "IN_PROGRESS", name: "En curso", color: "#F59E0B" },
  COMPLETED: { id: "COMPLETED", name: "Completada", color: "#10B981" },
  CANCELLED: { id: "CANCELLED", name: "Cancelada", color: "#6B7280" },
  NO_SHOW: { id: "NO_SHOW", name: "No asistió", color: "#EF4444" },
} as const

// Helpers
function getMonthDateRange(year: number, month: number) {
  const from = new Date(year, month, 1)
  const to = new Date(year, month + 1, 0)

  const fmt = (d: Date) => d.toISOString().slice(0, 10)

  return { from: fmt(from), to: fmt(to) }
}

function appointmentToFeature(a: OpenapiAppointmentDto): Feature {
  return {
    id: a.id,
    startAt: new Date(`${a.date}T${a.startTime}`),
    endAt: new Date(`${a.date}T${a.endTime ?? a.startTime}`),
    name: `${a.patient.name}${a.reason ? ` — ${a.reason}` : ""}`,
    status: (STATUS_MAP[a.status] ?? STATUS_MAP.SCHEDULED) as Status,
  }
}

// Component
export function AppointmentCalendarView() {
  const [month] = useCalendarMonth()
  const [year] = useCalendarYear()

  const appointmentQuery = useAppointment()

  const [viewingAppointment, setViewingAppointment] =
    useState<OpenapiAppointmentDto | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] =
    useState<OpenapiAppointmentDto | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<OpenapiAppointmentDto[]>([])
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Sync date range with current month
  useEffect(() => {
    const { from, to } = getMonthDateRange(year, month)
    $appointmentQuery.set({ from, to })
  }, [month, year])

  // Map appointments to calendar features
  const features = useMemo(
    () => (appointmentQuery.data?.data ?? []).map(appointmentToFeature),
    [appointmentQuery.data]
  )

  // Click handlers
  const handleFeatureClick = (feature: Feature) => {
    const appointment = (appointmentQuery.data?.data ?? []).find(
      (a) => a.id === feature.id
    )
    if (appointment) {
      setViewingAppointment(appointment)
      setDetailsOpen(true)
    }
  }

  const handleEdit = (appointment: OpenapiAppointmentDto) => {
    setDetailsOpen(false)
    setEditingAppointment(appointment)
    setEditOpen(true)
  }

  const handleDelete = (appointment: OpenapiAppointmentDto) => {
    setDetailsOpen(false)
    setDeleteTarget([appointment])
    setDeleteOpen(true)
  }

  return (
    <>
      <CalendarProvider
        locale="es-ES"
        className="flex h-full w-full flex-col rounded-lg border"
      >
        <CalendarDate>
          <CalendarDatePicker>
            <CalendarMonthPicker />
            <CalendarYearPicker start={2020} end={2035} />
          </CalendarDatePicker>
          <div className="flex items-center gap-2">
            <CreateAppointment />
            <CalendarDatePagination />
          </div>
        </CalendarDate>
        <CalendarHeader />
        <CalendarBody features={features}>
          {({ feature }) => (
            <button
              className="hover:bg-accent w-full rounded px-1 py-0.5 text-left transition-colors"
              key={feature.id}
              onClick={() => handleFeatureClick(feature)}
              type="button"
            >
              <CalendarItem feature={feature} />
            </button>
          )}
        </CalendarBody>
      </CalendarProvider>

      <AppointmentDetailsSheet
        appointment={viewingAppointment}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setViewingAppointment(null)
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <UpdateAppointment
        appointment={editingAppointment}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingAppointment(null)
        }}
      />

      <DeleteAppointmentAlert
        appointments={deleteTarget}
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open)
          if (!open) setDeleteTarget([])
        }}
      />
    </>
  )
}
