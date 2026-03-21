// import AppButton from "@/shared/components/common/AppButton";
// import AppPagination from "@/shared/components/common/AppPagination";
// import AppSelect from "@/shared/components/common/AppSelect";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/shared/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { DEFAULT_PAGE_SIZE } from "@/shared/constants/pagination.constant";
import { cn } from "@/shared/lib/utils";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
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

  const resolvedColumns = useMemo(() => {
    return selectColumn ? [selectColumn, ...columns] : columns;
  }, [selectColumn, columns]);

  const getStickyStyle = (meta: { sticky?: "left" | "right"; stickyOffset?: number } | undefined) => {
    if (!meta?.sticky) return {};

    const styles: React.CSSProperties = {
      position: "sticky",
      zIndex: 20,
    };

    if (meta.sticky === "left") {
      styles.left = meta.stickyOffset ?? 0;
    } else if (meta.sticky === "right") {
      styles.right = meta.stickyOffset ?? 0;
    }

    return styles;
  };

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

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
    <div className='space-y-2'>
      <div className={cn("w-full max-w-full", "overflow-x-auto", "scrollbar-custom")}>
        <Table>
          <TableHeader className='top-0 z-30 sticky'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isLeafColumn = !header.subHeaders || header.subHeaders.length === 0;
                  const canSort = header.column.getCanSort() && isLeafColumn && header.column.id !== INDEX_COLUMN_ID;

                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
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
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length &&
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className={getRowClassName?.(row.original)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={{ maxWidth: cell.column.columnDef.maxSize }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* {onPageChange && (
        <div className='flex items-center'>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <span>Hiển thị</span>
              <div className='max-w-[120px]'>
                <AppSelect
                  value={String(pageSize)}
                  onValueChange={(value) => onPageChange(1, Number(value))}
                  options={PAGE_SIZE_OPTIONS.map((size) => ({ label: String(size), value: String(size) }))}
                />
              </div>
              <span>bản ghi</span>
            </div>
          </div>

          <div className='flex-1'>
            <AppPagination page={page} totalPages={pageCount} onPageChange={(page) => onPageChange(page, pageSize)} />
          </div>
        </div>
      )} */}
    </div>
  );
}
