import {
  Field,
  FieldError,
  FieldLabel,
} from "@sanipatitas/ui/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@sanipatitas/ui/components/ui/input-group"
import type { ClassNameProp } from "@sanipatitas/ui/kit/component-kit"
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form"

// Date/time conversion helpers.
// Form state always holds a full ISO-8601 UTC string (what the API/Zod schema
// expects); these convert only at the native-input boundary.
function isoToDateInput(iso: unknown): string {
  if (typeof iso !== "string" || !iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

function dateInputToIso(value: string): string | undefined {
  if (!value) return undefined
  const d = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}

function isoToDatetimeLocalInput(iso: unknown): string {
  if (typeof iso !== "string" || !iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function datetimeLocalInputToIso(value: string): string | undefined {
  if (!value) return undefined
  // No timezone in the string => parsed as local time, per the Date spec
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}

// Component
interface ControlledDatetimeInputProps<
  TIconProps extends ClassNameProp = ClassNameProp,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> extends UseControllerProps<TFieldValues, TName, TTransformedValues> {
  mode: "date" | "datetime-local"
  label?: React.ReactNode
  inputProps?: Omit<
    React.ComponentProps<typeof InputGroupInput>,
    "type" | "value" | "onChange"
  >
  labelProps?: React.ComponentProps<typeof FieldLabel>
  errorProps?: React.ComponentProps<typeof FieldError>
  icon?: React.FunctionComponent<TIconProps>
  iconProps?: TIconProps
}

export function ControlledDatetimeInput<
  TIconProps extends ClassNameProp = ClassNameProp,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  mode,
  label,
  inputProps: { className: inputClassName, ...inputProps } = {},
  labelProps: { className: labelClassName, ...labelProps } = {},
  errorProps: { className: errorClassName, ...errorProps } = {},
  icon: Icon,
  iconProps = {} as TIconProps,
  ...props
}: ControlledDatetimeInputProps<TIconProps, TFieldValues, TName>) {
  const isoToInput = mode === "date" ? isoToDateInput : isoToDatetimeLocalInput
  const inputToIso = mode === "date" ? dateInputToIso : datetimeLocalInputToIso

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel
              htmlFor={name}
              className={labelClassName}
              {...labelProps}
            >
              {label}
            </FieldLabel>
          )}

          <InputGroup>
            <InputGroupInput
              id={name}
              type={mode}
              className={inputClassName}
              aria-invalid={fieldState.invalid}
              name={field.name}
              onBlur={field.onBlur}
              ref={field.ref}
              value={isoToInput(field.value)}
              onChange={(e) => field.onChange(inputToIso(e.target.value))}
              {...inputProps}
            />

            {Icon && (
              <InputGroupAddon align="inline-end">
                <Icon {...iconProps} className={iconProps.className} />
              </InputGroupAddon>
            )}
          </InputGroup>

          {fieldState.invalid && (
            <FieldError
              className={errorClassName}
              {...errorProps}
              errors={[fieldState.error]}
            />
          )}
        </Field>
      )}
      {...props}
    />
  )
}
