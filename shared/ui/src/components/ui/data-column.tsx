import { Checkbox } from "@sanipatitas/ui/components/ui/checkbox"
import { DataTableColumnHeader } from "@sanipatitas/ui/components/ui/data-table-column-header"
import "@tanstack/react-table"
import type { ColumnDef, RowData } from "@tanstack/react-table"

// Type
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string
    role?: React.AriaRole
  }
}

// Column
export function withColumns<TValue>(
  columns: ColumnDef<TValue>[]
): ColumnDef<TValue>[] {
  return columns.map((column) => {
    if (column.meta?.label) {
      return {
        ...column,
        header: (props) => (
          <DataTableColumnHeader
            title={column.meta?.label ?? props.column.id}
            {...props}
          />
        ),
      } as ColumnDef<TValue>
    }

    return column
  })
}

export function withSelectionColumns<TValue>(
  columns: ColumnDef<TValue>[]
): ColumnDef<TValue>[] {
  const dataTableColumns = withColumns(columns)

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Seleccionar todas las filas"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      maxSize: 32,
      minSize: 32,
      meta: { role: "checkbox" },
    },
    ...dataTableColumns,
  ]
}
