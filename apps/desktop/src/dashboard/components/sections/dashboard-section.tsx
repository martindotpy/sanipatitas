import { dashboardApi } from "@sanipatitas/desktop/dashboard/api/dashboard-api"
import { Badge } from "@sanipatitas/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@sanipatitas/ui/components/ui/card"
import { Skeleton } from "@sanipatitas/ui/components/ui/skeleton"
import { H2, Muted } from "@sanipatitas/ui/components/ui/typography"
import { useQuery } from "@tanstack/react-query"
import {
  TbCalendar,
  TbCalendarStats,
  TbClipboardList,
  TbPaw,
  TbUsers,
} from "react-icons/tb"

// Status labels
const statusLabels: Record<string, string> = {
  SCHEDULED: "Programada",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
}

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  IN_PROGRESS:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  COMPLETED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  NO_SHOW: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
}

// Helpers
function formatTime(time: string) {
  const [h, m] = time.split(":")
  return `${h}:${m}`
}

function formatDate(date: string) {
  const d = new Date(date + "T00:00:00")
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (d.toDateString() === today.toDateString()) return "Hoy"
  if (d.toDateString() === tomorrow.toDateString()) return "Mañana"

  return d.toLocaleDateString("es-PE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

// StatCard
function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number | string
}) {
  return (
    <Card size="sm" className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {label}
        </CardTitle>
        <Icon className="text-muted-foreground size-5 shrink-0" />
      </CardHeader>
      <CardContent>
        <p className="text-foreground text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}

// UpcomingAppointments
function UpcomingAppointments({
  appointments,
}: {
  appointments: {
    id: string
    date: string
    startTime: string
    status: string
    patient: { name: string }
    veterinarian: { name: string; lastName?: string }
    reason?: string | null
  }[]
}) {
  if (appointments.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No hay próximas citas programadas
      </p>
    )
  }

  return (
    <div className="divide-border divide-y">
      {appointments.map((appt) => (
        <div
          key={appt.id}
          className="flex items-center justify-between gap-4 px-(--card-spacing) py-3"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {appt.patient.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {formatDate(appt.date)} {formatTime(appt.startTime)}
              </span>
            </div>
            {appt.reason && (
              <span className="text-muted-foreground truncate text-xs">
                {appt.reason}
              </span>
            )}
            <span className="text-muted-foreground text-xs">
              {appt.veterinarian.name} {appt.veterinarian.lastName ?? ""}
            </span>
          </div>
          <Badge
            className={
              statusColors[appt.status] ?? "bg-gray-100 text-gray-800"
            }
          >
            {statusLabels[appt.status] ?? appt.status}
          </Badge>
        </div>
      ))}
    </div>
  )
}

// DashboardSection
export function DashboardSection() {
  const patientStatsQuery = useQuery({
    queryKey: ["dashboard", "patient-stats"],
    queryFn: dashboardApi.patientStats,
    refetchInterval: 60_000,
  })

  const appointmentStatsQuery = useQuery({
    queryKey: ["dashboard", "appointment-stats"],
    queryFn: dashboardApi.appointmentStats,
    refetchInterval: 30_000,
  })

  const patientStats = patientStatsQuery.data
  const appointmentStats = appointmentStatsQuery.data
  const isLoading =
    patientStatsQuery.isLoading || appointmentStatsQuery.isLoading

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col gap-6 p-0">
      <div className="px-4 pt-4">
        <H2>Dashboard</H2>
        <Muted>Resumen general de la clínica.</Muted>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-6 px-4 pb-4">
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 flex-1 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-4 pb-4">
          {/* Stats cards */}
          <div className="flex flex-wrap gap-4">
            <StatCard
              icon={TbPaw}
              label="Total pacientes"
              value={patientStats?.totalPatients ?? 0}
            />
            <StatCard
              icon={TbCalendar}
              label="Pacientes hoy"
              value={patientStats?.patientsCreatedToday ?? 0}
            />
            <StatCard
              icon={TbCalendarStats}
              label="Pacientes este mes"
              value={patientStats?.patientsCreatedThisMonth ?? 0}
            />
            <StatCard
              icon={TbUsers}
              label="Total clientes"
              value={patientStats?.totalClients ?? 0}
            />
            <StatCard
              icon={TbClipboardList}
              label="Citas hoy"
              value={appointmentStats?.appointmentsToday ?? 0}
            />
          </div>

          {/* Today's appointments breakdown */}
          {appointmentStats &&
            Object.keys(appointmentStats.appointmentsTodayByStatus).length >
              0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Citas hoy por estado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(
                      appointmentStats.appointmentsTodayByStatus
                    ).map(([status, count]) => (
                      <div
                        key={status}
                        className="flex items-center gap-2 rounded-lg border px-3 py-2"
                      >
                        <Badge
                          className={
                            statusColors[status] ??
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {statusLabels[status] ?? status}
                        </Badge>
                        <span className="text-sm font-bold">{count}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                      <Badge className="bg-primary/10 text-primary">
                        Total
                      </Badge>
                      <span className="text-sm font-bold">
                        {appointmentStats.appointmentsToday}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Upcoming appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas citas</CardTitle>
            </CardHeader>
            <CardContent className="p-0!">
              <UpcomingAppointments
                appointments={
                  appointmentStats?.upcomingAppointments ?? []
                }
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
