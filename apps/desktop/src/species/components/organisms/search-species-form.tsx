import { zodResolver } from "@hookform/resolvers/zod"
import { $speciesQuery } from "@sanipatitas/desktop/species/store/species-query-store"
import { zGetApiSpeciesQuery } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
import { Button } from "@sanipatitas/ui/components/ui/button"
import { useForm } from "react-hook-form"
import { TbSearch } from "react-icons/tb"

// Schema
const zGetApiSpeciesSearchQuery = zGetApiSpeciesQuery.pick({ search: true })

// Component
export function SearchSpeciesForm() {
  // Form
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(zGetApiSpeciesSearchQuery),
    defaultValues: {
      search: "",
    },
  })

  const onSubmit = handleSubmit((data) => {
    $speciesQuery.set({ ...$speciesQuery.get(), search: data.search, page: 0 })
  })

  return (
    <form className="flex items-center gap-2" onSubmit={onSubmit}>
      <ControlledInput
        control={control}
        name="search"
        inputProps={{
          placeholder: "Buscar especies...",
        }}
        icon={TbSearch}
      />

      <Button type="submit">Buscar</Button>
    </form>
  )
}
