import FlightPricingForm from "@/modules/masterData/flights/components/FlightPricingForm";
import FlightSeatClassSection from "@/modules/masterData/flights/components/FlightSeatClassSection";
import { mapFlightDataToFormValues } from "@/modules/masterData/flights/mappers/flight-form.mapper";
import type { Flight } from "@/modules/masterData/flights/types/flight.type";
import Section from "@/shared/components/common/Section";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea";
import FormTimeInput from "@/shared/components/form/FormTimeInput/FormTimeInput";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useCountries } from "../../country/hooks/useCountries";
import { supplierMockStore } from "../../supplier/data/supplier.mock-store";
import { flightSchema, type FlightFormValues } from "../schemas/flight.schema";

interface FlightFormProps {
  defaultValues?: Flight | undefined;
  onSubmit: (values: FlightFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export default function FlightForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: FlightFormProps) {
  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightSchema),
    defaultValues: mapFlightDataToFormValues(defaultValues),
  });
  const { data: countries } = useCountries();

  useEffect(() => {
    if (defaultValues) {
      form.reset(mapFlightDataToFormValues(defaultValues));
    }
  }, [defaultValues, countries]);

  const fromCountry = form.watch("fromCountry");
  const toCountry = form.watch("toCountry");

  const countryOptions = useMemo(
    () =>
      countries?.map((c) => ({
        label: c.country,
        value: c.country,
      })) ?? [],
    [countries]
  );

  const cityFromOptions = countries?.find((c) => c.country === fromCountry)?.cities.map((city) => ({ label: city, value: city })) ?? [];
  const cityToOptions = countries?.find((c) => c.country === toCountry)?.cities.map((city) => ({ label: city, value: city })) ?? [];

  const suppliersOptions = useMemo(() => supplierMockStore.getAll().map((supplier) => ({ label: supplier.name, value: supplier.name })), []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <Section title='1. Thông tin cơ bản'>
          <div className='gap-4 grid'>
            <FormSelect name='provider' options={suppliersOptions} label='Nhà cung cấp' required />
            <div className='gap-4 grid grid-cols-2 sm:grid-cols-2'>
              <div>
                <div className='mb-2 text-muted-foreground text-sm'>Điểm khởi hành</div>
                <FormSelect name='fromCountry' options={countryOptions} label='Quốc gia' required className='mb-2' />
                <FormSelect name='fromCity' options={cityFromOptions} label='Thành phố' disabled={!fromCountry} required className='mb-2' />
                <FormInput name='origin' label='Mã điểm khởi hành' required />
              </div>
              <div>
                <div className='mb-2 text-muted-foreground text-sm'>Điểm đến</div>
                <FormSelect name='toCountry' options={countryOptions} label='Quốc gia' required className='mb-2' />
                <FormSelect name='toCity' options={cityToOptions} label='Thành phố' disabled={!toCountry} required className='mb-2' />
                <FormInput name='destination' label='Mã điểm đến' required />
              </div>
            </div>
            <div className='flex gap-4'>
              <FormInput name='airline' label='Hãng bay' required />
              <FormTimeInput name='flightTime' label='Thời gian bay' required />
            </div>

            <FormTextarea name='notes' label='Ghi chú' />
          </div>
        </Section>

        <FlightSeatClassSection />

        <Section title='3. Bảng giá'>
          <FlightPricingForm />
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
