import { DataTablePagination } from "@sanipatitas/ui/components/ui/data-table-pagination"
import { DataTableSkeletonBody } from "@sanipatitas/ui/components/ui/data-table-skeleton"
import {
  DataTableToolbar,
  type DataTableToolbarProps,
} from "@sanipatitas/ui/components/ui/data-table-toolbar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sanipatitas/ui/components/ui/table"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import { usePersistentState } from "@sanipatitas/ui/stores/persistant-store-factory"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type TableOptions,
  type VisibilityState,
} from "@tanstack/react-table"
import { useEffect, useRef, useState } from "react"

// Component
type InitialState<TData> = TableOptions<TData>["initialState"] & {
  pagination: PaginationState
}

interface DataTableProps<TData> extends Omit<
  TableOptions<TData>,
  | "getCoreRowModel"
  | "state"
  | "onColumnFiltersChange"
  | "onColumnVisibilityChange"
  | "onPaginationChange"
  | "onRowSelectionChange"
  | "onSortingChange"
> {
  id: string
  searchRender?: DataTableToolbarProps<TData>["searchRender"]
  tableOptionsRender?: DataTableToolbarProps<TData>["tableOptionsRender"]
  loading?: boolean
  initialState: InitialState<TData>
  selectionActionsRender?: (
    table: ReturnType<typeof useReactTable<TData>>
  ) => React.ReactNode
  onPaginationChange?: (pagination: PaginationState) => void
  onSortingChange?: (sorting: SortingState) => void
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
  onRowSelectionChange?: (selection: Record<string, boolean>) => void
}

export function DataTable<TData>({
  id,
  columns,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  onColumnVisibilityChange,
  onRowSelectionChange,
  selectionActionsRender,
  searchRender,
  tableOptionsRender,
  loading,
  ...props
}: DataTableProps<TData>) {
  const isServerPagination = onPaginationChange != null

  // Pagination
  const [pagination, setPagination] = usePersistentState<PaginationState>(
    `${id}:pagination`,
    props.initialState?.pagination
  )

  useEffect(() => {
    return () => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    }
  }, [setPagination])

  const onPaginationChangeRef = useRef(onPaginationChange)
  onPaginationChangeRef.current = onPaginationChange

  useEffect(() => {
    onPaginationChangeRef.current?.(pagination)
  }, [pagination])

  // Sorting
  const [sorting, setSorting] = useState<SortingState>([])

  const onSortingChangeRef = useRef(onSortingChange)
  onSortingChangeRef.current = onSortingChange

  useEffect(() => {
    onSortingChangeRef.current?.(sorting)
  }, [sorting])

  // Filtering
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const onColumnFiltersChangeRef = useRef(onColumnFiltersChange)
  onColumnFiltersChangeRef.current = onColumnFiltersChange

  useEffect(() => {
    onColumnFiltersChangeRef.current?.(columnFilters)
  }, [columnFilters])

  // Visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const onColumnVisibilityChangeRef = useRef(onColumnVisibilityChange)
  onColumnVisibilityChangeRef.current = onColumnVisibilityChange

  useEffect(() => {
    onColumnVisibilityChangeRef.current?.(columnVisibility)
  }, [columnVisibility])

  // Select
  const [rowSelection, setRowSelection] = useState({})

  const onRowSelectionChangeRef = useRef(onRowSelectionChange)
  onRowSelectionChangeRef.current = onRowSelectionChange

  useEffect(() => {
    onRowSelectionChangeRef.current?.(rowSelection)
  }, [rowSelection])

  // Table
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    ...props,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    // Server sync via onPaginationChange — keep pageIndex while the next page loads
    manualPagination: isServerPagination,
    autoResetPageIndex: !isServerPagination,
    enableRowSelection: true,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: isServerPagination
      ? undefined
      : getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const headerGroups = table.getHeaderGroups()
  const tableColumns = table.getAllColumns()
  const hasOneColumnVisible =
    tableColumns.filter(
      (column) => column.getIsVisible() && column.id !== "select"
    ).length === 1
  const rowModel = table.getRowModel()
  const rows = rowModel.rows
  const rowsCount = rows.length

  return (
    <div className="flex flex-1 flex-col gap-4">
      <DataTableToolbar
        table={table}
        searchRender={searchRender}
        tableOptionsRender={tableOptionsRender}
        hasOneColumnVisible={hasOneColumnVisible}
      />

      {selectionActionsRender?.(table)}

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/50 hover:bg-muted/75"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "truncate",
                        "not-[[role=checkbox]]:not-[[role=actions]]:max-w-(--max-size) not-[[role=checkbox]]:not-[[role=actions]]:min-w-(--min-size) not-[[role=checkbox]]:not-[[role=actions]]:p-0"
                      )}
                      style={
                        {
                          "--max-size": `${header.column.columnDef.maxSize}px`,
                          "--min-size": `${header.column.columnDef.minSize}px`,
                        } as React.CSSProperties
                      }
                      role={header.column.columnDef.meta?.role}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header ??
                              header.column.columnDef.meta?.label ??
                              header.column.columnDef.header,
                            { ...header.getContext(), hasOneColumnVisible }
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          {loading ? (
            <DataTableSkeletonBody table={table} />
          ) : (
            <TableBody>
              {rowsCount > 0 ? (
                <>
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "truncate",
                            "not-[[role=checkbox]]:not-[[role=actions]]:max-w-(--max-size) not-[[role=checkbox]]:not-[[role=actions]]:min-w-(--min-size)"
                          )}
                          style={
                            {
                              "--max-size": `${cell.column.columnDef.maxSize}px`,
                              "--min-size": `${cell.column.columnDef.minSize}px`,
                            } as React.CSSProperties
                          }
                          role={cell.column.columnDef.meta?.role}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                  {/* Rest */}
                  {Array.from({
                    length: table.getState().pagination.pageSize - rowsCount,
                  }).map((_, i) => (
                    <TableRow key={i}>
                      {table.getAllColumns().map((column) => (
                        <TableCell
                          key={column.id}
                          className="truncate"
                          style={
                            {
                              "--max-size": `${column.columnDef.maxSize}px`,
                              "--min-size": `${column.columnDef.minSize}px`,
                            } as React.CSSProperties
                          }
                        >
                          &nbsp;
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow
                  style={
                    {
                      height: `calc(${table.getState().pagination.pageSize} * 37px - 0.5px)`,
                    } as React.CSSProperties
                  }
                >
                  <TableCell colSpan={columns.length} className="text-center">
                    No hay datos aún.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
