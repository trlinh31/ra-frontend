import type { Flight, FlightDayGroup } from "@/modules/masterData/flights/types/flight.type";
import AppDatePicker from "@/shared/components/common/AppDatePicker";
import { AppTable } from "@/shared/components/common/AppTable";
import { Button } from "@/shared/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import type { ColumnDef } from "@tanstack/react-table";
import { format, formatDate, startOfMonth } from "date-fns";
import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

interface FlightPricingPeriodsTableProps {
  flight: Flight;
}

export default function FlightPricingPeriodsTable({ flight }: FlightPricingPeriodsTableProps) {
  const today = new Date();
  const defaultFrom = format(startOfMonth(today), "yyyy-MM-dd");
  const defaultTo = format(today, "yyyy-MM-dd");

  const [filterFrom, setFilterFrom] = useState<string | null>(defaultFrom);
  const [filterTo, setFilterTo] = useState<string | null>(defaultTo);
  const [openPeriods, setOpenPeriods] = useState<Set<number>>(new Set());

  const filteredPeriods = useMemo(() => {
    if (!filterFrom && !filterTo) return flight.pricingPeriods;
    return flight.pricingPeriods.filter((period) =>
      period.dateRanges.some((dr) => {
        const startsAfterFilterFrom = filterFrom ? dr.from >= filterFrom : true;
        const endsBeforeFilterTo = filterTo ? dr.to <= filterTo : true;
        return startsAfterFilterFrom && endsBeforeFilterTo;
      })
    );
  }, [flight.pricingPeriods, filterFrom, filterTo]);

  const togglePeriod = (idx: number) => {
    setOpenPeriods((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (flight.pricingPeriods.length === 0) {
    return <p className='text-muted-foreground text-sm italic'>Chưa có giai đoạn giá nào.</p>;
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center gap-3'>
        {(filterFrom || filterTo) && (
          <div>
            <Button
              type='button'
              variant='destructive'
              size='sm'
              onClick={() => {
                setFilterFrom(null);
                setFilterTo(null);
              }}>
              Xóa bộ lọc
            </Button>
          </div>
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
          {filteredPeriods.map((period, periodIdx) => {
            const isOpen = openPeriods.has(periodIdx);
            const dateLabel = period.dateRanges
              .map((dr) => `${formatDate(new Date(dr.from), "dd/MM/yyyy")} → ${formatDate(new Date(dr.to), "dd/MM/yyyy")}`)
              .join("  |  ");

            return (
              <Collapsible key={periodIdx} open={isOpen} onOpenChange={() => togglePeriod(periodIdx)}>
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
                      const dgColumns: ColumnDef<FlightDayGroup>[] = [
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
                          header: `Giá (${period.currency}/ người)`,
                          accessorKey: "price",
                          cell: ({ row }) => (row.original.price != null && row.original.price > 0 ? formatNumberVN(row.original.price) : "N/A"),
                        },
                      ];

                      return (
                        <div key={drIdx} className='space-y-1'>
                          <p className='px-1 pb-1 font-medium text-muted-foreground text-sm'>
                            {formatDate(new Date(dr.from), "dd/MM/yyyy")} → {formatDate(new Date(dr.to), "dd/MM/yyyy")}
                          </p>
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
