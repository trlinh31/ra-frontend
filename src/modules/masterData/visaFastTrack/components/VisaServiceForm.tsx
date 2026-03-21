import { VISA_GROUP_OPTIONS } from "@/modules/masterData/visaFastTrack/constants/visa-group-options.constant";
import { VISA_PRICE_UNIT_OPTIONS } from "@/modules/masterData/visaFastTrack/constants/visa-price-unit-options.constant";
import { mapVisaServiceDataToFormValues } from "@/modules/masterData/visaFastTrack/mappers/visa-fast-track-form.mapper";
import { visaServiceSchema, type VisaServiceFormValues } from "@/modules/masterData/visaFastTrack/schemas/visa-fast-track.schema";
import type { VisaService } from "@/modules/masterData/visaFastTrack/types/visa-fast-track.type";
import FormCurrenctyInput from "@/shared/components/form/FormCurrenctyInput";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

interface VisaServiceFormProps {
  defaultValues?: VisaService | undefined;
  onSubmit: (values: VisaServiceFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export default function VisaServiceForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: VisaServiceFormProps) {
  const form = useForm<VisaServiceFormValues>({
    resolver: zodResolver(visaServiceSchema),
    defaultValues: mapVisaServiceDataToFormValues(defaultValues),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
          <FormInput name='code' label='Mã dịch vụ' required />
          <FormInput name='serviceName' label='Tên dịch vụ' required />
          <FormSelect name='group' label='Nhóm' options={VISA_GROUP_OPTIONS} required />
          <FormSelect name='priceUnit' label='Đơn vị giá' options={VISA_PRICE_UNIT_OPTIONS} required />
          <FormCurrenctyInput name='price' label='Giá tiền (VNĐ)' required />
          <FormInput name='pickupLocation' label='Địa điểm đón' />
          <FormTextarea name='description' label='Mô tả' className='sm:col-span-2' />
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
