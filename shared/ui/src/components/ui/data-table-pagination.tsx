import { Button } from "@sanipatitas/ui/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@sanipatitas/ui/components/ui/select"
import type { Table } from "@tanstack/react-table"
import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "react-icons/tb"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizes?: number[]
  rowsPerPageLabel?: string
}

export function DataTablePagination<TData>({
  table,
  pageSizes = [10, 20, 25],
  rowsPerPageLabel = "Filas por página",
}: DataTablePaginationProps<TData>) {
  // eslint-disable-next-line react-compiler/react-compiler
  "use no memo"

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">{rowsPerPageLabel}</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className="h-8 w-17.5">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizes.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center text-sm font-medium">
          {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Ir a la primera página</span>
          <TbChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Ir a la página anterior</span>
          <TbChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Ir a la página siguiente</span>
          <TbChevronRight />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Ir a la última página</span>
          <TbChevronsRight />
        </Button>
      </div>
    </div>
  )
}
