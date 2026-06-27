import { zodResolver } from "@hookform/resolvers/zod"
import { usePatient } from "@sanipatitas/desktop/patient/hook/use-patient"
import { $patientQuery } from "@sanipatitas/desktop/patient/store/patient-query-store"
import { zGetApiPatientQuery } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import { type Table } from "@tanstack/react-table"
import { useDebounce } from "ahooks"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { TbLoader2, TbSearch } from "react-icons/tb"

const zGetApiPatientSearchQuery = zGetApiPatientQuery.pick({ search: true })

interface SearchPatientFormProps<TData> {
  table?: Table<TData>
}

export function SearchPatientForm<TData>({
  table,
}: SearchPatientFormProps<TData>) {
  const patientQueryState = usePatient()

  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(zGetApiPatientSearchQuery),
    defaultValues: {
      search: "",
    },
  })

  const watchedSearch = watch("search")
  const debouncedSearch = useDebounce(watchedSearch, { wait: 300 })

  useEffect(() => {
    $patientQuery.set({
      ...$patientQuery.get(),
      search: debouncedSearch,
      page: 0,
    })
    table?.setPageIndex(0)
  }, [debouncedSearch])

  const onSubmit = handleSubmit((data) => {
    $patientQuery.set({
      ...$patientQuery.get(),
      search: data.search,
      page: 0,
    })
    table?.setPageIndex(0)
  })

  return (
    <form className="flex flex-1 items-center gap-2" onSubmit={onSubmit}>
      <ControlledInput
        control={control}
        name="search"
        inputProps={{
          placeholder: "Buscar pacientes...",
        }}
        icon={patientQueryState.isFetching ? TbLoader2 : TbSearch}
        iconProps={{
          className: cn({ "animate-spin": patientQueryState.isFetching }),
        }}
      />
    </form>
  )
}
