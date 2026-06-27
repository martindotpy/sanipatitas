import { zodResolver } from "@hookform/resolvers/zod"
import { useClient } from "@sanipatitas/desktop/client/hook/use-client"
import { $clientQuery } from "@sanipatitas/desktop/client/store/client-query-store"
import { zGetApiClientQuery } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import { type Table } from "@tanstack/react-table"
import { useDebounce } from "ahooks"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { TbLoader2, TbSearch } from "react-icons/tb"

const zGetApiClientSearchQuery = zGetApiClientQuery.pick({ search: true })

interface SearchClientFormProps<TData> {
  table?: Table<TData>
}

export function SearchClientForm<TData>({
  table,
}: SearchClientFormProps<TData>) {
  const clientQueryState = useClient()

  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(zGetApiClientSearchQuery),
    defaultValues: {
      search: "",
    },
  })

  const watchedSearch = watch("search")
  const debouncedSearch = useDebounce(watchedSearch, { wait: 300 })

  useEffect(() => {
    $clientQuery.set({
      ...$clientQuery.get(),
      search: debouncedSearch,
      page: 0,
    })
    table?.setPageIndex(0)
  }, [debouncedSearch])

  const onSubmit = handleSubmit((data) => {
    $clientQuery.set({ ...$clientQuery.get(), search: data.search, page: 0 })
    table?.setPageIndex(0)
  })

  return (
    <form className="flex flex-1 items-center gap-2" onSubmit={onSubmit}>
      <ControlledInput
        control={control}
        name="search"
        inputProps={{
          placeholder: "Buscar clientes...",
        }}
        icon={clientQueryState.isFetching ? TbLoader2 : TbSearch}
        iconProps={{
          className: cn({ "animate-spin": clientQueryState.isFetching }),
        }}
      />
    </form>
  )
}
