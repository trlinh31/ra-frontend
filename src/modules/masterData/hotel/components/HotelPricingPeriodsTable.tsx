import type { DayGroup, Hotel } from "@/modules/masterData/hotel/types/hotel.type";
import AppDatePicker from "@/shared/components/common/AppDatePicker/AppDatePicker";
import { AppTable } from "@/shared/components/common/AppTable";
import { Button } from "@/shared/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { format, formatDate, startOfMonth } from "date-fns";
import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

interface HotelPricingPeriodsTableProps {
  hotel: Hotel;
}

export default function HotelPricingPeriodsTable({ hotel }: HotelPricingPeriodsTableProps) {
  const today = new Date();
  const defaultFrom = format(startOfMonth(today), "yyyy-MM-dd");
  const defaultTo = format(today, "yyyy-MM-dd");

  const [filterFrom, setFilterFrom] = useState<string | null>(defaultFrom);
  const [filterTo, setFilterTo] = useState<string | null>(defaultTo);
  const [openPeriods, setOpenPeriods] = useState<Set<string>>(new Set());

  const filteredPeriods = useMemo(() => {
    if (!filterFrom && !filterTo) return hotel.pricingPeriods;
    return hotel.pricingPeriods.filter((period) =>
      period.dateRanges.some((dr) => {
        const startsAfterFilterFrom = filterFrom ? dr.from >= filterFrom : true;
        const endsBeforeFilterTo = filterTo ? dr.to <= filterTo : true;
        return startsAfterFilterFrom && endsBeforeFilterTo;
      })
    );
  }, [hotel.pricingPeriods, filterFrom, filterTo]);

  const togglePeriod = (id: string) => {
    setOpenPeriods((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (hotel.pricingPeriods.length === 0) {
    return <p className='text-muted-foreground text-sm italic'>Chưa có giai đoạn giá nào.</p>;
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center gap-3'>
        {(filterFrom || filterTo) && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => {
              setFilterFrom(null);
              setFilterTo(null);
            }}>
            Xóa bộ lọc
          </Button>
        )}

        <span className='font-medium text-sm'>Tìm kiếm theo ngày:</span>

        <div className='flex items-center gap-2'>
          <AppDatePicker value={filterFrom} onChange={setFilterFrom} placeholder='Từ ngày' />
          <span className='text-muted-foreground text-sm'>→</span>
          <AppDatePicker value={filterTo} onChange={setFilterTo} placeholder='Đến ngày' />
        </div>
      </div>

      {filteredPeriods.length === 0 ? (
        <p className='text-muted-foreground text-sm text-center italic'>Không có giai đoạn giá nào phù hợp.</p>
      ) : (
        <div className='space-y-2'>
          {filteredPeriods.map((period) => {
            const isOpen = openPeriods.has(period.id);
            const dateLabel = period.dateRanges
              .map((dr) => `${formatDate(new Date(dr.from), "dd/MM/yyyy")} → ${formatDate(new Date(dr.to), "dd/MM/yyyy")}`)
              .join("  |  ");

            return (
              <Collapsible key={period.id} open={isOpen} onOpenChange={() => togglePeriod(period.id)}>
                <CollapsibleTrigger asChild>
                  <button
                    type='button'
                    className='flex justify-between items-center bg-white hover:bg-white/50 px-4 py-3 rounded-lg w-full text-left transition-colors'>
                    <p className='flex items-center gap-2 font-medium text-sm'>
                      <CalendarDays className='w-4 h-4' /> {dateLabel}
                    </p>
                    {isOpen ? <ChevronUp className='w-4 h-4 text-muted-foreground' /> : <ChevronDown className='w-4 h-4 text-muted-foreground' />}
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className='space-y-3 mt-2'>
                    {period.dateRanges.map((dr, drIdx) => {
                      const dgColumns: ColumnDef<DayGroup>[] = [
                        {
                          header: "Loại phòng",
                          accessorKey: "roomTypeId",
                          cell: ({ row }) => {
                            const rt = hotel.roomTypes.find((r) => r.id === row.original.roomTypeId);
                            return rt?.name ?? <span className='text-muted-foreground italic'>—</span>;
                          },
                        },
                        { header: "Nhóm thứ", accessorKey: "label" },
                        {
                          header: "Ngày áp dụng",
                          accessorKey: "days",
                          enableSorting: false,
                          cell: ({ row }) =>
                            row.original.days
                              .slice()
                              .sort((a, b) => a - b)
                              .map((d) => ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][d])
                              .join(", "),
                        },
                        {
                          header: `Giá (${period.currency}/ đêm)`,
                          accessorKey: "price",
                          cell: ({ row }) => (row.original.price != null && row.original.price > 0 ? formatNumberVN(row.original.price) : "N/A"),
                        },
                      ];

                      return (
                        <div key={drIdx}>
                          <AppTable columns={dgColumns} data={dr.dayGroups} enablePagination={false} />
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}
    </div>
  );
}
