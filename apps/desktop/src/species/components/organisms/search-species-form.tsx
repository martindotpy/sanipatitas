import { zodResolver } from "@hookform/resolvers/zod"
import { useSpecies } from "@sanipatitas/desktop/species/hook/use-species"
import { $speciesQuery } from "@sanipatitas/desktop/species/store/species-query-store"
import { zGetApiSpeciesQuery } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import { type Table } from "@tanstack/react-table"
import { useDebounce } from "ahooks"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { TbLoader2, TbSearch } from "react-icons/tb"

// Schema
const zGetApiSpeciesSearchQuery = zGetApiSpeciesQuery.pick({ search: true })

// Component
interface SearchSpeciesFormProps<TData> {
  table?: Table<TData>
}

export function SearchSpeciesForm<TData>({
  table,
}: SearchSpeciesFormProps<TData>) {
  // Query
  const speciesQueryState = useSpecies()

  // Form
  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(zGetApiSpeciesSearchQuery),
    defaultValues: {
      search: "",
    },
  })

  // Debounce
  const watchedSearch = watch("search")
  const debouncedSearch = useDebounce(watchedSearch, { wait: 300 })

  useEffect(() => {
    $speciesQuery.set({
      ...$speciesQuery.get(),
      search: debouncedSearch,
      page: 0,
    })
    table?.setPageIndex(0)
  }, [debouncedSearch])

  const onSubmit = handleSubmit((data) => {
    $speciesQuery.set({ ...$speciesQuery.get(), search: data.search, page: 0 })
    table?.setPageIndex(0)
  })

  return (
    <form className="flex flex-1 items-center gap-2" onSubmit={onSubmit}>
      <ControlledInput
        control={control}
        name="search"
        inputProps={{
          placeholder: "Buscar especies...",
        }}
        icon={speciesQueryState.isFetching ? TbLoader2 : TbSearch}
        iconProps={{
          className: cn({ "animate-spin": speciesQueryState.isFetching }),
        }}
      />
    </form>
  )
}
