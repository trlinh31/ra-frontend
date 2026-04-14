import { SERVICE_TYPE_CONFIG } from "@/modules/tour/day/types/day.type";
import type { Tour } from "@/modules/tour/tour/types/tour.type";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useMemo } from "react";

interface TourDaysTableProps {
  item: Tour;
}

export default function TourDaysTable({ item }: TourDaysTableProps) {
  if (!item.itinerary.length) {
    return <p className='px-4 py-3 text-muted-foreground text-sm italic'>Chưa có lịch trình nào.</p>;
  }

  // Tính tổng toàn tour
  const tourTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const entry of item.itinerary) {
      if (entry.kind === "day") {
        for (const svc of entry.services) {
          if (!svc.unitPrice || !svc.currency) continue;
          totals[svc.currency] = (totals[svc.currency] ?? 0) + svc.unitPrice;
        }
      } else {
        if (!entry.unitPrice || !entry.currency) continue;
        totals[entry.currency] = (totals[entry.currency] ?? 0) + entry.unitPrice;
      }
    }
    return totals;
  }, [item.itinerary]);

  return (
    <div className='space-y-3 px-4 py-3'>
      {item.itinerary.map((entry, idx) => {
        if (entry.kind === "group_tour") {
          return (
            <div key={idx} className='border rounded-md overflow-hidden'>
              <div className='flex justify-between items-center bg-blue-50 px-3 py-2'>
                <span className='font-semibold text-sm'>
                  Ngày {idx + 1}: [Nhóm tour] {entry.name}
                </span>
                {entry.unitPrice > 0 && entry.currency && (
                  <span className='font-medium text-green-700 text-sm'>
                    {entry.currency === "VND" ? formatNumberVN(entry.unitPrice) : entry.unitPrice.toLocaleString()} {entry.currency}
                  </span>
                )}
              </div>
            </div>
          );
        }

        const dayTotals = entry.services.reduce<Record<string, number>>((acc, svc) => {
          if (!svc.unitPrice || !svc.currency) return acc;
          acc[svc.currency] = (acc[svc.currency] ?? 0) + svc.unitPrice;
          return acc;
        }, {});

        return (
          <div key={idx} className='border rounded-md overflow-hidden'>
            <div className='flex justify-between items-center bg-muted px-3 py-2'>
              <span className='font-semibold text-sm'>
                Ngày {idx + 1}: [{entry.code}] {entry.title}
              </span>
              <div className='flex items-center gap-2 font-medium text-green-700 text-sm'>
                {Object.entries(dayTotals).map(([cur, total]) => (
                  <span key={cur}>
                    {cur === "VND" ? formatNumberVN(total) : total.toLocaleString()} {cur}
                  </span>
                ))}
              </div>
            </div>
            {entry.services.length > 0 && (
              <table className='w-full text-sm'>
                <tbody>
                  {entry.services.map((svc, i) => {
                    const config = SERVICE_TYPE_CONFIG[svc.serviceType];
                    return (
                      <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
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
