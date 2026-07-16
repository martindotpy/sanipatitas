import {
  Field,
  FieldError,
  FieldLabel,
} from "@sanipatitas/ui/components/ui/field"
import {
  NumberInput,
  type NumberInputProps,
} from "@sanipatitas/ui/components/ui/number-input"
import type { ClassNameProp } from "@sanipatitas/ui/kit/component-kit"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import type z from "zod"

// Types
interface ControlledNumberInputProps<
  TIconProps extends ClassNameProp = ClassNameProp,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label?: React.ReactNode
  schema?: z.ZodNumber
  numberInputProps?: NumberInputProps
  labelProps?: React.HTMLAttributes<HTMLLabelElement>
  errorProps?: React.HTMLAttributes<HTMLSpanElement>
  icon?: React.FunctionComponent<TIconProps>
  iconProps?: TIconProps
}

// Component
export function ControlledNumberInput<
  TIconProps extends ClassNameProp = ClassNameProp,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  schema,
  numberInputProps: { className: numberInputClassName, ...inputProps } = {},
  labelProps: { className: labelClassName, ...labelProps } = {},
  errorProps: { className: errorClassName, ...errorProps } = {},
  icon: Icon,
  iconProps = {} as TIconProps,
  ...props
}: ControlledNumberInputProps<TIconProps, TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name} className={labelClassName} {...labelProps}>
            {label}
          </FieldLabel>

          <div className="relative w-full">
            <NumberInput
              id={name}
              className={numberInputClassName}
              aria-invalid={fieldState.invalid}
              min={schema?.minValue ?? undefined}
              max={schema?.maxValue ?? undefined}
              {...inputProps}
              {...field}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              onChange={undefined}
              value={field.value}
              defaultValue={field.value}
              onValueChange={(value) => field.onChange(value)}
            />
            {Icon && (
              <Icon
                {...iconProps}
                className={cn(
                  "text-muted-foreground pointer-events-none absolute top-1/2 right-10 size-4 -translate-y-1/2",
                  iconProps.className,
                )}
              />
            )}
          </div>

          {fieldState.invalid && (
            <FieldError
              className={cn(errorClassName)}
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
