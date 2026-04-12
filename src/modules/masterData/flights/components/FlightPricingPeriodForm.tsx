import FlightDayGroupsForm from "@/modules/masterData/flights/components/FlightDayGroupsForm";
import type { FlightFormValues } from "@/modules/masterData/flights/schemas/flight.schema";
import FormDatePicker from "@/shared/components/form/FormDatePicker";
import FormSelect from "@/shared/components/form/FormSelect";
import ActionButton from "@/shared/components/table/ActionButton";
import { FieldError } from "@/shared/components/ui/field";
import { CURRENCY_OPTIONS } from "@/shared/constants/currency.constant";
import type { Matcher } from "react-day-picker";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

interface FlightPricingPeriodFormProps {
  periodIndex: number;
}

export default function FlightPricingPeriodForm({ periodIndex }: FlightPricingPeriodFormProps) {
  const { control, formState } = useFormContext<FlightFormValues>();

  const watchedDateRanges = useWatch({ control, name: `pricingPeriods.${periodIndex}.dateRanges` }) ?? [];

  const {
    fields: dateRangeFields,
    append: appendDateRange,
    remove: removeDateRange,
  } = useFieldArray({
    control,
    name: `pricingPeriods.${periodIndex}.dateRanges`,
  });

  const periodErrors = formState.errors.pricingPeriods?.[periodIndex];

  const parseDate = (str: string): Date => {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const getFromDisabled = (idx: number): Matcher[] => {
    const matchers: Matcher[] = [];
    const currentTo = watchedDateRanges[idx]?.to;
    if (currentTo) matchers.push({ after: parseDate(currentTo) });
    watchedDateRanges.forEach((dr, i) => {
      if (i !== idx && dr?.from && dr?.to) {
        const drFrom = parseDate(dr.from);
        const drTo = parseDate(dr.to);
        if (currentTo && parseDate(currentTo) >= drFrom) {
          matchers.push((date: Date) => date <= drTo);
        } else {
          matchers.push({ from: drFrom, to: drTo });
        }
      }
    });
    return matchers;
  };

  const getToDisabled = (idx: number): Matcher[] => {
    const matchers: Matcher[] = [];
    const currentFrom = watchedDateRanges[idx]?.from;
    if (currentFrom) matchers.push({ before: parseDate(currentFrom) });
    watchedDateRanges.forEach((dr, i) => {
      if (i !== idx && dr?.from && dr?.to) {
        const drFrom = parseDate(dr.from);
        const drTo = parseDate(dr.to);
        if (currentFrom && parseDate(currentFrom) <= drTo) {
          matchers.push((date: Date) => date >= drFrom);
        } else {
          matchers.push({ from: drFrom, to: drTo });
        }
      }
    });
    return matchers;
  };

  return (
    <div className='space-y-5'>
      <div className='max-w-60'>
        <FormSelect
          name={`pricingPeriods.${periodIndex}.currency`}
          label='Đơn vị tiền tệ'
          options={CURRENCY_OPTIONS}
          placeholder='Chọn đơn vị tiền tệ'
          required
        />
      </div>

      <div className='space-y-3'>
        <p className='font-semibold text-sm'>Khoảng ngày áp dụng</p>

        <div className='space-y-4'>
          {dateRangeFields.map((field, rangeIdx) => (
            <div key={field.id} className='space-y-4 p-4 border border-gray-300 border-dashed rounded-lg'>
              <div className='flex items-end gap-3'>
                <FormDatePicker
                  name={`pricingPeriods.${periodIndex}.dateRanges.${rangeIdx}.from`}
                  label='Từ ngày'
                  required
                  disabledDates={getFromDisabled(rangeIdx)}
                />
                <FormDatePicker
                  name={`pricingPeriods.${periodIndex}.dateRanges.${rangeIdx}.to`}
                  label='Đến ngày'
                  required
                  disabledDates={getToDisabled(rangeIdx)}
                />
                {dateRangeFields.length > 1 && <ActionButton action='delete' variant='destructive' onClick={() => removeDateRange(rangeIdx)} />}
              </div>

              <FlightDayGroupsForm periodIndex={periodIndex} rangeIndex={rangeIdx} />
            </div>
          ))}
        </div>

        <ActionButton
          action='add'
          text='Thêm khoảng ngày'
          variant='default'
          size='default'
          onClick={() =>
            appendDateRange({
              from: "",
              to: "",
              dayGroups: [{ id: crypto.randomUUID(), label: "", days: [], price: undefined as unknown as number }],
            })
          }
        />

        {periodErrors?.dateRanges?.message && <FieldError errors={[periodErrors.dateRanges]} />}
      </div>
    </div>
  );
}
