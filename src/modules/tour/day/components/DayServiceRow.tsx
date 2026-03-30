import { SERVICE_TYPE_LABELS } from "@/modules/tour/day/types/day.type";
import AppSelect from "@/shared/components/common/AppSelect";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormInput from "@/shared/components/form/FormInput";
import ActionButton from "@/shared/components/table/ActionButton";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import HotelServiceFields from "./HotelServiceFields";

interface DayServiceRowProps {
  index: number;
  onRemove: () => void;
}

const serviceTypeOptions = Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => ({ value, label }));

export default function DayServiceRow({ index, onRemove }: DayServiceRowProps) {
  const { control, setValue } = useFormContext();

  const serviceType = useWatch({ control, name: `services.${index}.serviceType` }) as string;
  const unitPrice = useWatch({ control, name: `services.${index}.unitPrice` }) as number;
  const currency = useWatch({ control, name: `services.${index}.currency` }) as string;

  const priceLabel = serviceType === "hotel" && unitPrice > 0 ? `${formatNumberVN(unitPrice)} ${currency}` : "—";

  return (
    <div className='space-y-3 bg-transparent p-4 border border-blue-400 border-dashed rounded-lg'>
      <div className='flex flex-wrap items-end gap-3'>
        <Controller
          control={control}
          name={`services.${index}.serviceType`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className='w-36 shrink-0'>
              <FieldLabel>
                Loại dịch vụ <span className='text-red-500'>*</span>
              </FieldLabel>
              <AppSelect
                options={serviceTypeOptions}
                value={field.value}
                onChange={(value) => {
                  const prev = field.value;
                  field.onChange(value);
                  if (value === "hotel") {
                    setValue(`services.${index}.hotelDetail`, {
                      hotelId: "",
                      pricingPeriodId: "",
                      dayGroupId: "",
                      roomTypeId: 0,
                    });
                  } else if (prev === "hotel") {
                    setValue(`services.${index}.hotelDetail`, undefined);
                    setValue(`services.${index}.unitPrice`, 0);
                  }
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className='flex-1 min-w-35'>
          <FormInput name={`services.${index}.name`} label='Tên dịch vụ' required />
        </div>

        <Controller
          control={control}
          name={`services.${index}.quantity`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className='w-20 shrink-0'>
              <FieldLabel>
                SL <span className='text-red-500'>*</span>
              </FieldLabel>
              <Input type='number' min={1} value={field.value ?? 1} onChange={(e) => field.onChange(Number(e.target.value))} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className='flex-1' />

        {serviceType === "hotel" ? (
          <div className='text-right shrink-0'>
            <p className='mb-1 text-muted-foreground text-xs'>Đơn giá</p>
            <p className='font-bold tabular-nums text-base'>{priceLabel}</p>
          </div>
        ) : (
          <div className='w-40 shrink-0'>
            <FormCurrencyInput name={`services.${index}.unitPrice`} label='Đơn giá' required />
          </div>
        )}

        <div className='self-end pb-0.5 shrink-0'>
          <ActionButton action='delete' onClick={onRemove} />
        </div>
      </div>

      {serviceType === "hotel" && <HotelServiceFields index={index} />}

      <FormInput name={`services.${index}.notes`} label='Ghi chú' placeholder='Ghi chú thêm...' />
    </div>
  );
}
