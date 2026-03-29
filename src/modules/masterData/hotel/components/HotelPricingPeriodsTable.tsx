import type { Hotel } from "@/modules/masterData/hotel/types/hotel.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { formatDate } from "date-fns";

interface HotelPricingPeriodsTableProps {
  hotel: Hotel;
}

export default function HotelPricingPeriodsTable({ hotel }: HotelPricingPeriodsTableProps) {
  if (hotel.pricingPeriods.length === 0) {
    return <p className='text-muted-foreground text-sm italic'>Chưa có giai đoạn giá nào.</p>;
  }

  return (
    <Tabs defaultValue={hotel.pricingPeriods[0].id}>
      <TabsList className='flex flex-wrap justify-start gap-1 mb-4 w-full h-auto'>
        {hotel.pricingPeriods.map((period) => {
          const tabLabel = period.dateRanges
            .map((dr) => `${formatDate(new Date(dr.from), "dd/MM")}-${formatDate(new Date(dr.to), "dd/MM")}`)
            .join(", ");

          return (
            <TabsTrigger key={period.id} value={period.id} className='text-xs'>
              Giai đoạn từ ngày {tabLabel}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {hotel.pricingPeriods.map((period) => (
        <TabsContent key={period.id} value={period.id}>
          <div className='overflow-x-auto'>
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
        </TabsContent>
      ))}
    </Tabs>
  );
}
