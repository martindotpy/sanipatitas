import {
  NumberField,
  type NumberFieldGroupProps,
  type NumberFieldRootProps,
} from "@base-ui/react/number-field"
import { Button } from "@sanipatitas/ui/components/ui/button"
import { Input } from "@sanipatitas/ui/components/ui/input"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import { TbMinus, TbPlus } from "react-icons/tb"

export interface NumberInputProps extends NumberFieldRootProps {
  groupProps?: NumberFieldGroupProps
  decrementProps?: React.ComponentProps<typeof NumberField.Decrement>
  incrementProps?: React.ComponentProps<typeof NumberField.Increment>
  inputProps?: React.ComponentProps<typeof NumberField.Input> &
    React.ComponentProps<typeof Input>
}

export function NumberInput({
  className,
  groupProps,
  decrementProps,
  incrementProps,
  inputProps,
  ...props
}: NumberInputProps) {
  return (
    <NumberField.Root
      data-slot="number-input"
      className={cn("w-full", className)}
      {...props}
    >
      <NumberField.Group
        {...groupProps}
        className={cn(
          "border-input dark:bg-input/30 relative flex h-9 w-full min-w-0 items-center rounded-md border shadow-xs transition-[color,box-shadow]",
          "has-[[data-slot=number-input-control]:focus-visible]:border-ring has-[[data-slot=number-input-control]:focus-visible]:ring-ring/50 has-[[data-slot=number-input-control]:focus-visible]:ring-3",
          "has-[[data-slot=number-input-control][aria-invalid=true]]:border-destructive has-[[data-slot=number-input-control][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot=number-input-control][aria-invalid=true]]:ring-destructive/40 has-[[data-slot=number-input-control][aria-invalid=true]]:ring-3",
          groupProps?.className,
        )}
      >
        <NumberField.Decrement
          {...decrementProps}
          render={(buttonProps) => (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              {...buttonProps}
              className={cn(
                "ml-1 shrink-0 cursor-pointer transition-colors duration-200",
                decrementProps?.className,
                buttonProps.className,
              )}
            >
              <TbMinus />
            </Button>
          )}
        />
        <NumberField.Input
          {...inputProps}
          render={(fieldProps) => (
            <Input
              {...fieldProps}
              data-slot="number-input-control"
              className={cn(
                "h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-2 text-center shadow-none tabular-nums focus-visible:ring-0 dark:bg-transparent",
                inputProps?.className,
                fieldProps.className,
              )}
            />
          )}
        />
        <NumberField.Increment
          {...incrementProps}
          render={(buttonProps) => (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              {...buttonProps}
              className={cn(
                "mr-1 shrink-0 cursor-pointer transition-colors duration-200",
                incrementProps?.className,
                buttonProps.className,
              )}
            >
              <TbPlus />
            </Button>
          )}
        />
      </NumberField.Group>
    </NumberField.Root>
  )
}
