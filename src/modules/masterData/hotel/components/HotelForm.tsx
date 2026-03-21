import RoomForm from "@/modules/masterData/hotel/components/RoomForm";
import { HOTEL_RATE_OPTIONS } from "@/modules/masterData/hotel/constants/hotelRateOptions.constant";
import { mapHotelDataToFormValues } from "@/modules/masterData/hotel/mappers/hotel-form.mapper";
import type { Hotel } from "@/modules/masterData/hotel/types/hotel.type";
import { countryApi } from "@/shared/api/country/country.api";
import Section from "@/shared/components/common/Section";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import FormSwitch from "@/shared/components/form/FormSwitch/FormSwitch";
import FormTextarea from "@/shared/components/form/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import type { Country } from "@/shared/types/country/country.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { hotelSchema, type HotelFormValues } from "../schemas/hotel.schema";

type HotelFormProps = {
  defaultValues?: Hotel | undefined;
  onSubmit: (values: HotelFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
};

export default function HotelForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: HotelFormProps) {
  const [countries, setCountries] = useState<Country[]>([]);

  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema) as Resolver<HotelFormValues>,
    defaultValues: mapHotelDataToFormValues(defaultValues),
  });

  const fetchCountries = async () => {
    try {
      const res = await countryApi.getCountries();
      setCountries(res.data);
    } catch {
      setCountries([]);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const countriesOptions = useMemo(() => countries.map((country) => ({ label: country.country, value: country.country })), [countries]);

  const citiesOptions = useMemo(() => {
    const selectedCountry = countries.find((c) => c.country === form.watch("country"));
    return selectedCountry ? selectedCountry.cities.map((city) => ({ label: city, value: city })) : [];
  }, [countries, form.watch("country")]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
          <FormInput name='name' label='Tên khách sạn' required />

          <FormSelect name='rate' options={HOTEL_RATE_OPTIONS} label='Đánh giá' required />

          <FormSelect name='country' options={countriesOptions} label='Quốc gia' required />

          <FormSelect name='city' options={citiesOptions} label='Thành phố' disabled={!form.watch("country")} required />

          <FormTextarea name='notes' label='Ghi chú' />

          <FormSwitch name='isActive' label='Hoạt động' />

          <Section title='Thông tin phòng khách sạn' className='col-span-2'>
            <RoomForm />
          </Section>

          {form.formState.errors.rooms?.message && <p className='font-normal text-destructive text-sm'>{form.formState.errors.rooms.message}</p>}
        </div>

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
