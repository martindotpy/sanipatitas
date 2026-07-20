import {
  dashboardApi,
  type AppointmentStatsDto,
  type BillingStatsDto,
  type InventoryStatsDto,
} from "@sanipatitas/desktop/dashboard/api/dashboard-api"
import { Badge } from "@sanipatitas/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@sanipatitas/ui/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@sanipatitas/ui/components/ui/chart"
import { Skeleton } from "@sanipatitas/ui/components/ui/skeleton"
import { H2, Muted, Small } from "@sanipatitas/ui/components/ui/typography"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "motion/react"
import { useMemo } from "react"
import {
  TbActivity,
  TbAlertTriangle,
  TbCalendar,
  TbCalendarStats,
  TbCash,
  TbClipboardList,
  TbCoin,
  TbPackage,
  TbPaw,
  TbTrendingUp,
  TbUsers,
} from "react-icons/tb"
import { Area, AreaChart, Pie, PieChart, XAxis, YAxis } from "recharts"

// Status labels & colors
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

// Type-safe chart config helper
const cfg = <T extends Record<string, { label: string; color: string }>>(
  c: T
): T & Record<string, { label: string; color: string }> => c as never

// Shadcn chart config for appointment status (pie)
const appointmentChartConfig = cfg({
  SCHEDULED: { label: "Programada", color: "#3B82F6" },
  IN_PROGRESS: { label: "En progreso", color: "#F59E0B" },
  COMPLETED: { label: "Completada", color: "#10B981" },
  CANCELLED: { label: "Cancelada", color: "#EF4444" },
  NO_SHOW: { label: "No asistió", color: "#6B7280" },
}) satisfies ChartConfig

// Shadcn chart config for monthly comparison (bar)
const monthlyChartConfig = cfg({
  pacientes: { label: "Pacientes", color: "#3B82F6" },
  citas: { label: "Citas", color: "#10B981" },
  facturas: { label: "Ingresos", color: "#F59E0B" },
}) satisfies ChartConfig

// Shadcn chart config for revenue area chart
const revenueChartConfig = cfg({
  ingresos: { label: "Ingresos", color: "#10B981" },
}) satisfies ChartConfig

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value)
}

// Animated stat card
function AnimatedStatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color = "primary",
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number | string
  subtitle?: string
  color?: "primary" | "blue" | "green" | "amber" | "red" | "purple"
  delay?: number
}) {
  const colorMap = {
    primary: "from-primary/20 to-primary/5 border-primary/20",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20",
    green: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20",
    red: "from-red-500/20 to-red-500/5 border-red-500/20",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20",
  }

  const iconColorMap = {
    primary: "text-primary",
    blue: "text-blue-500",
    green: "text-emerald-500",
    amber: "text-amber-500",
    red: "text-red-500",
    purple: "text-purple-500",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="min-w-[180px] flex-1"
    >
      <Card
        size="sm"
        className={`relative overflow-hidden border ${colorMap[color]}`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colorMap[color]} opacity-50`}
        />
        <CardHeader className="relative z-10 flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            {label}
          </CardTitle>
          <Icon className={`${iconColorMap[color]} size-5 shrink-0`} />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline gap-2">
            <p className="text-foreground text-3xl font-bold tabular-nums">
              {value}
            </p>
          </div>
          {subtitle && (
            <p className="text-muted-foreground mt-1 text-xs">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Appointment status chart (Pie) using shadcn
function AppointmentStatusChart({ data }: { data: Record<string, number> }) {
  const chartData = useMemo(() => {
    return Object.entries(data)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        name: status,
        value: count,
        fill: appointmentChartConfig[status]?.color ?? "#6B7280",
      }))
  }, [data])

  if (chartData.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="h-full"
    >
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TbCalendarStats className="text-primary size-4" />
            Citas hoy por estado
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
            <ChartContainer
              config={appointmentChartConfig}
              initialDimension={{ width: 192, height: 192 }}
              className="mx-auto aspect-square w-48 shrink-0"
            >
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={300}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                </Pie>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
              </PieChart>
            </ChartContainer>
            <div className="flex w-full max-w-55 flex-col gap-2">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm">
                      {appointmentChartConfig[item.name]?.label ?? item.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold tabular-nums">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Monthly comparison bars
function MonthlyComparisonChart({
  patientsThisMonth,
  appointmentsThisMonth,
  revenueThisMonth,
}: {
  patientsThisMonth: number
  appointmentsThisMonth: number
  revenueThisMonth: number
}) {
  const data = [
    {
      key: "pacientes",
      label: monthlyChartConfig.pacientes.label,
      value: patientsThisMonth,
      display: String(patientsThisMonth),
      color: monthlyChartConfig.pacientes.color,
    },
    {
      key: "citas",
      label: monthlyChartConfig.citas.label,
      value: appointmentsThisMonth,
      display: String(appointmentsThisMonth),
      color: monthlyChartConfig.citas.color,
    },
    {
      key: "facturas",
      label: monthlyChartConfig.facturas.label,
      value: revenueThisMonth,
      display: formatCurrency(revenueThisMonth),
      color: monthlyChartConfig.facturas.color,
    },
  ]

  const maxValue = Math.max(...data.map((item) => item.value), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="min-w-0 flex-1"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TbTrendingUp className="text-primary size-4" />
            Resumen del mes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-52 items-end gap-4 px-1">
            {data.map((item) => {
              const heightPercent = Math.max(
                (item.value / maxValue) * 100,
                item.value > 0 ? 8 : 0
              )

              return (
                <div
                  key={item.key}
                  className="flex min-w-0 flex-1 flex-col items-center gap-2"
                >
                  <span className="text-foreground text-center text-sm font-bold tabular-nums">
                    {item.display}
                  </span>
                  <div className="bg-muted/60 flex h-40 w-full items-end overflow-hidden rounded-lg">
                    <div
                      className="w-full rounded-lg transition-[height] duration-500 ease-out motion-reduce:transition-none"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {item.label}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Upcoming appointments
function UpcomingAppointments({
  appointments,
}: {
  appointments: AppointmentStatsDto["upcomingAppointments"]
}) {
  if (appointments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-10 text-center"
      >
        <TbCalendar className="size-8 opacity-40" />
        <p className="text-sm">No hay próximas citas programadas</p>
      </motion.div>
    )
  }

  return (
    <div className="divide-border divide-y">
      <AnimatePresence>
        {appointments.map((appt, i) => (
          <motion.div
            key={appt.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="hover:bg-accent/50 flex items-center justify-between gap-4 px-(--card-spacing) py-3 transition-colors"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{appt.patient.name}</span>
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
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Low stock alerts
function LowStockAlert({ lowStockCount }: { lowStockCount: number }) {
  if (lowStockCount === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/30 dark:bg-emerald-950/20"
      >
        <TbPackage className="size-5 shrink-0 text-emerald-500" />
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          Inventario saludable — todos los productos tienen stock suficiente
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: -10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ delay: 0.4, type: "spring" }}
      className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/30 dark:bg-red-950/20"
    >
      <TbAlertTriangle className="size-5 shrink-0 animate-pulse text-red-500" />
      <p className="text-sm font-medium text-red-700 dark:text-red-300">
        <strong className="tabular-nums">{lowStockCount}</strong> producto
        {lowStockCount !== 1 ? "s" : ""} con stock bajo — revisar inventario
      </p>
    </motion.div>
  )
}

// Inventory summary
function InventorySummary({ stats }: { stats: InventoryStatsDto }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TbPackage className="text-primary size-4" />
            Inventario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col">
              <Small className="text-muted-foreground tracking-wider uppercase">
                Productos
              </Small>
              <p className="text-2xl font-bold tabular-nums">
                {stats.totalProducts}
              </p>
            </div>
            <div className="flex flex-col">
              <Small className="text-muted-foreground tracking-wider uppercase">
                Categorías
              </Small>
              <p className="text-2xl font-bold tabular-nums">
                {stats.totalCategories}
              </p>
            </div>
            <div className="flex flex-col">
              <Small className="text-muted-foreground tracking-wider uppercase">
                Stock total
              </Small>
              <p className="text-2xl font-bold tabular-nums">
                {stats.totalStockQuantity}
              </p>
            </div>
            <div className="flex flex-col">
              <Small className="text-muted-foreground tracking-wider uppercase">
                Valor stock
              </Small>
              <p className="text-2xl font-bold tabular-nums">
                {formatCurrency(stats.totalStockValue)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <LowStockAlert lowStockCount={stats.lowStockCount} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Billing summary
function BillingSummary({ stats }: { stats: BillingStatsDto }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TbCoin className="text-primary size-4" />
            Facturación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col">
              <Small className="text-muted-foreground tracking-wider uppercase">
                Facturas hoy
              </Small>
              <p className="text-2xl font-bold tabular-nums">
                {stats.billingToday}
              </p>
            </div>
            <div className="flex flex-col">
              <Small className="text-muted-foreground tracking-wider uppercase">
                Ingresos hoy
              </Small>
              <p className="text-2xl font-bold text-emerald-500 tabular-nums">
                {formatCurrency(stats.totalRevenueToday)}
              </p>
            </div>
            <div className="flex flex-col">
              <Small className="text-muted-foreground tracking-wider uppercase">
                Ingresos del mes
              </Small>
              <p className="text-2xl font-bold text-emerald-500 tabular-nums">
                {formatCurrency(stats.totalRevenueThisMonth)}
              </p>
            </div>
            <div className="flex flex-col">
              <Small className="text-muted-foreground tracking-wider uppercase">
                Pendientes
              </Small>
              <p className="text-2xl font-bold text-amber-500 tabular-nums">
                {stats.totalPending}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Loading skeleton
function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 min-w-[180px] flex-1 rounded-xl" />
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        <Skeleton className="h-56 min-w-[300px] flex-[2] rounded-xl" />
        <Skeleton className="h-56 min-w-[250px] flex-1 rounded-xl" />
      </div>
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
    </div>
  )
}

// Main dashboard section
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

  const inventoryStatsQuery = useQuery({
    queryKey: ["dashboard", "inventory-stats"],
    queryFn: dashboardApi.inventoryStats,
    refetchInterval: 60_000,
  })

  const billingStatsQuery = useQuery({
    queryKey: ["dashboard", "billing-stats"],
    queryFn: dashboardApi.billingStats,
    refetchInterval: 60_000,
  })

  const patientStats = patientStatsQuery.data
  const appointmentStats = appointmentStatsQuery.data
  const inventoryStats = inventoryStatsQuery.data
  const billingStats = billingStatsQuery.data

  const isLoading =
    patientStatsQuery.isLoading || appointmentStatsQuery.isLoading

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col gap-0 p-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-4 pb-2"
      >
        <div className="flex items-center justify-between">
          <div>
            <H2 className="flex items-center gap-2">
              Dashboard
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
                className="inline-block"
              >
                <TbActivity className="text-primary size-6" />
              </motion.span>
            </H2>
            <Muted>Resumen general de la clínica veterinaria</Muted>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Badge variant="outline" className="gap-1.5">
              <span className="size-2 animate-pulse rounded-full bg-green-500" />
              En vivo
            </Badge>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="flex flex-col gap-6 overflow-auto px-4 pb-8">
          {/* Stats cards row */}
          <div className="flex flex-wrap gap-4">
            <AnimatedStatCard
              icon={TbPaw}
              label="Total pacientes"
              value={patientStats?.totalPatients ?? 0}
              subtitle="Registrados en el sistema"
              color="blue"
              delay={0}
            />
            <AnimatedStatCard
              icon={TbCalendar}
              label="Pacientes hoy"
              value={patientStats?.patientsCreatedToday ?? 0}
              subtitle="Registrados el día de hoy"
              color="green"
              delay={0.05}
            />
            <AnimatedStatCard
              icon={TbCalendarStats}
              label="Pacientes del mes"
              value={patientStats?.patientsCreatedThisMonth ?? 0}
              subtitle="Registrados este mes"
              color="primary"
              delay={0.1}
            />
            <AnimatedStatCard
              icon={TbUsers}
              label="Total clientes"
              value={patientStats?.totalClients ?? 0}
              subtitle="Tutores registrados"
              color="purple"
              delay={0.15}
            />
            <AnimatedStatCard
              icon={TbClipboardList}
              label="Citas hoy"
              value={appointmentStats?.appointmentsToday ?? 0}
              subtitle="Programadas para hoy"
              color="amber"
              delay={0.2}
            />
            <AnimatedStatCard
              icon={TbCash}
              label="Ingresos hoy"
              value={
                billingStats
                  ? formatCurrency(billingStats.totalRevenueToday)
                  : "—"
              }
              subtitle="Facturado el día de hoy"
              color="green"
              delay={0.25}
            />
          </div>

          {/* Charts row */}
          <div className="flex flex-wrap gap-4">
            {appointmentStats &&
              Object.keys(appointmentStats.appointmentsTodayByStatus).length >
                0 && (
                <div className="min-w-75 flex-1">
                  <AppointmentStatusChart
                    data={appointmentStats.appointmentsTodayByStatus}
                  />
                </div>
              )}
            <div className="min-w-[250px] flex-1">
              <MonthlyComparisonChart
                patientsThisMonth={patientStats?.patientsCreatedThisMonth ?? 0}
                appointmentsThisMonth={
                  appointmentStats?.appointmentsThisMonth ?? 0
                }
                revenueThisMonth={billingStats?.totalRevenueThisMonth ?? 0}
              />
            </div>

            {/* Upcoming appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="min-w-70 flex-1"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TbCalendar className="text-primary size-4" />
                    Próximas citas
                    <Badge variant="secondary" className="ml-auto">
                      {appointmentStats?.upcomingAppointments.length ?? 0}{" "}
                      pendientes
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-64 overflow-y-auto p-0!">
                  <UpcomingAppointments
                    appointments={appointmentStats?.upcomingAppointments ?? []}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Inventory + Billing */}
          <div className="flex flex-wrap gap-4">
            {inventoryStats && (
              <div className="min-w-[300px] flex-1">
                <InventorySummary stats={inventoryStats} />
              </div>
            )}
            {billingStats && (
              <div className="min-w-[300px] flex-1">
                <BillingSummary stats={billingStats} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
