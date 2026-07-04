import { useAppointmentSSE } from "@sanipatitas/desktop/appointment/components/organisms/appointment-sse"
import { $appointmentQuery } from "@sanipatitas/desktop/appointment/store/appointment-query-store"
import { getApiAppointmentOptions } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { deleteApiAppointmentByIdMutation } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { postApiAppointmentMutation } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { putApiAppointmentByIdMutation } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useStore } from "@nanostores/react"
import { useCallback } from "react"

// Hooks
export function useAppointmentQuery() {
  const queryState = useStore($appointmentQuery)

  const query = useQuery({
    ...getApiAppointmentOptions({
      query: {
        from: queryState.from || undefined,
        to: queryState.to || undefined,
        size: 200,
      },
    }),
  })

  return query
}

export function useCreateAppointment() {
  const query = useAppointmentQuery()

  const mutation = useMutation({
    ...postApiAppointmentMutation(),
    onSuccess: () => query.refetch(),
  })

  return mutation
}

export function useUpdateAppointment() {
  const query = useAppointmentQuery()

  const mutation = useMutation({
    ...putApiAppointmentByIdMutation(),
    onSuccess: () => query.refetch(),
  })

  return mutation
}

export function useDeleteAppointment() {
  const query = useAppointmentQuery()

  const mutation = useMutation({
    ...deleteApiAppointmentByIdMutation(),
    onSuccess: () => query.refetch(),
  })

  return mutation
}

export function useAppointment() {
  const createMutation = useCreateAppointment()
  const updateMutation = useUpdateAppointment()
  const deleteMutation = useDeleteAppointment()
  const query = useAppointmentQuery()

  const refetch = query.refetch

  return {
    ...query,
    createMutation,
    updateMutation,
    deleteMutation,
    refetch,
  }
}
