import EntranceFeePricingPeriodForm from "@/modules/masterData/entranceFee/components/EntranceFeePricingPeriodForm";
import type { EntranceFeeFormValues } from "@/modules/masterData/entranceFee/schemas/entrance-fee.schema";
import Section from "@/shared/components/common/Section";
import ActionButton from "@/shared/components/table/ActionButton";
import { FieldError } from "@/shared/components/ui/field";
import { formatDate } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

export default function EntranceFeePricingForm() {
  const { control, formState } = useFormContext<EntranceFeeFormValues>();

  const { fields, append, remove } = useFieldArray({ control, name: "pricingPeriods" });

  const watchedPeriods = useWatch({ control, name: "pricingPeriods" }) ?? [];

  const handleAddPeriod = () => {
    append({
      currency: "VND",
      dateRanges: [{ from: "", to: "", dayGroups: [{ label: "", days: [], price: undefined as unknown as number }] }],
    });
  };

  if (fields.length === 0) {
    return (
      <Section type='dashed' className='text-muted-foreground text-xs text-center'>
        <p className='mb-3'>Chưa có giai đoạn giá nào. Nhấn &ldquo;Thêm giai đoạn&rdquo; để bắt đầu.</p>

        <ActionButton action='add' text='Thêm giai đoạn' variant='default' size='default' onClick={handleAddPeriod} />
      </Section>
    );
  }

  return (
    <div className='space-y-4'>
      {fields.map((field, periodIndex) => {
        const period = watchedPeriods[periodIndex];
        const hasDateRanges = period?.dateRanges?.some((dr) => dr.from && dr.to);
        const headerLabel = hasDateRanges
          ? period.dateRanges
              .filter((dr) => dr.from && dr.to)
              .map((dr) => `${formatDate(new Date(dr.from), "dd/MM")} - ${formatDate(new Date(dr.to), "dd/MM")}`)
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

            <EntranceFeePricingPeriodForm periodIndex={periodIndex} />
          </Section>
        );
      })}

      <div className='flex justify-center'>
        <ActionButton action='add' text='Thêm giai đoạn' variant='default' size='default' onClick={handleAddPeriod} />
      </div>

      {formState.errors.pricingPeriods?.message && <FieldError errors={[formState.errors.pricingPeriods]} />}
    </div>
  );
}
