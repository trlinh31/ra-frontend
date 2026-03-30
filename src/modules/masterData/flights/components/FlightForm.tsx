import { mapFlightDataToFormValues } from "@/modules/masterData/flights/mappers/flight-form.mapper";
import type { Flight } from "@/modules/masterData/flights/types/flight.type";
import FlightCodeInput from "@/shared/components/common/FlightCodeInput";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormInput from "@/shared/components/form/FormInput";
import FormSwitch from "@/shared/components/form/FormSwitch/FormSwitch";
import FormTextarea from "@/shared/components/form/FormTextarea";
import FormTimeInput from "@/shared/components/form/FormTimeInput/FormTimeInput";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { flightSchema, type FlightFormValues } from "../schemas/flight.schema";
import FormSelect from "@/shared/components/form/FormSelect";
import { useCountries } from "../../country/hooks/useCountries";
import { VISA_PRICE_UNIT_OPTIONS } from "../../visaFastTrack/constants/visa-price-unit-options.constant";
import { useEffect, useMemo, useState } from "react";
import { supplierMockStore } from "../../supplier/data/supplier.mock-store";
import type { Country } from "@/shared/types/country/country.type";
import { CURRENCY_OPTIONS } from "@/shared/constants/currency.constant";

interface FlightFormProps {
  defaultValues?: Flight | undefined;
  onSubmit: (values: FlightFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export default function FlightForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: FlightFormProps) {
  
  console.log(defaultValues);
  
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
  console.log(fromCountry);
  
  const toCountry = form.watch("toCountry");

 const countryOptions = useMemo(
  () => countries?.map((c) => ({
    label: c.country,
    value: c.country
  })) ?? [],
  [countries]
);

  const cityFromOptions = countries?.find((c) => c.country === fromCountry)?.cities.map((city) => ({ label: city, value: city })) ?? [];
  const cityToOptions = countries?.find((c) => c.country === toCountry)?.cities.map((city) => ({ label: city, value: city })) ?? [];
  
  const suppliersOptions = useMemo(() => supplierMockStore.getAll().map((supplier) => ({ label: supplier.name, value: supplier.name })), []);
   
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='gap-4 grid'>
          <FormSelect name='provider' options={suppliersOptions} label='Nhà cung cấp' required />
          <Section className='grid grid-cols-2 sm:grid-cols-2 gap-4'> 
            <Section >     
              <div className='text-sm text-muted-foreground mb-2'>Điểm khởi hành</div>
              <FormSelect name='fromCountry' options={countryOptions} label='Quốc gia' required className="mb-2"/>
              <FormSelect name='fromCity' options={cityFromOptions} label='Thành phố' disabled={!fromCountry} required  className="mb-2"/>
              <FormInput name='origin' label='Mã điểm khởi hành' required  className="mb-2"/>
            </Section>
            <Section>  
              <div className='text-sm text-muted-foreground mb-2'>Điểm đến</div>
              <FormSelect name='toCountry' options={countryOptions} label='Quốc gia' required className="mb-2"/>
              <FormSelect name='toCity' options={cityToOptions} label='Thành phố' disabled={!toCountry} required className="mb-2"/>
              <FormInput name='destination' label='Mã điểm đến' required className="mb-2"/>
            </Section>
          </Section>
          <div className="flex gap-4">
            <FormInput name='airline' label='Hãng bay' required />

            <FormTimeInput name='flightTime' label='Thời gian bay' required />
          </div>
          <div className="flex gap-4">
            <FormCurrencyInput name='price' label='Giá bay' required />

            <FormSelect name='unitPrice' options={CURRENCY_OPTIONS} label='Đơn vị tiền tệ' required />
          </div>

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
