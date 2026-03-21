import VehicleCapacityPriceForm from "@/modules/masterData/transportation/components/VehicleCapacityPriceForm";
import { mapTransportRouteDataToFormValues } from "@/modules/masterData/transportation/mappers/transport-route-form.mapper";
import { transportRouteSchema, type TransportRouteFormValues } from "@/modules/masterData/transportation/schemas/transport-route.schema";
import type { TransportRoute } from "@/modules/masterData/transportation/types/transportation.type";
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
import { useForm } from "react-hook-form";

interface TransportRouteFormProps {
  defaultValues?: TransportRoute | undefined;
  onSubmit: (values: TransportRouteFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export default function TransportRouteForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: TransportRouteFormProps) {
  const [countries, setCountries] = useState<Country[]>([]);

  const form = useForm<TransportRouteFormValues>({
    resolver: zodResolver(transportRouteSchema),
    defaultValues: mapTransportRouteDataToFormValues(defaultValues),
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

          <FormSelect name='country' options={countriesOptions} label='Quốc gia' required />

          <FormSelect name='startLocation' options={citiesOptions} label='Điểm xuất phát' required />

          <FormSelect name='endLocation' options={citiesOptions} label='Điểm đến' required />

          <FormTextarea name='notes' label='Ghi chú' />

          <FormSwitch name='isActive' label='Hoạt động' />

          <Section title='Thông tin Giá theo loại xe' className='col-span-2'>
            <VehicleCapacityPriceForm />
          </Section>
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
