import type { HotelFormValues } from "@/modules/masterData/hotel/schemas/hotel.schema";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormDatePicker from "@/shared/components/form/FormDatePicker";
import FormInput from "@/shared/components/form/FormInput";
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

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6] as const;

type Props = {
  periodIndex: number;
};

export default function PricingPeriodForm({ periodIndex }: Props) {
  const { control, getValues, setValue, formState } = useFormContext<HotelFormValues>();

  const roomTypes = useWatch({ control, name: "roomTypes" }) ?? [];
  const dayGroups = useWatch({ control, name: `pricingPeriods.${periodIndex}.dayGroups` }) ?? [];

  const {
    fields: dateRangeFields,
    append: appendDateRange,
    remove: removeDateRange,
  } = useFieldArray({
    control,
    name: `pricingPeriods.${periodIndex}.dateRanges`,
  });

  const {
    fields: dayGroupFields,
    append: appendDayGroup,
    remove: removeDayGroup,
  } = useFieldArray({
    control,
    name: `pricingPeriods.${periodIndex}.dayGroups`,
  });

  const periodErrors = formState.errors.pricingPeriods?.[periodIndex];

  const handleAddDayGroup = () => {
    appendDayGroup({ label: "", days: [] });
    const priceRows = getValues(`pricingPeriods.${periodIndex}.prices`) ?? [];
    roomTypes.forEach((_, roomIdx) => {
      const existingPrices = priceRows[roomIdx]?.dayGroupPrices ?? [];
      setValue(`pricingPeriods.${periodIndex}.prices.${roomIdx}.dayGroupPrices`, [...existingPrices, { price: undefined as unknown as number }]);
    });
  };

  const handleRemoveDayGroup = (groupIdx: number) => {
    removeDayGroup(groupIdx);
    const priceRows = getValues(`pricingPeriods.${periodIndex}.prices`) ?? [];
    roomTypes.forEach((_, roomIdx) => {
      const existingPrices = priceRows[roomIdx]?.dayGroupPrices ?? [];
      setValue(
        `pricingPeriods.${periodIndex}.prices.${roomIdx}.dayGroupPrices`,
        existingPrices.filter((_: unknown, i: number) => i !== groupIdx)
      );
    });
  };

  const showPriceTable = dayGroupFields.length > 0 && roomTypes.length > 0;

  return (
    <div className='space-y-5'>
      <div className='space-y-3'>
        <p className='font-semibold text-sm'>Khoảng thời gian áp dụng</p>
        <div className='space-y-2'>
          {dateRangeFields.map((field, idx) => (
            <div key={field.id} className='flex items-end gap-3'>
              <FormDatePicker name={`pricingPeriods.${periodIndex}.dateRanges.${idx}.from`} label='Từ ngày' required />
              <FormDatePicker name={`pricingPeriods.${periodIndex}.dateRanges.${idx}.to`} label='Đến ngày' required />
              {dateRangeFields.length > 1 && <ActionButton action='delete' variant='destructive' onClick={() => removeDateRange(idx)} />}
            </div>
          ))}
        </div>

        <ActionButton action='add' text='Thêm khoảng ngày' variant='default' size='default' onClick={() => appendDateRange({ from: "", to: "" })} />

        {periodErrors?.dateRanges?.message && <FieldError errors={[periodErrors.dateRanges]} />}
      </div>

      <section>
        <p className='mb-1 font-semibold text-sm'>Nhóm ngày &amp; loại giá</p>

        <p className='mb-3 text-muted-foreground text-xs'>
          Mỗi nhóm ngày sẽ tạo ra một cột giá riêng trong bảng. Chọn các ngày trong tuần thuộc nhóm đó.
        </p>

        <div className='space-y-3'>
          {dayGroupFields.map((field, groupIdx) => (
            <Section key={field.id} type='dashed' borderColor='red' title={`Nhóm ngày #${groupIdx + 1}`} className='relative'>
              <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
                <FormInput name={`pricingPeriods.${periodIndex}.dayGroups.${groupIdx}.label`} label='Tên nhóm' placeholder='VD: CN - T6' required />

                <section>
                  <p className='mb-1.5 font-medium text-sm'>
                    Ngày áp dụng <span className='text-red-500'>*</span>
                  </p>

                  <Controller
                    control={control}
                    name={`pricingPeriods.${periodIndex}.dayGroups.${groupIdx}.days`}
                    render={({ field: f, fieldState }) => (
                      <div>
                        <div className='flex flex-wrap gap-1.5'>
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
              </div>

              <div className='top-3 right-3 absolute'>
                <ActionButton action='delete' variant='destructive' onClick={() => handleRemoveDayGroup(groupIdx)} />
              </div>
            </Section>
          ))}
        </div>

        <div className='mt-3'>
          <ActionButton action='add' text='Thêm nhóm ngày' variant='default' size='default' onClick={handleAddDayGroup} />
        </div>

        {periodErrors?.dayGroups?.message && <FieldError errors={[periodErrors.dayGroups]} />}
      </section>

      {showPriceTable && (
        <div>
          <p className='mb-1 font-semibold text-sm'>Bảng giá theo hạng phòng</p>
          <p className='mb-3 text-muted-foreground text-xs'>Nhập giá (VNĐ/phòng/đêm) cho từng hạng phòng theo nhóm ngày đã thiết lập.</p>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr>
                  <th className='py-2 pr-4 min-w-40 font-semibold text-left'>Hạng phòng</th>
                  {dayGroups.map((group, gIdx) => (
                    <th
                      key={gIdx}
                      className='px-3 py-2 first-of-type:rounded-tl last-of-type:rounded-tr min-w-36 font-bold text-muted-foreground text-center'>
                      {group?.label || `Nhóm ${gIdx + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {roomTypes.map((roomType, roomIdx) => (
                  <tr key={roomIdx} className='last:border-0 border-b'>
                    <td className='py-2 pr-4'>
                      <p className='font-medium'>{roomType?.name || `Loại phòng ${roomIdx + 1}`}</p>
                      {roomType?.maxGuests > 0 && <p className='text-muted-foreground text-xs'>{roomType.maxGuests} khách</p>}
                    </td>
                    {dayGroups.map((_, groupIdx) => (
                      <td key={groupIdx} className='p-2'>
                        <FormCurrencyInput name={`pricingPeriods.${periodIndex}.prices.${roomIdx}.dayGroupPrices.${groupIdx}.price`} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!showPriceTable && roomTypes.length === 0 && (
        <p className='text-muted-foreground text-xs italic'>Thêm loại phòng ở mục &ldquo;Danh sách phòng&rdquo; bên trên để nhập bảng giá.</p>
      )}
    </div>
  );
}
