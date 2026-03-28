import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import RoomCategoryForm from "@/modules/masterData/hotel/components/RoomCategoryForm";
import RoomForm from "@/modules/masterData/hotel/components/RoomForm";
import { HOTEL_RATE_OPTIONS } from "@/modules/masterData/hotel/constants/hotel-rate-options.constant";
import { mapHotelDataToFormValues } from "@/modules/masterData/hotel/mappers/hotel-form.mapper";
import { hotelSchema, type HotelFormValues } from "@/modules/masterData/hotel/schemas/hotel.schema";
import type { Hotel } from "@/modules/masterData/hotel/types/hotel.type";
import { supplierMockStore } from "@/modules/masterData/supplier/data/supplier.mock-store";
import Section from "@/shared/components/common/Section";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import FormSwitch from "@/shared/components/form/FormSwitch/FormSwitch";
import FormTextarea from "@/shared/components/form/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { FieldError } from "@/shared/components/ui/field";
import { Form } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

type HotelFormProps = {
  defaultValues?: Hotel | undefined;
  onSubmit: (values: HotelFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
};

export default function HotelForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: HotelFormProps) {
  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: mapHotelDataToFormValues(defaultValues),
  });

  const { data: countries } = useCountries();
  const { data: cities } = useCities(form.watch("country") || "");

  const countriesOptions = useMemo(() => (countries ?? []).map((item) => ({ label: item.country, value: item.country })), [countries]);
  const citiesOptions = useMemo(() => (cities ?? []).map((city) => ({ label: city, value: city })), [cities]);
  const suppliersOptions = useMemo(() => supplierMockStore.getAll().map((supplier) => ({ label: supplier.name, value: supplier.name })), []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <Section title='1. Thông tin cơ bản'>
          <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
            <FormSelect name='country' options={countriesOptions} label='Quốc gia' required />
            <FormInput name='code' label='Mã khách sạn' placeholder='VD: HO123' required />
            <FormSelect name='city' options={citiesOptions} label='Thành phố' disabled={!form.watch("country")} required />
            <FormInput name='name' label='Tên khách sạn' placeholder='VD: Khách sạn ABC' required />
            <FormInput name='address' label='Địa chỉ' placeholder='VD: 123 Đường ABC, Quận XYZ' required />
            <FormSelect name='supplier' options={suppliersOptions} label='Nhà cung cấp' required />
          </div>
        </Section>

        <Section title='2. Danh sách loại phòng'>
          <RoomCategoryForm />
          {form.formState.errors.roomCategories?.message && <FieldError errors={[form.formState.errors.roomCategories]} />}
        </Section>

        <Section title='3. Thông tin phòng'>
          <div className='space-y-4'>
            <RoomForm />
            {form.formState.errors.rooms?.message && <FieldError errors={[form.formState.errors.rooms]} />}
          </div>
        </Section>

        <Section title='4. Thông tin bổ sung'>
          <div className='gap-4 grid grid-cols-1'>
            <div className='max-w-50'>
              <FormSelect name='rate' options={HOTEL_RATE_OPTIONS} label='Hạng sao' placeholder='Chọn hạng sao' required />
            </div>
            <FormTextarea name='note' label='Ghi chú' />
            <FormSwitch name='isActive' label='Hoạt động' />
          </div>
        </Section>

        <div className='flex justify-start gap-3'>
          <Button type='button' variant='outline' size='lg' onClick={onCancel}>
            Hủy
          </Button>

          <Button type='submit' size='lg' disabled={isSubmitting}>
            <Save />
            {isEdit ? "Cập nhật" : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
