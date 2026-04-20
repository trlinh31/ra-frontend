import { SERVICE_TYPE_CONFIG, type Day, type DayService } from "@/modules/tour/day/types/day.type";
import { AppTable } from "@/shared/components/common/AppTable";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";

interface DayServicesTableProps {
  item: Day;
}

export default function DayServicesTable({ item }: DayServicesTableProps) {
  if (!item.services.length) {
    return <p className='px-4 py-3 text-muted-foreground text-sm italic'>Chưa có dịch vụ nào.</p>;
  }

  const columns: ColumnDef<DayService>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1, enableSorting: false },
    {
      header: "Loại dịch vụ",
      accessorKey: "serviceType",
      cell: ({ row }) => {
        const config = SERVICE_TYPE_CONFIG[row.original.serviceType];
        return (
          <span className='flex items-center gap-1.5'>
            {config?.icon}
            {config?.label ?? row.original.serviceType}
          </span>
        );
      },
    },
    { header: "Tên dịch vụ", accessorKey: "name" },
    {
      header: "Đơn giá",
      accessorKey: "unitPrice",
      cell: ({ row }) => {
        const svc = row.original;
        return (
          <div className='font-medium text-green-600 text-right'>
            {svc.unitPrice ? (
              `${formatNumberVN(svc.unitPrice)} ${svc.currency}`
            ) : (
              <span className='font-normal text-muted-foreground italic'>Chưa có</span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className='px-4 py-3'>
      <AppTable
        columns={columns}
        data={item.services}
        enablePagination={false}
        renderFooter={(services) => {
          const byCurrency = services.reduce<Record<string, number>>((acc, svc) => {
            if (!svc.unitPrice || !svc.currency) return acc;
            acc[svc.currency] = (acc[svc.currency] ?? 0) + svc.unitPrice;
            return acc;
          }, {});
          const entries = Object.entries(byCurrency);
          return (
            <TableRow>
              <TableCell colSpan={3} className='font-semibold text-right'>
                Tổng cộng
              </TableCell>
              <TableCell className='font-semibold text-green-700 text-right'>
                {entries.length ? entries.map(([cur, total]) => `${formatNumberVN(total)} ${cur}`).join(" + ") : (
                  <span className='font-normal text-muted-foreground italic'>—</span>
                )}
              </TableCell>
            </TableRow>
          );
        }}
      />
    </div>
  );
}
