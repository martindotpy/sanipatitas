import { usePatientQuery } from "@sanipatitas/desktop/patient/store/patient-query-store"
import {
  deleteApiPatientByIdMutation,
  getApiPatientOptions,
  postApiPatientMutation,
  putApiPatientByIdMutation,
} from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"

export const usePatient = () => {
  const patientQuery = usePatientQuery()

  return useQuery({
    ...getApiPatientOptions({
      query: {
        page: patientQuery.page,
        size: patientQuery.size,
        search: patientQuery.search,
      },
    }),
    placeholderData: keepPreviousData,
  })
}

export const useCreatePatient = () =>
  useMutation({
    ...postApiPatientMutation(),
  })

export const useUpdatePatient = () =>
  useMutation({
    ...putApiPatientByIdMutation(),
  })

export const useDeletePatient = () =>
  useMutation({
    ...deleteApiPatientByIdMutation(),
  })
