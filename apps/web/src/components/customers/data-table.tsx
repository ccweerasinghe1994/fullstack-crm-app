/**
 * Advanced DataTable component using TanStack Table
 */

import type {
  ColumnDef,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaginationMeta, PaginationParams } from "../../types/pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta?: PaginationMeta;
  pagination?: PaginationParams;
  onPaginationChange?: (pagination: PaginationParams) => void;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  meta,
  pagination,
  onPaginationChange,
  searchPlaceholder = "Search customers...",
}: DataTableProps<TData, TValue>) {
  const [searchValue, setSearchValue] = React.useState(pagination?.search || "");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Use server-side pagination if meta is provided
  const isServerSide = !!meta && !!pagination && !!onPaginationChange;

  // Debounce search input (500ms delay)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onPaginationChange && pagination) {
        onPaginationChange({
          ...pagination,
          search: searchValue,
          page: 1, // Reset to page 1 on new search
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Handle sorting changes for server-side
  const handleSortingChange = React.useCallback(
    (updater: any) => {
      if (isServerSide && pagination && onPaginationChange) {
        const newSorting =
          typeof updater === "function" ? updater([]) : updater;

        if (newSorting.length > 0) {
          const sort = newSorting[0];
          onPaginationChange({
            ...pagination,
            sortBy: sort.id,
            order: sort.desc ? "desc" : "asc",
            page: 1, // Reset to first page on sort
          });
        } else {
          // Clear sorting
          onPaginationChange({
            ...pagination,
            sortBy: "createdAt",
            order: "desc",
            page: 1,
          });
        }
      }
    },
    [isServerSide, pagination, onPaginationChange]
  );

  // Convert server pagination to TanStack sorting state
  const sortingState = React.useMemo(() => {
    if (isServerSide && pagination?.sortBy) {
      return [
        {
          id: pagination.sortBy,
          desc: pagination.order === "desc",
        },
      ];
    }
    return [];
  }, [isServerSide, pagination?.sortBy, pagination?.order]);

  const table = useReactTable({
    data,
    columns,
    manualPagination: isServerSide,
    manualSorting: isServerSide,
    pageCount: meta?.totalPages ?? -1,
    onSortingChange: isServerSide ? handleSortingChange : undefined,
    getCoreRowModel: getCoreRowModel(),
    ...(isServerSide
      ? {}
      : {
          getPaginationRowModel: getPaginationRowModel(),
          getSortedRowModel: getSortedRowModel(),
        }),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
      sorting: sortingState,
      ...(isServerSide && {
        pagination: {
          pageIndex: (pagination.page ?? 1) - 1,
          pageSize: pagination.limit ?? 10,
        },
      }),
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {isServerSide ? (
            <>
              Showing {(meta!.page - 1) * meta!.limit + 1} to{" "}
              {Math.min(meta!.page * meta!.limit, meta!.total)} of {meta!.total}{" "}
              results
            </>
          ) : (
            <>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            Page{" "}
            {isServerSide
              ? meta!.page
              : table.getState().pagination.pageIndex + 1}{" "}
            of {isServerSide ? meta!.totalPages : table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isServerSide && pagination && onPaginationChange) {
                onPaginationChange({
                  ...pagination,
                  page: (pagination.page ?? 1) - 1,
                });
              } else {
                table.previousPage();
              }
            }}
            disabled={
              isServerSide
                ? !meta?.hasPreviousPage
                : !table.getCanPreviousPage()
            }
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isServerSide && pagination && onPaginationChange) {
                onPaginationChange({
                  ...pagination,
                  page: (pagination.page ?? 1) + 1,
                });
              } else {
                table.nextPage();
              }
            }}
            disabled={
              isServerSide ? !meta?.hasNextPage : !table.getCanNextPage()
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
