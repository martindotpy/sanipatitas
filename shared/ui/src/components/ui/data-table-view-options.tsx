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
import type { Table } from "@tanstack/react-table"
import { TbAdjustments } from "react-icons/tb"

// Component
interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  hasOneColumnVisible?: boolean
}

export function DataTableViewOptions<TData>({
  table,
  hasOneColumnVisible,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="ml-auto flex h-8" />
        }
      >
        <TbAdjustments />
        Vista
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-38">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Alternas columnas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  disabled={hasOneColumnVisible && column.getIsVisible()}
                  onCheckedChange={(value) => {
                    if (hasOneColumnVisible && !value) {
                      return
                    }

                    column.toggleVisibility(!!value)
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
