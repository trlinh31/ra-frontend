import type { Hotel } from "@/modules/masterData/hotel/types/hotel.type";
import AppDatePicker from "@/shared/components/common/AppDatePicker/AppDatePicker";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { formatDate } from "date-fns";
import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

interface HotelPricingPeriodsTableProps {
  hotel: Hotel;
}

export default function HotelPricingPeriodsTable({ hotel }: HotelPricingPeriodsTableProps) {
  const [filterFrom, setFilterFrom] = useState<string | null>(null);
  const [filterTo, setFilterTo] = useState<string | null>(null);
  const [openPeriods, setOpenPeriods] = useState<Set<string>>(new Set());

  const filteredPeriods = useMemo(() => {
    if (!filterFrom && !filterTo) return hotel.pricingPeriods;
    return hotel.pricingPeriods.filter((period) =>
      period.dateRanges.some((dr) => {
        const startsBeforeFilterEnd = filterTo ? dr.from <= filterTo : true;
        const endsAfterFilterStart = filterFrom ? dr.to >= filterFrom : true;
        return startsBeforeFilterEnd && endsAfterFilterStart;
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
        <span className='font-medium text-sm'>Tìm kiếm theo ngày:</span>
        <div className='flex items-center gap-2'>
          <AppDatePicker value={filterFrom} onChange={setFilterFrom} placeholder='Từ ngày' />
          <span className='text-muted-foreground text-sm'>→</span>
          <AppDatePicker value={filterTo} onChange={setFilterTo} placeholder='Đến ngày' />
        </div>

        {/* {(filterFrom || filterTo) && (
          <div>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => {
                setFilterFrom(null);
                setFilterTo(null);
              }}>
              Xóa bộ lọc
            </Button>
          </div>
        )} */}
      </div>

      {filteredPeriods.length === 0 ? (
        <p className='text-muted-foreground text-sm italic'>Không có giai đoạn giá nào phù hợp.</p>
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
                  <div className='mt-2 overflow-x-auto'>
                    <table className='border border-border w-full text-center'>
                      <thead>
                        <tr className='bg-slate-700 text-primary-foreground'>
                          <th className='px-3 py-3 border border-border font-semibold text-sm' rowSpan={2}>
                            STT
                          </th>
                          <th className='px-3 py-3 border border-border font-semibold text-sm text-left' rowSpan={2}>
                            Hạng phòng
                          </th>
                          <th className='px-3 py-3 border border-border font-semibold text-sm' rowSpan={2}>
                            Số khách
                          </th>
                          <th className='px-3 py-3 border border-border font-semibold text-sm text-left' rowSpan={2}>
                            Ghi chú
                          </th>
                          <th className='px-3 py-3 border border-border font-semibold text-sm' colSpan={period.dayGroups.length}>
                            Giá phòng ưu đãi ({period.currency}/ phòng/ đêm)
                          </th>
                        </tr>
                        <tr className='bg-slate-700 text-primary-foreground'>
                          {period.dayGroups.map((dg) => (
                            <th key={dg.id} className='px-3 py-3 border border-border min-w-36 font-semibold text-sm'>
                              {dg.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {hotel.roomTypes.map((roomType, index) => {
                          const roomPricing = period.prices.find((p) => p.roomTypeId === roomType.id);
                          return (
                            <tr key={roomType.id} className='even:bg-muted/40'>
                              <td className='px-3 py-3 border border-border text-sm'>{index + 1}</td>
                              <td className='px-3 py-3 border border-border font-medium text-sm text-left'>{roomType.name}</td>
                              <td className='px-3 py-3 border border-border text-sm'>{roomType.maxGuests}</td>
                              <td className='px-3 py-3 border border-border text-sm text-left'>{roomType.note}</td>
                              {period.dayGroups.map((dg, dgIdx) => {
                                const price = roomPricing?.dayGroupPrices[dgIdx]?.price;
                                return (
                                  <td key={dg.id} className='px-3 py-3 border border-border text-sm'>
                                    {price != null && price > 0 ? formatNumberVN(price) : "N/A"}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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
