import { dayMockStore } from "@/modules/tour/day/data/day.mock-store";
import { mapTourDataToFormValues } from "@/modules/tour/tour/mappers/tour-form.mapper";
import { tourSchema, type TourFormValues } from "@/modules/tour/tour/schemas/tour.schema";
import type { Tour } from "@/modules/tour/tour/types/tour.type";
import Section from "@/shared/components/common/Section";
import FormInput from "@/shared/components/form/FormInput";
import FormRichTextEditor from "@/shared/components/form/FormRichTextEditor/FormRichTextEditor";
import FormTextarea from "@/shared/components/form/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Users } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import TourDayForm from "./TourDayForm";

interface TourFormProps {
  defaultValues?: Tour | undefined;
  onSubmit: (values: TourFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

function TourCostSummary() {
  const days = useWatch<TourFormValues, "days">({ name: "days" });
  const numberOfPeople = useWatch<TourFormValues, "numberOfPeople">({ name: "numberOfPeople" });

  const allDays = useMemo(() => dayMockStore.getAll(), []);

  const totalsByCurrency = useMemo(() => {
    if (!days?.length) return {} as Record<string, number>;
    return days.reduce<Record<string, number>>((acc, tourDay) => {
      const day = allDays.find((d) => d.id === tourDay.dayId);
      if (!day) return acc;
      day.services.forEach((s) => {
        if (!s.unitPrice || !s.currency) return;
        acc[s.currency] = (acc[s.currency] ?? 0) + s.unitPrice;
      });
      return acc;
    }, {});
  }, [days, allDays]);

  const people = Number(numberOfPeople);
  const hasTotals = Object.keys(totalsByCurrency).length > 0;

  if (!hasTotals) return null;

  return (
    <Section title='3. Chi phí mỗi người'>
      <div className='space-y-3'>
        {Object.entries(totalsByCurrency).map(([currency, total]) => (
          <div key={currency} className='gap-4 grid grid-cols-1 sm:grid-cols-3 bg-muted p-4 rounded-lg'>
            <div className='text-center'>
              <p className='mb-1 text-muted-foreground text-xs'>Tổng chi phí</p>
              <p className='font-semibold text-base'>
                {currency === "VND" ? formatNumberVN(total) : total.toLocaleString()} {currency}
              </p>
            </div>
            <div className='text-center'>
              <p className='flex justify-center items-center gap-1 mb-1 text-muted-foreground text-xs'>
                <Users className='w-3 h-3' /> Số người
              </p>
              <p className='font-semibold text-base'>{people > 0 ? people : "—"}</p>
            </div>
            <div className='text-center'>
              <p className='mb-1 text-muted-foreground text-xs'>Giá mỗi người</p>
              <p className='font-semibold text-green-600 text-base'>
                {people > 0
                  ? `${currency === "VND" ? formatNumberVN(Math.round(total / people)) : (total / people).toLocaleString()} ${currency}`
                  : "—"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default function TourForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: TourFormProps) {
  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: mapTourDataToFormValues(defaultValues),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <Section title='1. Thông tin cơ bản'>
          <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
            <FormInput name='code' label='Mã tour' required />
            <FormInput name='name' label='Tên tour' required />
            <FormInput name='numberOfPeople' label='Số lượng người' type='number' min={1} required />
            <FormTextarea name='description' label='Mô tả' className='sm:col-span-2' />
          </div>
        </Section>

        <Section title='2. Lịch trình & Nội dung'>
          <div className='gap-6 grid grid-cols-1 lg:grid-cols-2'>
            <FormRichTextEditor name='content' label='Nội dung tour' />
            <TourDayForm />
          </div>
        </Section>

        <TourCostSummary />

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
