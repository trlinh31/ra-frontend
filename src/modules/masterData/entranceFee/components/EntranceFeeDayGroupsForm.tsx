import type { EntranceFeeFormValues } from "@/modules/masterData/entranceFee/schemas/entrance-fee.schema";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import ActionButton from "@/shared/components/table/ActionButton";
import { FieldError } from "@/shared/components/ui/field";
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";

const DAY_LABELS: Record<number, string> = {
  0: "CN",
  1: "T2",
  2: "T3",
  3: "T4",
  4: "T5",
  5: "T6",
  6: "T7",
};

const ALL_DAYS = [1, 2, 3, 4, 5, 6, 0] as const;

interface EntranceFeeDayGroupsFormProps {
  periodIndex: number;
  rangeIndex: number;
}

export default function EntranceFeeDayGroupsForm({ periodIndex, rangeIndex }: EntranceFeeDayGroupsFormProps) {
  const { control, formState } = useFormContext<EntranceFeeFormValues>();

  const ticketTypes = useWatch({ control, name: "ticketTypes" }) ?? [];

  const ticketTypeOptions = ticketTypes.map((tt, i) => ({
    value: String(i),
    label: tt.name || `Loại đối tượng ${i + 1}`,
  }));

  const {
    fields: dayGroupFields,
    append: appendDayGroup,
    remove: removeDayGroup,
  } = useFieldArray({
    control,
    name: `pricingPeriods.${periodIndex}.dateRanges.${rangeIndex}.dayGroups`,
  });

  const rangeErrors = formState.errors.pricingPeriods?.[periodIndex]?.dateRanges?.[rangeIndex];

  return (
    <div className='space-y-3'>
      <p className='font-medium text-sm'>Nhóm thứ &amp; giá</p>

      <div className='space-y-2'>
        {dayGroupFields.map((field, groupIdx) => (
          <Section key={field.id} type='dashed' borderColor='red' title={`Nhóm thứ #${groupIdx + 1}`} className='relative'>
            <div className='items-start gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
              <FormSelect
                name={`pricingPeriods.${periodIndex}.dateRanges.${rangeIndex}.dayGroups.${groupIdx}.ticketTypeIndex`}
                label='Loại đối tượng'
                options={ticketTypeOptions}
                placeholder='Chọn loại đối tượng'
                required
              />

              <FormInput
                name={`pricingPeriods.${periodIndex}.dateRanges.${rangeIndex}.dayGroups.${groupIdx}.label`}
                label='Tên nhóm'
                placeholder='VD: T2-T6'
                required
              />

              <section>
                <p className='mb-1.5 font-medium text-sm'>
                  Ngày áp dụng <span className='text-red-500'>*</span>
                </p>
                <Controller
                  control={control}
                  name={`pricingPeriods.${periodIndex}.dateRanges.${rangeIndex}.dayGroups.${groupIdx}.days`}
                  render={({ field: f, fieldState }) => (
                    <div>
                      <div className='flex flex-wrap gap-1'>
                        {ALL_DAYS.map((day) => {
                          const selected = (f.value as number[]).includes(day);
                          return (
                            <button
                              key={day}
                              type='button'
                              className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                                selected ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-600 hover:border-primary"
                              }`}
                              onClick={() => {
                                const current = f.value as number[];
                                f.onChange(selected ? current.filter((d) => d !== day) : [...current, day]);
                              }}>
                              {DAY_LABELS[day]}
                            </button>
                          );
                        })}
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>
                  )}
                />
              </section>

              <FormCurrencyInput
                name={`pricingPeriods.${periodIndex}.dateRanges.${rangeIndex}.dayGroups.${groupIdx}.price`}
                label='Giá vé'
                required
              />
            </div>

            <div className='top-3 right-3 absolute'>
              <ActionButton action='delete' variant='destructive' onClick={() => removeDayGroup(groupIdx)} />
            </div>
          </Section>
        ))}
      </div>

      <div className={ticketTypeOptions.length === 0 ? "opacity-50 pointer-events-none" : ""}>
        <ActionButton
          action='add'
          text='Thêm nhóm thứ'
          variant='default'
          size='default'
          onClick={() =>
            appendDayGroup({
              id: crypto.randomUUID(),
              label: "",
              days: [],
              ticketTypeIndex: "",
              price: undefined as unknown as number,
            })
          }
        />
      </div>

      {rangeErrors?.dayGroups?.message && <FieldError errors={[rangeErrors.dayGroups]} />}
    </div>
  );
}
