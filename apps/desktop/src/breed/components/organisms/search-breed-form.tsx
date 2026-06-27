import { zodResolver } from "@hookform/resolvers/zod"
import { useBreed } from "@sanipatitas/desktop/breed/hook/use-breed"
import { $breedQuery } from "@sanipatitas/desktop/breed/store/breed-query-store"
import { zGetApiBreedQuery } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import { type Table } from "@tanstack/react-table"
import { useDebounce } from "ahooks"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { TbLoader2, TbSearch } from "react-icons/tb"

const zGetApiBreedSearchQuery = zGetApiBreedQuery.pick({ search: true })

interface SearchBreedFormProps<TData> {
  table?: Table<TData>
}

export function SearchBreedForm<TData>({
  table,
}: SearchBreedFormProps<TData>) {
  const breedQueryState = useBreed()

  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(zGetApiBreedSearchQuery),
    defaultValues: {
      search: "",
    },
  })

  const watchedSearch = watch("search")
  const debouncedSearch = useDebounce(watchedSearch, { wait: 300 })

  useEffect(() => {
    $breedQuery.set({
      ...$breedQuery.get(),
      search: debouncedSearch,
      page: 0,
    })
    table?.setPageIndex(0)
  }, [debouncedSearch])

  const onSubmit = handleSubmit((data) => {
    $breedQuery.set({ ...$breedQuery.get(), search: data.search, page: 0 })
    table?.setPageIndex(0)
  })

  return (
    <form className="flex flex-1 items-center gap-2" onSubmit={onSubmit}>
      <ControlledInput
        control={control}
        name="search"
        inputProps={{
          placeholder: "Buscar razas...",
        }}
        icon={breedQueryState.isFetching ? TbLoader2 : TbSearch}
        iconProps={{
          className: cn({ "animate-spin": breedQueryState.isFetching }),
        }}
      />
    </form>
  )
}
