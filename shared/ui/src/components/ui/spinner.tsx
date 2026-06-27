import { cn } from "@sanipatitas/ui/lib/tailwind"
import { TbLoader2 } from "react-icons/tb"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <TbLoader2
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
