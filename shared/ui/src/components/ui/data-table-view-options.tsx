import { Button } from "@sanipatitas/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@sanipatitas/ui/components/ui/dropdown-menu"
import type { Table, VisibilityState } from "@tanstack/react-table"
import { TbAdjustments } from "react-icons/tb"

// Types
interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  hasOneColumnVisible?: boolean
  columnVisibility?: VisibilityState
}

// Component
export function DataTableViewOptions<TData>({
  table,
  hasOneColumnVisible,
  columnVisibility,
}: DataTableViewOptionsProps<TData>) {
  const hideableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="ml-auto flex h-8 cursor-pointer" />
        }
      >
        <TbAdjustments />
        Vista
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-38">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Alternar columnas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {hideableColumns.map((column) => {
            // Depend on columnVisibility so this menu re-renders after toggles
            const isVisible =
              columnVisibility?.[column.id] !== false && column.getIsVisible()
            const locked = Boolean(hasOneColumnVisible && isVisible)

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={isVisible}
                disabled={locked}
                closeOnClick={false}
                onCheckedChange={(_value, details) => {
                  if (locked) {
                    details.cancel()
                    return
                  }

                  // Use live column state — avoid stale checkbox value
                  column.toggleVisibility(!column.getIsVisible())
                }}
              >
                {column.columnDef.meta?.label ?? column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
