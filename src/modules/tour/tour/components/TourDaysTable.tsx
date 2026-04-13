import { dayMockStore } from "@/modules/tour/day/data/day.mock-store";
import { SERVICE_TYPE_CONFIG } from "@/modules/tour/day/types/day.type";
import type { Tour } from "@/modules/tour/tour/types/tour.type";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useMemo } from "react";

interface TourDaysTableProps {
  item: Tour;
}

export default function TourDaysTable({ item }: TourDaysTableProps) {
  const allDays = useMemo(() => dayMockStore.getAll(), []);

  const sortedDays = useMemo(() => [...item.days].sort((a, b) => a.order - b.order), [item.days]);

  if (!sortedDays.length) {
    return <p className='px-4 py-3 text-muted-foreground text-sm italic'>Chưa có ngày hành trình nào.</p>;
  }

  // Tính tổng toàn tour
  const tourTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const td of sortedDays) {
      const day = allDays.find((d) => d.id === td.dayId);
      if (!day) continue;
      for (const svc of day.services) {
        if (!svc.unitPrice || !svc.currency) continue;
        totals[svc.currency] = (totals[svc.currency] ?? 0) + svc.unitPrice;
      }
    }
    return totals;
  }, [sortedDays, allDays]);

  return (
    <div className='space-y-3 px-4 py-3'>
      {sortedDays.map((td) => {
        const day = allDays.find((d) => d.id === td.dayId);
        if (!day) return null;

        const dayTotals = day.services.reduce<Record<string, number>>((acc, svc) => {
          if (!svc.unitPrice || !svc.currency) return acc;
          acc[svc.currency] = (acc[svc.currency] ?? 0) + svc.unitPrice;
          return acc;
        }, {});

        return (
          <div key={td.dayId} className='border rounded-md overflow-hidden'>
            <div className='flex justify-between items-center bg-muted px-3 py-2'>
              <span className='font-semibold text-sm'>
                Ngày {td.order}: [{day.code}] {day.title}
              </span>
              <div className='flex items-center gap-2 font-medium text-green-700 text-sm'>
                {Object.entries(dayTotals).map(([cur, total]) => (
                  <span key={cur}>
                    {cur === "VND" ? formatNumberVN(total) : total.toLocaleString()} {cur}
                  </span>
                ))}
              </div>
            </div>
            {day.services.length > 0 && (
              <table className='w-full text-sm'>
                <tbody>
                  {day.services.map((svc, i) => {
                    const config = SERVICE_TYPE_CONFIG[svc.serviceType];
                    return (
                      <tr key={svc.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                        <td className='px-3 py-1.5 w-8 text-muted-foreground text-center'>{i + 1}</td>
                        <td className='px-3 py-1.5 w-36'>
                          <span className='flex items-center gap-1.5 text-muted-foreground'>
                            {config?.icon}
                            {config?.label}
                          </span>
                        </td>
                        <td className='px-3 py-1.5'>{svc.name}</td>
                        <td className='px-3 py-1.5 font-medium text-green-600 text-right whitespace-nowrap'>
                          {svc.unitPrice ? `${formatNumberVN(svc.unitPrice)} ${svc.currency}` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })}

      {/* Tổng toàn tour */}
      <div className='flex justify-end gap-4 px-1 pt-1 border-t font-semibold text-green-700 text-sm'>
        <span>Tổng chi phí tour:</span>
        <span>
          {Object.entries(tourTotals).map(([cur, total], i) => (
            <span key={cur}>
              {i > 0 && " + "}
              {cur === "VND" ? formatNumberVN(total) : total.toLocaleString()} {cur}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
