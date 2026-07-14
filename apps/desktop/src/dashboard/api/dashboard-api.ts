// Types
export interface PatientStatsDto {
  totalPatients: number
  patientsCreatedToday: number
  patientsCreatedThisMonth: number
  totalClients: number
}

interface AppointmentStatsDto {
  appointmentsToday: number
  appointmentsTodayByStatus: Record<string, number>
  appointmentsThisMonth: number
  upcomingAppointments: AppointmentSummaryDto[]
}

interface AppointmentSummaryDto {
  id: string
  date: string
  startTime: string
  endTime?: string | null
  status: string
  reason?: string | null
  patient: { id: string; name: string }
  client: { id: string; name: string }
  veterinarian: { id: string; name: string; lastName?: string }
}

interface DataResponse<T> {
  data: T
  message: string
}

// API
import { client } from "@sanipatitas/shared/api/client/client.gen"

export const dashboardApi = {
  patientStats: () =>
    client
      .get<DataResponse<PatientStatsDto>, unknown, true>({
        url: "/api/patient/stats",
        throwOnError: true,
      })
      .then((r) => r.data.data),

  appointmentStats: () =>
    client
      .get<DataResponse<AppointmentStatsDto>, unknown, true>({
        url: "/api/appointment/stats",
        throwOnError: true,
      })
      .then((r) => r.data.data),
}
