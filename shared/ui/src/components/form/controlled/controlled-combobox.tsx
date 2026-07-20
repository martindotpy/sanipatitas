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
  Field,
  FieldError,
  FieldLabel,
} from "@sanipatitas/ui/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@sanipatitas/ui/components/ui/popover"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import { useState } from "react"
import type {
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form"
import { Controller } from "react-hook-form"
import { TbCheck, TbSelector } from "react-icons/tb"

// Types
interface ComboboxOption {
  value: string
  label: string
}

interface ControlledComboboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  label?: React.ReactNode
  options: ComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
}

export function ControlledCombobox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  options,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Sin resultados",
}: ControlledComboboxProps<TFieldValues, TName>) {
  const [open, setOpen] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedLabel = options.find(
          (o) => o.value === field.value
        )?.label

        return (
          <Field data-invalid={fieldState.invalid}>
            {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                render={
                  <Button
                    id={name}
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                    variant="outline"
                    aria-invalid={fieldState.invalid}
                  />
                }
              >
                <span className="truncate">{selectedLabel || placeholder}</span>
                <TbSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </PopoverTrigger>
              <PopoverContent className="w-(--anchor-width) p-0" align="start">
                <Command
                  filter={(value, search) => {
                    const label = options.find((o) => o.value === value)?.label
                    return label?.toLowerCase().includes(search.toLowerCase())
                      ? 1
                      : 0
                  }}
                >
                  <CommandInput placeholder={searchPlaceholder} />
                  <CommandList>
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup>
                      {options.map((opt) => {
                        const isSelected = field.value === opt.value
                        return (
                          <CommandItem
                            key={opt.value}
                            value={opt.value}
                            onSelect={() => {
                              field.onChange(opt.value)
                              setOpen(false)
                            }}
                          >
                            <TbCheck
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {opt.label}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
