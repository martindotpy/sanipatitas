import { Button } from "@sanipatitas/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@sanipatitas/ui/components/ui/dropdown-menu"
import type { Row } from "@tanstack/react-table"
import { TbDotsVertical } from "react-icons/tb"

// Types
export interface RowAction<TData> {
  label: string
  onClick: (row: TData) => void
  variant?: "default" | "destructive"
  icon?: React.ComponentType<{ className?: string }>
  shortcut?: string
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  actions: RowAction<TData>[]
}

// Component
export function DataTableRowActions<TData>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {
  if (actions.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="data-[state=open]:bg-muted size-4"
          />
        }
      >
        <TbDotsVertical />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {actions.map((action, index) => (
          <span key={action.label}>
            {index > 0 &&
              action.variant === "destructive" &&
              actions[index - 1]?.variant !== "destructive" && (
                <DropdownMenuSeparator />
              )}
            <DropdownMenuItem
              variant={action.variant}
              onClick={() => action.onClick(row.original)}
            >
              {action.icon && <action.icon className="size-4" />}
              {action.label}
              {action.shortcut && (
                <span className="text-muted-foreground ml-auto text-xs tracking-widest">
                  {action.shortcut}
                </span>
              )}
            </DropdownMenuItem>
          </span>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
