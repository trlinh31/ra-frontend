import DayServiceForm from "@/modules/tour/day/components/DayServiceForm";
import { mapDayDataToFormValues } from "@/modules/tour/day/mappers/day-form.mapper";
import { daySchema, type DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import type { Day } from "@/modules/tour/day/types/day.type";
import Section from "@/shared/components/common/Section";
import FormInput from "@/shared/components/form/FormInput";
import FormTextarea from "@/shared/components/form/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
          <FormInput name='code' label='Mã ngày' required />
          <FormInput name='title' label='Tiêu đề' required />
          <FormTextarea name='description' label='Mô tả' className='sm:col-span-2' />
        </div>

        <Section title='Dịch vụ trong ngày'>
          <DayServiceForm />
          {form.formState.errors.services?.message && (
            <p className='mt-2 font-normal text-destructive text-sm'>{form.formState.errors.services.message}</p>
          )}
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
