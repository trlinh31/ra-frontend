import { countryApi } from "@/modules/masterData/country/api/country.api";
import { mapSupplierDataToFormValues } from "@/modules/masterData/supplier/mappers/supplier-form.mapper";
import { supplierSchema, type SupplierFormValues } from "@/modules/masterData/supplier/schemas/supplier.schema";
import type { Supplier } from "@/modules/masterData/supplier/types/supplier.type";
import Section from "@/shared/components/common/Section";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import type { Country } from "@/shared/types/country/country.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface SupplierFormProps {
  defaultValues?: Supplier | undefined;
  onSubmit: (values: SupplierFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export default function SupplierForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: SupplierFormProps) {
  const [countries, setCountries] = useState<Country[]>([]);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: mapSupplierDataToFormValues(defaultValues),
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
        <Section title='1. Địa điểm'>
          <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
            <FormSelect name='country' options={countriesOptions} label='Quốc gia' required />
            <FormSelect name='city' options={citiesOptions} label='Thành phố' disabled={!form.watch("country")} required />
            <FormInput name='address' label='Địa chỉ' placeholder='VD: 123 Đường ABC, Quận XYZ' required className='sm:col-span-2' />
          </div>
        </Section>

        <Section title='2. Thông tin cơ bản'>
          <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
            <FormInput name='code' label='Mã nhà cung cấp' required />
            <FormInput name='name' label='Tên nhà cung cấp' required />
            <FormInput name='taxCode' label='Mã số thuế' required />
            <FormInput name='email' label='Email' required />
            <FormInput name='phone' label='Số điện thoại' required />
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
