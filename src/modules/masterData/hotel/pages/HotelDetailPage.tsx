import { hotelMockStore } from "@/modules/masterData/hotel/data/hotel.mock-store";
import { getRangeLabel, transformData } from "@/modules/masterData/hotel/helpers/groupRoom";
import AppInput from "@/shared/components/common/AppInput";
import PageHeader from "@/shared/components/common/PageHeader";
import Section from "@/shared/components/common/Section";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();

  const hotel = id ? hotelMockStore.getById(id) : undefined;

  if (!hotel) return null;

  const dataSource = useMemo(() => transformData(hotel.rooms), [hotel.rooms]);

  const rangeColumns = useMemo(() => {
    const set = new Set<string>();

    hotel.rooms.forEach((item) => {
      set.add(getRangeLabel(item.startDate, item.endDate));
    });

    return Array.from(set);
  }, [hotel.rooms]);

  return (
    <div className='space-y-6'>
      <PageHeader title='Chi tiết Khách sạn' description='Xem thông tin chi tiết của Khách sạn' />

      <Section title='1. Thông tin cơ bản'>
        <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
          <AppInput value={hotel.country} label='Quốc gia' readOnly />
          <AppInput value={hotel.code} label='Mã khách sạn' readOnly />
          <AppInput value={hotel.city} label='Thành phố' readOnly />
          <AppInput value={hotel.name} label='Tên khách sạn' readOnly />
          <AppInput value={hotel.address} label='Địa chỉ' readOnly />
          <AppInput value={hotel.supplier} label='Nhà cung cấp' readOnly />
        </div>
      </Section>

      <Section title='2. Thông tin phòng'>
        <div className='overflow-x-auto'>
          <table className='border border-border w-full text-center'>
            <thead>
              <tr className='bg-blue-700 text-primary-foreground'>
                <th className='px-3 py-3 border border-border font-semibold text-sm' rowSpan={2}>
                  STT
                </th>
                <th className='px-3 py-3 border border-border font-semibold text-sm' rowSpan={2}>
                  Hạng phòng
                </th>
                <th className='px-3 py-3 border border-border font-semibold text-sm' rowSpan={2}>
                  Số lượng
                </th>
                <th className='px-3 py-3 border border-border font-semibold text-sm' rowSpan={2}>
                  Diện tích
                </th>
                <th className='px-3 py-3 border border-border font-semibold text-sm' rowSpan={2}>
                  Ghi chú
                </th>
                <th className='px-3 py-3 border border-border font-semibold text-sm' colSpan={rangeColumns.length}>
                  Giá phòng ưu đãi
                </th>
              </tr>

              <tr className='bg-blue-700 text-primary-foreground'>
                {rangeColumns.map((col) => (
                  <th key={col} className='px-3 py-3 border border-border font-semibold text-sm'>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {dataSource.map((row, index) => (
                <tr key={row.key} className='even:bg-muted/40'>
                  <td className='px-3 py-3 border border-border text-sm'>{index + 1}</td>
                  <td className='px-3 py-3 border border-border text-sm'>{row.name}</td>
                  <td className='px-3 py-3 border border-border text-sm'>{row.quantity}</td>
                  <td className='px-3 py-3 border border-border text-sm'>{row.area}m²</td>
                  <td className='px-3 py-3 border border-border text-sm'>{row.note}</td>

                  {rangeColumns.map((day) => (
                    <td key={day} className='px-3 py-3 border border-border text-sm'>
                      {row.prices?.[day] ? `${formatNumberVN(row.prices[day])} ${row.currency}` : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title='3. Thông tin khác'>
        <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
          <AppInput value={hotel.rate} label='Hạng sao' readOnly />
          <AppInput value={hotel.note} label='Ghi chú' readOnly />
        </div>
      </Section>
    </div>
  );
}
