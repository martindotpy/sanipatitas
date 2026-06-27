import { Skeleton } from "@sanipatitas/ui/components/ui/skeleton"
import {
  TableBody,
  TableCell,
  TableRow,
} from "@sanipatitas/ui/components/ui/table"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import type { Table } from "@tanstack/react-table"

// Component
export interface DataTableSkeletonBodyProps<TData> {
  table: Table<TData>
}

export function DataTableSkeletonBody<TData>({
  table,
}: DataTableSkeletonBodyProps<TData>) {
  const pageSize = table.getState().pagination.pageSize

  return (
    <TableBody>
      {Array.from({ length: pageSize }).map((_, i) => (
        <TableRow key={i}>
          {table.getAllColumns().map((column) => (
            <TableCell
              key={column.id}
              className={cn(
                "truncate",
                "not-[[role=checkbox]]:not-[[role=actions]]:max-w-(--max-size) not-[[role=checkbox]]:not-[[role=actions]]:min-w-(--min-size)"
              )}
              style={
                {
                  "--max-size": `${column.columnDef.maxSize}px`,
                  "--min-size": `${column.columnDef.minSize}px`,
                } as React.CSSProperties
              }
            >
              <Skeleton
                className={cn("h-4 w-full", {
                  "bg-transparent":
                    column.columnDef.meta?.role === "checkbox" ||
                    column.columnDef.meta?.role === "actions",
                })}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}
