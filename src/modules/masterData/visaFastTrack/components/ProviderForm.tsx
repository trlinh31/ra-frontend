import Section from "@/shared/components/common/Section";
import FormSelect from "@/shared/components/form/FormSelect";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { supplierMockStore } from "../../supplier/data/supplier.mock-store";
import { mapVisaServiceDataToFormValues } from "../mappers/visa-fast-track-form.mapper";
import { visaServiceSchema, type VisaServiceFormValues } from "../schemas/visa-fast-track.schema";
import type { VisaService } from "../types/visa-fast-track.type";
import VisaServiceForm from "./VisaServiceForm";
type ProviderFormProps = {
  defaultValues?: VisaService | undefined;
  onSubmit: (values: VisaServiceFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
};

export default function ProviderForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: ProviderFormProps) {
  const form = useForm<VisaServiceFormValues>({
    resolver: zodResolver(visaServiceSchema),
    defaultValues: mapVisaServiceDataToFormValues(defaultValues),
  });

  const suppliersOptions = useMemo(() => supplierMockStore.getAll().map((supplier) => ({ label: supplier.name, value: supplier.name })), []);
  const handleSubmit = (values: any) => {
    const supplier = supplierMockStore.getAll().find((s) => s.name === values.provider);

    const payload = {
      ...values,
      provider: supplier?.name,
      country: supplier?.country,
      city: supplier?.city,
    };
    onSubmit(payload);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
          <FormSelect name='provider' options={suppliersOptions} label='Nhà cung cấp' required />
          {/* <FormInput name='code' label='Mã dịch vụ' required /> */}
          <Section title='Thông tin dịch vụ visa/fast track' className='col-span-2'>
            <VisaServiceForm />
          </Section>
          {form.formState.errors.services?.message && (
            <p className='font-normal text-destructive text-sm'>{form.formState.errors.services.message}</p>
          )}
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
