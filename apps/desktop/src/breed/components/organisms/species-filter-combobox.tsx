import { $breedQuery } from "@sanipatitas/desktop/breed/store/breed-query-store"
import { useSpecies } from "@sanipatitas/desktop/species/hook/use-species"
import { Button } from "@sanipatitas/ui/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@sanipatitas/ui/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@sanipatitas/ui/components/ui/popover"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import { useStore } from "@nanostores/react"
import { useMemo, useState } from "react"
import { TbCheck, TbSelector } from "react-icons/tb"

export function SpeciesFilterCombobox() {
  const speciesQuery = useSpecies()
  const [open, setOpen] = useState(false)

  const allSpecies = speciesQuery.data?.data ?? []

  const speciesOptions = useMemo(
    () =>
      allSpecies.map((s) => ({
        value: s.id,
        label: s.name,
      })),
    [allSpecies]
  )

  const { speciesIds: selectedIds } = useStore($breedQuery)

  const selectedLabels = useMemo(
    () =>
      speciesOptions
        .filter((s) => selectedIds.includes(s.value))
        .map((s) => s.label)
        .join(", "),
    [speciesOptions, selectedIds]
  )

  const toggleSpecies = (id: string) => {
    const current = $breedQuery.get().speciesIds
    const isSelected = current.includes(id)
    const next = isSelected
      ? current.filter((s) => s !== id)
      : [...current, id]

    $breedQuery.set({
      ...$breedQuery.get(),
      speciesIds: next,
      page: 0,
    })
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <Button
            aria-expanded={open}
            className="w-64 justify-between"
            variant="outline"
          />
        }
      >
        <span className="truncate">
          {selectedLabels || "Todas las especies"}
        </span>
        <TbSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command
          filter={(value, search) => {
            const label = speciesOptions.find((s) => s.value === value)?.label
            return label?.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
          }}
        >
          <CommandInput placeholder="Buscar especie..." />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              {speciesOptions.map((s) => {
                const isSelected = selectedIds.includes(s.value)
                return (
                  <CommandItem
                    key={s.value}
                    onSelect={() => toggleSpecies(s.value)}
                    value={s.value}
                  >
                    <TbCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {s.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
