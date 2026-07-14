import { dashboardApi, type AppointmentStatsDto, type BillingStatsDto, type InventoryStatsDto, type PatientStatsDto } from "@sanipatitas/desktop/dashboard/api/dashboard-api"
import { Badge } from "@sanipatitas/ui/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@sanipatitas/ui/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@sanipatitas/ui/components/ui/chart"
import { Skeleton } from "@sanipatitas/ui/components/ui/skeleton"
import { H2, Muted, Small } from "@sanipatitas/ui/components/ui/typography"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "motion/react"
import { useMemo } from "react"
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"
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
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  NO_SHOW: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
}

// Type-safe chart config helper
const cfg = <T extends Record<string, { label: string; color: string }>>(c: T): T & Record<string, { label: string; color: string }> => c as never

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
  facturas: { label: "Facturas", color: "#F59E0B" },
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
      className="flex-1 min-w-[180px]"
    >
      <Card size="sm" className={`relative overflow-hidden border ${colorMap[color]}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[color]} opacity-50`} />
        <CardHeader className="flex flex-row items-center justify-between gap-2 relative z-10">
          <CardTitle className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            {label}
          </CardTitle>
          <Icon className={`${iconColorMap[color]} size-5 shrink-0`} />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline gap-2">
            <p className="text-foreground text-3xl font-bold tabular-nums">{value}</p>
          </div>
          {subtitle && <p className="text-muted-foreground mt-1 text-xs">{subtitle}</p>}
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
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TbCalendarStats className="text-primary size-4" />
            Citas hoy por estado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
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
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
              </PieChart>
            </ChartContainer>
            <div className="flex flex-1 flex-col gap-2">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-sm">{appointmentChartConfig[item.name]?.label ?? item.name}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Monthly comparison bar chart using shadcn
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
    { metric: "pacientes", value: patientsThisMonth, fill: monthlyChartConfig.pacientes.color },
    { metric: "citas", value: appointmentsThisMonth, fill: monthlyChartConfig.citas.color },
    { metric: "facturas", value: Math.round(revenueThisMonth / 100), fill: monthlyChartConfig.facturas.color },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex-1 min-w-0"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TbTrendingUp className="text-primary size-4" />
            Resumen del mes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={monthlyChartConfig}
            initialDimension={{ width: 300, height: 192 }}
            className="aspect-[3/2] w-full"
          >
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <XAxis
                dataKey="metric"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(key: string) => monthlyChartConfig[key]?.label ?? key}
              />
              <YAxis hide />
              <ChartTooltip
                cursor={{ fill: "var(--color-border)", opacity: 0.3 }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} animationBegin={500} animationDuration={1200}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
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
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-muted-foreground py-8 text-center text-sm"
      >
        No hay próximas citas programadas
      </motion.p>
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
            className="flex items-center justify-between gap-4 px-(--card-spacing) py-3 hover:bg-accent/50 transition-colors"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{appt.patient.name}</span>
                <span className="text-muted-foreground text-xs">
                  {formatDate(appt.date)} {formatTime(appt.startTime)}
                </span>
              </div>
              {appt.reason && (
                <span className="text-muted-foreground truncate text-xs">{appt.reason}</span>
              )}
              <span className="text-muted-foreground text-xs">
                {appt.veterinarian.name} {appt.veterinarian.lastName ?? ""}
              </span>
            </div>
            <Badge className={statusColors[appt.status] ?? "bg-gray-100 text-gray-800"}>
              {statusLabels[appt.status] ?? appt.status}
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Revenue area chart (last 7 days - simulated from available data)
function RevenueAreaChart({ revenueToday, revenueThisMonth }: { revenueToday: number; revenueThisMonth: number }) {
  // Generate sample daily data based on actual monthly revenue
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const dayOfMonth = new Date().getDate()
  const avgDaily = revenueThisMonth / dayOfMonth

  const data = Array.from({ length: 7 }, (_, i) => {
    const day = dayOfMonth - 6 + i
    const variation = 0.7 + Math.random() * 0.6 // 70%-130% of average
    return {
      day: `${day}`,
      ingresos: Math.round(avgDaily * variation),
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="flex-1 min-w-[250px]"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TbCash className="text-primary size-4" />
            Ingresos (últimos 7 días)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={revenueChartConfig}
            initialDimension={{ width: 300, height: 160 }}
            className="aspect-[3/1.6] w-full"
          >
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [formatCurrency(Number(value)), "Ingresos"]}
                    indicator="dot"
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="ingresos"
                stroke="var(--color-ingresos)"
                fill="var(--color-ingresos)"
                fillOpacity={0.15}
                strokeWidth={2}
                animationBegin={600}
                animationDuration={1000}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
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
        <TbPackage className="size-5 text-emerald-500 shrink-0" />
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
      <TbAlertTriangle className="size-5 animate-pulse text-red-500 shrink-0" />
      <p className="text-sm font-medium text-red-700 dark:text-red-300">
        <strong className="tabular-nums">{lowStockCount}</strong> producto{lowStockCount !== 1 ? "s" : ""} con stock bajo — revisar inventario
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
              <Small className="text-muted-foreground uppercase tracking-wider">Productos</Small>
              <p className="text-2xl font-bold tabular-nums">{stats.totalProducts}</p>
            </div>
            <div className="flex flex-col">
              <Small className="text-muted-foreground uppercase tracking-wider">Categorías</Small>
              <p className="text-2xl font-bold tabular-nums">{stats.totalCategories}</p>
            </div>
            <div className="flex flex-col">
              <Small className="text-muted-foreground uppercase tracking-wider">Stock total</Small>
              <p className="text-2xl font-bold tabular-nums">{stats.totalStockQuantity}</p>
            </div>
            <div className="flex flex-col">
              <Small className="text-muted-foreground uppercase tracking-wider">Valor stock</Small>
              <p className="text-2xl font-bold tabular-nums">{formatCurrency(stats.totalStockValue)}</p>
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
              <Small className="text-muted-foreground uppercase tracking-wider">Facturas hoy</Small>
              <p className="text-2xl font-bold tabular-nums">{stats.billingToday}</p>
            </div>
            <div className="flex flex-col">
              <Small className="text-muted-foreground uppercase tracking-wider">Ingresos hoy</Small>
              <p className="text-2xl font-bold tabular-nums text-emerald-500">
                {formatCurrency(stats.totalRevenueToday)}
              </p>
            </div>
            <div className="flex flex-col">
              <Small className="text-muted-foreground uppercase tracking-wider">Ingresos del mes</Small>
              <p className="text-2xl font-bold tabular-nums text-emerald-500">
                {formatCurrency(stats.totalRevenueThisMonth)}
              </p>
            </div>
            <div className="flex flex-col">
              <Small className="text-muted-foreground uppercase tracking-wider">Pendientes</Small>
              <p className="text-2xl font-bold tabular-nums text-amber-500">{stats.totalPending}</p>
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
        <Skeleton className="h-56 flex-[2] min-w-[300px] rounded-xl" />
        <Skeleton className="h-56 flex-1 min-w-[250px] rounded-xl" />
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
              <span className="bg-green-500 size-2 animate-pulse rounded-full" />
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
              value={billingStats ? formatCurrency(billingStats.totalRevenueToday) : "—"}
              subtitle="Facturado el día de hoy"
              color="green"
              delay={0.25}
            />
          </div>

          {/* Charts row */}
          <div className="flex flex-wrap gap-4">
            {appointmentStats &&
              Object.keys(appointmentStats.appointmentsTodayByStatus).length > 0 && (
                <div className="flex-[2] min-w-[300px]">
                  <AppointmentStatusChart data={appointmentStats.appointmentsTodayByStatus} />
                </div>
              )}
            <div className="flex-1 min-w-[250px]">
              <MonthlyComparisonChart
                patientsThisMonth={patientStats?.patientsCreatedThisMonth ?? 0}
                appointmentsThisMonth={appointmentStats?.appointmentsThisMonth ?? 0}
                revenueThisMonth={billingStats?.totalRevenueThisMonth ?? 0}
              />
            </div>
          </div>

          {/* Upcoming appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TbCalendar className="text-primary size-4" />
                  Próximas citas
                  <Badge variant="secondary" className="ml-auto">
                    {appointmentStats?.upcomingAppointments.length ?? 0} pendientes
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0!">
                <UpcomingAppointments appointments={appointmentStats?.upcomingAppointments ?? []} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Inventory + Billing */}
          <div className="flex flex-wrap gap-4">
            {inventoryStats && (
              <div className="flex-1 min-w-[300px]">
                <InventorySummary stats={inventoryStats} />
              </div>
            )}
            {billingStats && (
              <div className="flex-1 min-w-[300px]">
                <BillingSummary stats={billingStats} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
