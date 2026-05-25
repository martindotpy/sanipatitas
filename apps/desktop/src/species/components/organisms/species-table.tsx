import { useSpecies } from "@sanipatitas/desktop/species/hook/use-species"
import { $speciesQuery } from "@sanipatitas/desktop/species/store/species-query-store"
import type { OpenapiSpeciesDto } from "@sanipatitas/shared/api/client/types.gen"
import { Button } from "@sanipatitas/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@sanipatitas/ui/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sanipatitas/ui/components/ui/table"
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import * as React from "react"
import { TbArrowsSort, TbDotsVertical } from "react-icons/tb"

// Columns
const columns: ColumnDef<OpenapiSpeciesDto>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nombre
        <TbArrowsSort className="ml-2 size-4" />
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Descripción
        <TbArrowsSort className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) =>
      (row.getValue("description") as string | undefined) ?? "\u2014",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const species = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md">
            <TbDotsVertical className="size-4" />
            <span className="sr-only">Abrir menú</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(species.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// Component
export function SpeciesTable() {
  const { data, isLoading } = useSpecies()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
    pageCount: data?.totalPages ?? -1,
  })

  // Pagination
  const handlePreviousPage = () => {
    const current = $speciesQuery.get()
    if ((current.page ?? 0) > 0) {
      $speciesQuery.set({ ...current, page: (current.page ?? 0) - 1 })
    }
  }

  const handleNextPage = () => {
    const current = $speciesQuery.get()
    if (data?.totalPages && (current.page ?? 0) < data.totalPages - 1) {
      $speciesQuery.set({ ...current, page: (current.page ?? 0) + 1 })
    }
  }

  const currentPage = data?.page ?? 0
  const totalPages = data?.totalPages ?? 0
  const canPreviousPage = currentPage > 0
  const canNextPage = currentPage < totalPages - 1

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center py-8 text-sm">
        Cargando especies...
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 ml-auto inline-flex h-9 cursor-pointer items-center justify-center rounded-md border px-2.5 text-sm font-medium whitespace-nowrap transition-all outline-none select-none">
            Columnas
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id === "name"
                    ? "Nombre"
                    : column.id === "description"
                      ? "Descripción"
                      : column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron especies.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="text-muted-foreground text-sm">
          {data?.totalElements ?? 0} registro(s)
          {totalPages > 0
            ? ` \u2014 P\u00e1gina ${currentPage + 1} de ${totalPages}`
            : ""}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!canPreviousPage}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!canNextPage}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
