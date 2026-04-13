import type { EntranceFee } from "@/modules/masterData/entranceFee/types/entrance-fee.type";
import AppDatePicker from "@/shared/components/common/AppDatePicker/AppDatePicker";
import { Button } from "@/shared/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { formatDate } from "date-fns";
import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

interface EntranceFeePricingPeriodsTableProps {
  item: EntranceFee;
}

export default function EntranceFeePricingPeriodsTable({ item }: EntranceFeePricingPeriodsTableProps) {
  const [filterFrom, setFilterFrom] = useState<string | null>(null);
  const [filterTo, setFilterTo] = useState<string | null>(null);
  const [openPeriods, setOpenPeriods] = useState<Set<number>>(new Set());

  const filteredPeriods = useMemo(() => {
    if (!filterFrom && !filterTo) return item.pricingPeriods;
    return item.pricingPeriods.filter((period) =>
      period.dateRanges.some((dr) => {
        const startsBeforeFilterEnd = filterTo ? dr.from <= filterTo : true;
        const endsAfterFilterStart = filterFrom ? dr.to >= filterFrom : true;
        return startsBeforeFilterEnd && endsAfterFilterStart;
      })
    );
  }, [item.pricingPeriods, filterFrom, filterTo]);

  const togglePeriod = (idx: number) => {
    setOpenPeriods((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (item.pricingPeriods.length === 0) {
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
                    {period.dateRanges.map((dr, drIdx) => (
                      <div key={drIdx} className='overflow-x-auto'>
                        <p className='px-1 pb-1 font-medium text-muted-foreground text-sm'>
                          {formatDate(new Date(dr.from), "dd/MM/yyyy")} → {formatDate(new Date(dr.to), "dd/MM/yyyy")}
                        </p>
                        <table className='border border-border w-full text-center'>
                          <thead>
                            <tr className='bg-slate-700 text-primary-foreground'>
                              <th className='px-3 py-3 border border-border font-semibold text-sm text-left'>Nhóm thứ</th>
                              <th className='px-3 py-3 border border-border font-semibold text-sm text-left'>Ngày áp dụng</th>
                              <th className='px-3 py-3 border border-border min-w-36 font-semibold text-sm'>Người lớn ({period.currency})</th>
                              <th className='px-3 py-3 border border-border min-w-36 font-semibold text-sm'>Trẻ em ({period.currency})</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dr.dayGroups.map((dg, dgIdx) => (
                              <tr key={dgIdx} className='even:bg-muted/40'>
                                <td className='px-3 py-3 border border-border font-medium text-sm text-left'>{dg.label}</td>
                                <td className='px-3 py-3 border border-border text-sm text-left'>
                                  {dg.days
                                    .slice()
                                    .sort((a, b) => a - b)
                                    .map((d) => ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][d])
                                    .join(", ")}
                                </td>
                                <td className='px-3 py-3 border border-border text-sm'>
                                  {dg.adultPrice != null && dg.adultPrice > 0 ? formatNumberVN(dg.adultPrice) : "N/A"}
                                </td>
                                <td className='px-3 py-3 border border-border text-sm'>
                                  {dg.childPrice != null && dg.childPrice > 0 ? formatNumberVN(dg.childPrice) : "N/A"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
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
