import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { supplierMockStore } from "@/modules/masterData/supplier/data/supplier.mock-store";
import VehicleCapacityPriceForm from "@/modules/masterData/transportation/components/VehicleCapacityPriceForm";
import { mapTransportationDataToFormValues } from "@/modules/masterData/transportation/mappers/transportation-form.mapper";
import { transportationSchema, type TransportationFormValues } from "@/modules/masterData/transportation/schemas/transportation.schema";
import type { Transportation } from "@/modules/masterData/transportation/types/transportation.type";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

interface TransportationFormProps {
  defaultValues?: Transportation;
  onSubmit: (values: TransportationFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export default function TransportationForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: TransportationFormProps) {
  const form = useForm<TransportationFormValues>({
    resolver: zodResolver(transportationSchema),
    defaultValues: mapTransportationDataToFormValues(defaultValues),
  });

  const { data: countries } = useCountries();
  const { data: cities } = useCities(form.watch("country") || "");

  const countriesOptions = useMemo(() => (countries ?? []).map((c) => ({ label: c.country, value: c.country })), [countries]);
  const citiesOptions = useMemo(() => (cities ?? []).map((city) => ({ label: city, value: city })), [cities]);
  const suppliersOptions = useMemo(() => supplierMockStore.getAll().map((s) => ({ label: s.name, value: s.name })), []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <Section title='1. Địa điểm'>
          <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
            <FormSelect name='country' options={countriesOptions} label='Quốc gia' required />
            <FormSelect name='city' options={citiesOptions} label='Thành phố' disabled={!form.watch("country")} required />
          </div>
        </Section>

        <Section title='2. Thông tin cơ bản'>
          <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
            <FormInput name='code' label='Mã lịch trình' placeholder='VD: TRANS001' required />
            <FormInput name='name' label='Tên lịch trình' placeholder='VD: Đón / Tiễn sân bay Nội Bài' required />

            <FormSelect name='supplier' options={suppliersOptions} label='Nhà cung cấp' required />
            <FormCurrencyInput name='km' label='Số KM' placeholder='VD: 50' required />
            <FormTextarea name='notes' label='Ghi chú' className='sm:col-span-2' />
          </div>
        </Section>

        <Section title='3. Giá theo sức chứa xe'>
          <VehicleCapacityPriceForm />
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
