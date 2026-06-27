import { DataTableViewOptions } from "@sanipatitas/ui/components/ui/data-table-view-options"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import type { Table, useReactTable } from "@tanstack/react-table"

// Component
export interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchRender?:
    | React.ReactNode
    | ((props: {
        table: ReturnType<typeof useReactTable<TData>>
      }) => React.ReactNode)
  tableOptionsRender?:
    | React.ReactNode
    | ((props: {
        table: ReturnType<typeof useReactTable<TData>>
      }) => React.ReactNode)
  hasOneColumnVisible?: boolean
}

export function DataTableToolbar<TData>({
  table,
  searchRender,
  tableOptionsRender,
  hasOneColumnVisible,
}: DataTableToolbarProps<TData>) {
  // Resolved
  const resolvedSearchRender =
    typeof searchRender === "function" ? searchRender({ table }) : searchRender
  const resolvedTableOptionsRender =
    typeof tableOptionsRender === "function"
      ? tableOptionsRender({ table })
      : tableOptionsRender

  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-2",
        "xl:flex-row xl:items-center"
      )}
    >
      <div className="flex flex-1 items-center gap-2">
        {resolvedSearchRender}
      </div>

      <div className="flex items-center gap-2">
        {resolvedTableOptionsRender}
        <DataTableViewOptions
          table={table}
          hasOneColumnVisible={hasOneColumnVisible}
        />
      </div>
    </div>
  )
}
