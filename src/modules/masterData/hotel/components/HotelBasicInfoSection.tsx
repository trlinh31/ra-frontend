import { HOTEL_RATE_OPTIONS } from "@/modules/masterData/hotel/constants/hotel-rate-options.constant";
import type { HotelFormValues } from "@/modules/masterData/hotel/schemas/hotel.schema";
import { supplierMockStore } from "@/modules/masterData/supplier/data/supplier.mock-store";
import Section from "@/shared/components/common/Section";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

export default function HotelBasicInfoSection() {
  useFormContext<HotelFormValues>();

  const suppliersOptions = useMemo(() => supplierMockStore.getAll().map((supplier) => ({ label: supplier.name, value: supplier.name })), []);

  return (
    <Section title='2. Thông tin cơ bản'>
      <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
        <FormInput name='code' label='Mã khách sạn' placeholder='VD: HT123' required />
        <FormInput name='name' label='Tên khách sạn' placeholder='VD: Khách sạn ABC' required />
        <FormSelect name='supplier' options={suppliersOptions} label='Nhà cung cấp' required />
        <FormSelect name='rate' options={HOTEL_RATE_OPTIONS} label='Hạng sao' placeholder='Chọn hạng sao' required />
      </div>
    </Section>
  );
}
