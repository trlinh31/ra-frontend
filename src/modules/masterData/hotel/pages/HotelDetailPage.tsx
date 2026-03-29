import HotelPricingPeriodsTable from "@/modules/masterData/hotel/components/HotelPricingPeriodsTable";
import { hotelMockStore } from "@/modules/masterData/hotel/data/hotel.mock-store";
import AppInput from "@/shared/components/common/AppInput";
import AppTextarea from "@/shared/components/common/AppTextarea";
import PageHeader from "@/shared/components/common/PageHeader";
import Section from "@/shared/components/common/Section";
import { useParams } from "react-router-dom";

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();

  const hotel = id ? hotelMockStore.getById(id) : undefined;

  if (!hotel) return null;

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
          <div className='flex gap-4'>
            <AppInput value={hotel.supplier} label='Nhà cung cấp' readOnly />
            <AppInput value={String(hotel.rate)} label='Hạng sao' readOnly />
          </div>
        </div>
      </Section>

      <Section title='2. Thông tin phòng & bảng giá'>
        <HotelPricingPeriodsTable hotel={hotel} />
      </Section>

      <Section title='3. Thông tin khác'>
        <div className='gap-4 grid grid-cols-1'>
          <AppTextarea value={hotel.note} label='Ghi chú' readOnly />
        </div>
      </Section>
    </div>
  );
}
