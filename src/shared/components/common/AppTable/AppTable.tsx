import AppPagination from "@/shared/components/common/AppPagination";
import AppSelect from "@/shared/components/common/AppSelect";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/shared/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/shared/constants/pagination.constant";
import { cn } from "@/shared/lib/utils";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, SearchX } from "lucide-react";
import React, { useMemo, useState } from "react";
import SkeletonTable from "./SkeletonTable";

const INDEX_COLUMN_ID = "index";

interface AppTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;

  page?: number;
  pageCount?: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;

  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  rowIdKey?: keyof TData;

  enableColumnVisibility?: boolean;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;

  getRowClassName?: (row: TData) => string;

  enableExpanding?: boolean;
  renderExpandedRow?: (row: TData) => React.ReactNode;

  enablePagination?: boolean;
}

export function AppTable<TData, TValue>({
  columns,
  data,
  loading = false,
  page = 1,
  pageCount = 0,
  pageSize = DEFAULT_PAGE_SIZE,
  onPageChange,

  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,
  rowIdKey = "id" as keyof TData,

  enableColumnVisibility = false,
  columnVisibility,
  onColumnVisibilityChange,

  getRowClassName,
  enableExpanding = false,
  renderExpandedRow,

  enablePagination = true,
}: AppTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const selectColumn = useMemo<ColumnDef<TData> | null>(() => {
    if (!enableRowSelection) return null;

    return {
      id: "__select",
      header: ({ table }) => (
        <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} />
      ),
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
      enableSorting: false,
      enableHiding: false,
    };
  }, [enableRowSelection]);

  const expandColumn = useMemo<ColumnDef<TData> | null>(() => {
    if (!enableExpanding) return null;

    return {
      id: "__expand",
      header: () => null,
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <button onClick={row.getToggleExpandedHandler()} className='p-1 cursor-pointer'>
            <ChevronRight className={cn("w-4 h-4 transition-transform duration-200", row.getIsExpanded() && "rotate-90")} />
          </button>
        ) : null,
      enableSorting: false,
      enableHiding: false,
      size: 40,
    };
  }, [enableExpanding]);

  const resolvedColumns = useMemo(() => {
    const cols = selectColumn ? [selectColumn, ...columns] : columns;
    return expandColumn ? [expandColumn, ...cols] : cols;
  }, [selectColumn, expandColumn, columns]);

  const table = useReactTable({
    data,
    columns: resolvedColumns,

    state: {
      sorting,
      pagination: {
        pageIndex: page,
        pageSize,
      },
      ...(enableRowSelection && rowSelection ? { rowSelection } : {}),
      ...(enableColumnVisibility && columnVisibility ? { columnVisibility } : {}),
    },

    pageCount,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater({ pageIndex: page, pageSize }) : updater;
      onPageChange?.(next.pageIndex, next.pageSize);
    },

    onSortingChange: setSorting,

    getRowId: (row) => String(row[rowIdKey]),
    enableRowSelection,
    onRowSelectionChange: enableRowSelection ? onRowSelectionChange : undefined,

    onColumnVisibilityChange: enableColumnVisibility ? onColumnVisibilityChange : undefined,

    getRowCanExpand: enableExpanding ? () => true : undefined,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  if (loading) {
    return (
      <div className='w-full max-w-full'>
        <SkeletonTable />
      </div>
    );
  }

  if (table.getRowModel().rows?.length === 0 && !loading) {
    return (
      <div className='flex flex-col justify-center py-4 h-48'>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <SearchX />
            </EmptyMedia>

            <EmptyTitle className='font-bold uppercase'>Danh sách trống</EmptyTitle>
            <EmptyDescription className='text-white/50'>Không có dữ liệu phù hợp với tiêu chí tìm kiếm</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className={cn("w-full max-w-full", "overflow-x-auto", "scrollbar-custom")}>
        <Table>
          <TableHeader className='top-0 z-30 sticky'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.isPlaceholder) return null;

                  const isLeafColumn = !header.subHeaders || header.subHeaders.length === 0;
                  const canSort = header.column.getCanSort() && isLeafColumn && header.column.id !== INDEX_COLUMN_ID;

                  return (
                    <TableHead key={header.id} colSpan={header.colSpan} rowSpan={header.rowSpan}>
                      <div
                        className={cn(canSort && "flex items-center gap-2 cursor-pointer select-none")}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <span className='ml-auto'>
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp className='w-4 h-4' />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className='w-4 h-4' />
                            ) : (
                              <ArrowUpDown className='opacity-50 w-4 h-4' />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length &&
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(enableExpanding && "cursor-pointer", getRowClassName?.(row.original))}
                    onClick={enableExpanding ? row.getToggleExpandedHandler() : undefined}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ maxWidth: cell.column.columnDef.maxSize }}
                        onClick={cell.column.id === "__expand" ? (e) => e.stopPropagation() : undefined}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>

                  {row.getIsExpanded() && renderExpandedRow && (
                    <TableRow className='bg-slate-50 hover:bg-slate-100' onClick={(e) => e.stopPropagation()}>
                      <TableCell colSpan={row.getVisibleCells().length} className='slide-in-from-top-2 p-4 animate-in duration-200 fade-in'>
                        {renderExpandedRow(row.original)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </div>

      {enablePagination && (
        <div className='flex justify-between items-center'>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <span className='text-sm'>Hiển thị</span>
              <div className='max-w-30'>
                <AppSelect value={String(pageSize)} options={PAGE_SIZE_OPTIONS.map((size) => ({ label: String(size), value: String(size) }))} />
              </div>
              <span className='text-sm'>bản ghi</span>
            </div>
          </div>

          <div className='flex-1'>
            <AppPagination />
          </div>
        </div>
      )}
    </div>
  );
}
