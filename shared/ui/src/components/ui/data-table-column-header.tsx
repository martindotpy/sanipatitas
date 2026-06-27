import { Button } from "@sanipatitas/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@sanipatitas/ui/components/ui/dropdown-menu"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import type { Column } from "@tanstack/react-table"
import { TbArrowDown, TbArrowUp, TbEyeOff, TbSelector } from "react-icons/tb"

// Component
interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  hasOneColumnVisible?: boolean
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  hasOneColumnVisible,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  // Filter
  const canSort = column.getCanSort()
  const canHide = !hasOneColumnVisible && column.getCanHide()

  if (!canSort && !canHide) {
    return <div className={cn(className)}>{title}</div>
  }

  // Sort
  const sortDirection = column.getIsSorted()

  return (
    <div className={cn("h-10 items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="data-[state=open]:bg-accent size-full justify-start"
            />
          }
        >
          <span>{title}</span>
          {sortDirection === "desc" ? (
            <TbArrowDown />
          ) : sortDirection === "asc" ? (
            <TbArrowUp />
          ) : (
            <TbSelector />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {canSort && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <TbArrowUp />
                Ascender
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <TbArrowDown />
                Descender
              </DropdownMenuItem>
            </>
          )}

          {canHide && canSort && <DropdownMenuSeparator />}

          {canHide && (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <TbEyeOff />
              Esconder
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
