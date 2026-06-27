import { CreateSpecies } from "@sanipatitas/desktop/species/components/organisms/create-species"
import { SearchSpeciesForm } from "@sanipatitas/desktop/species/components/organisms/search-species-form"

// Component
export function SpeciesActions() {
  return (
    <div className="flex items-center justify-end gap-2">
      <SearchSpeciesForm />
      <CreateSpecies />
    </div>
  )
}
