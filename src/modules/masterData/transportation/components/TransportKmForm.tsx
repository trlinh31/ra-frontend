import { countryApi } from "@/modules/masterData/country/api/country.api";
import { TRANSPORT_CATEGORY_OPTIONS } from "@/modules/masterData/transportation/constants/transport-category-options.constant";
import { mapTransportKmDataToFormValues } from "@/modules/masterData/transportation/mappers/transport-km-form.mapper";
import type { TransportKm } from "@/modules/masterData/transportation/types/transportation.type";
import FormCurrenctyInput from "@/shared/components/form/FormCurrenctyInput";
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
import { useForm } from "react-hook-form";
import { TransportKmSchema, type TransportKmFormValues } from "../schemas/transport-km.schema";

interface TransportKmFormProps {
  defaultValues?: TransportKm | undefined;
  onSubmit: (values: TransportKmFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export default function TransportKmForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: TransportKmFormProps) {
  const [countries, setCountries] = useState<Country[]>([]);

  const form = useForm<TransportKmFormValues>({
    resolver: zodResolver(TransportKmSchema),
    defaultValues: mapTransportKmDataToFormValues(defaultValues),
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
          <FormInput name='code' label='Mã phí vận chuyển' required />

          <FormSelect name='category' options={TRANSPORT_CATEGORY_OPTIONS} label='Loại vận chuyển' required />

          <FormSelect name='country' options={countriesOptions} label='Quốc gia' required />

          <FormSelect name='city' options={citiesOptions} label='Thành phố' disabled={!form.watch("country")} required />

          <FormCurrenctyInput name='km' label='Số Kilômét' required />

          <FormCurrenctyInput name='price' label='Giá tiền' required />

          <FormTextarea name='notes' label='Ghi chú' />

          <FormSwitch name='isActive' label='Hoạt động' />
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
