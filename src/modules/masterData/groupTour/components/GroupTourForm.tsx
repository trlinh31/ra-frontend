import { mapGroupTourDataToFormValues } from "@/modules/masterData/groupTour/mappers/group-tour-form.mapper";
import { groupTourSchema, type GroupTourFormValues } from "@/modules/masterData/groupTour/schemas/group-tour.schema";
import type { GroupTour } from "@/modules/masterData/groupTour/types/group-tour.type";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormInput from "@/shared/components/form/FormInput";
import FormSwitch from "@/shared/components/form/FormSwitch/FormSwitch";
import FormTextarea from "@/shared/components/form/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

interface GroupTourFormProps {
  defaultValues?: GroupTour | undefined;
  onSubmit: (values: GroupTourFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export default function GroupTourForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: GroupTourFormProps) {
  const form = useForm<GroupTourFormValues>({
    resolver: zodResolver(groupTourSchema),
    defaultValues: mapGroupTourDataToFormValues(defaultValues),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
          <FormInput name='code' label='Mã tour' required />
          <FormInput name='tourName' label='Tên tour' required />
          <FormInput name='supplier' label='Nhà cung cấp' required />
          <FormCurrencyInput name='price' label='Giá tiền (VNĐ)' required />
          <FormSwitch name='isActive' label='Hoạt động' />
          <FormTextarea name='content' label='Nội dung' className='sm:col-span-2' />
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
