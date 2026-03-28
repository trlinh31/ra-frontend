import { countryApi } from "@/modules/masterData/country/api/country.api";
import { mapEntranceFeeDataToFormValues } from "@/modules/masterData/entranceFee/mappers/entrance-fee-form.mapper";
import type { EntranceFee } from "@/modules/masterData/entranceFee/types/entrance-fee.type";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
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
import { entranceFeeSchema, type EntranceFeeFormValues } from "../schemas/entrance-fee.schema";

interface EntranceFeeFormProps {
  defaultValues?: EntranceFee | undefined;
  onSubmit: (values: EntranceFeeFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export default function EntranceFeeForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: EntranceFeeFormProps) {
  const [countries, setCountries] = useState<Country[]>([]);

  const form = useForm<EntranceFeeFormValues>({
    resolver: zodResolver(entranceFeeSchema),
    defaultValues: mapEntranceFeeDataToFormValues(defaultValues),
  });

  useEffect(() => {
    countryApi
      .getCountries()
      .then((res) => setCountries(res.data))
      .catch(() => setCountries([]));
  }, []);

  const countriesOptions = useMemo(() => countries.map((c) => ({ label: c.country, value: c.country })), [countries]);

  const citiesOptions = useMemo(() => {
    const selected = countries.find((c) => c.country === form.watch("country"));
    return selected ? selected.cities.map((city) => ({ label: city, value: city })) : [];
  }, [countries, form.watch("country")]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
          <FormInput name='code' label='Mã phí vào cổng' required />
          <FormInput name='serviceName' label='Tên dịch vụ' required />
          <FormSelect name='country' options={countriesOptions} label='Quốc gia' required />
          <FormSelect name='city' options={citiesOptions} label='Thành phố' disabled={!form.watch("country")} required />
          <FormCurrencyInput name='price' label='Giá tiền (VNĐ)' required />
          <FormSwitch name='isActive' label='Hoạt động' />
          <FormTextarea name='notes' label='Ghi chú' className='sm:col-span-2' />
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
