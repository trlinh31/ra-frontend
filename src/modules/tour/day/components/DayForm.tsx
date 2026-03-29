import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { mapDayDataToFormValues } from "@/modules/tour/day/mappers/day-form.mapper";
import { daySchema, type DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import type { Day } from "@/modules/tour/day/types/day.type";
import Section from "@/shared/components/common/Section";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import DayServicesSection from "./DayServicesSection";

interface DayFormProps {
  defaultValues?: Day | undefined;
  onSubmit: (values: DayFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export default function DayForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: DayFormProps) {
  const form = useForm<DayFormValues>({
    resolver: zodResolver(daySchema),
    defaultValues: mapDayDataToFormValues(defaultValues),
  });

  const { data: countries } = useCountries();
  const { data: cities } = useCities(form.watch("country") || "");

  const countriesOptions = useMemo(() => (countries ?? []).map((item) => ({ label: item.country, value: item.country })), [countries]);
  const citiesOptions = useMemo(() => (cities ?? []).map((city) => ({ label: city, value: city })), [cities]);

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
            <FormInput name='code' label='Mã ngày' required />
            <FormInput name='title' label='Tên hành trình' required />
            <FormTextarea name='description' label='Mô tả' className='sm:col-span-2' />
          </div>
        </Section>

        <DayServicesSection />

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
