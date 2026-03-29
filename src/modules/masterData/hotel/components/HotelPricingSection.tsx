import PricingPeriodForm from "@/modules/masterData/hotel/components/PricingPeriodForm";
import type { HotelFormValues } from "@/modules/masterData/hotel/schemas/hotel.schema";
import Section from "@/shared/components/common/Section";
import ActionButton from "@/shared/components/table/ActionButton";
import { Button } from "@/shared/components/ui/button";
import { FieldError } from "@/shared/components/ui/field";
import { CalendarDays, PlusCircle } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

export default function HotelPricingSection() {
  const { control, getValues, formState } = useFormContext<HotelFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pricingPeriods",
  });

  const roomTypes = useWatch({ control, name: "roomTypes" }) ?? [];

  const handleAddPeriod = () => {
    const dayGroupCount = 1;
    const initialPrices = roomTypes.map(() => ({
      dayGroupPrices: Array.from({ length: dayGroupCount }, () => ({ price: undefined as unknown as number })),
    }));

    append({
      dateRanges: [{ from: "", to: "" }],
      dayGroups: [{ label: "", days: [] }],
      prices: initialPrices,
    });
  };

  if (fields.length === 0) {
    return (
      <Section type='dashed' className='text-muted-foreground text-xs text-center'>
        <p className='mb-3'>Chưa có giai đoạn giá nào. Nhấn &ldquo;Thêm giai đoạn&rdquo; để bắt đầu.</p>

        <Button type='button' onClick={handleAddPeriod}>
          <PlusCircle className='w-4 h-4' />
          Thêm giai đoạn
        </Button>
      </Section>
    );
  }

  return (
    <Section title='3. Bảng giá'>
      <div className='space-y-4'>
        {fields.map((field, periodIndex) => {
          const period = getValues(`pricingPeriods.${periodIndex}`);
          const hasDateRanges = period?.dateRanges?.some((dr) => dr.from && dr.to);
          const headerLabel = hasDateRanges
            ? period.dateRanges
                .filter((dr) => dr.from && dr.to)
                .map((dr) => `${dr.from} - ${dr.to}`)
                .join(", ")
            : `Giai đoạn #${periodIndex + 1}`;

          return (
            <Section key={field.id} type='dashed' borderColor='red' className='relative'>
              <div className='flex justify-between items-center mb-4'>
                <p className='flex items-center gap-1 font-bold'>
                  <CalendarDays className='w-4 h-4' />
                  {headerLabel}
                </p>

                <ActionButton action='delete' text='Xóa giai đoạn' variant='destructive' size='default' onClick={() => remove(periodIndex)} />
              </div>

              <PricingPeriodForm periodIndex={periodIndex} />
            </Section>
          );
        })}

        <div className='flex justify-center'>
          <ActionButton action='add' text='Thêm giai đoạn' variant='default' size='default' onClick={handleAddPeriod} />
        </div>

        {formState.errors.pricingPeriods?.message && <FieldError errors={[formState.errors.pricingPeriods]} />}
      </div>
    </Section>
  );
}
