import { getServiceOptions } from "@/modules/tour/day/helpers/getServiceOptions";
import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import { CURRENCIES, SERVICE_TYPE_LABELS, SERVICE_TYPES, type ServiceType } from "@/modules/tour/day/types/day.type";
import AppSelect from "@/shared/components/common/AppSelect";
import Section from "@/shared/components/common/Section";
import FormCurrenctyInput from "@/shared/components/form/FormCurrenctyInput";
import FormInput from "@/shared/components/form/FormInput";
import ActionButton from "@/shared/components/table/ActionButton";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { PlusCircle } from "lucide-react";
import { useMemo } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

const SERVICE_TYPE_OPTIONS = SERVICE_TYPES.map((t) => ({ label: SERVICE_TYPE_LABELS[t], value: t }));
const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ label: c, value: c }));

interface DayServiceRowProps {
  index: number;
  onAdd: () => void;
  onRemove: () => void;
}

function DayServiceRow({ index, onAdd, onRemove }: DayServiceRowProps) {
  const { control, watch, setValue } = useFormContext<DayFormValues>();
  const serviceType = watch(`services.${index}.serviceType`) as ServiceType | undefined;

  const nameOptions = useMemo(() => {
    if (!serviceType) return [];
    return getServiceOptions(serviceType).map((o) => ({ label: o.label, value: o.value }));
  }, [serviceType]);

  return (
    <div className='flex flex-wrap items-end gap-4'>
      <div>
        <Controller
          control={control}
          name={`services.${index}.serviceType`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className='min-w-36'>
              <FieldLabel>
                Loại dịch vụ<span className='text-red-500'>*</span>
              </FieldLabel>
              <AppSelect
                options={SERVICE_TYPE_OPTIONS}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setValue(`services.${index}.name`, "");
                  setValue(`services.${index}.unitPrice`, 0);
                }}
                placeholder='Chọn loại'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div>
        <Controller
          control={control}
          name={`services.${index}.name`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className='min-w-52 max-w-52'>
              <FieldLabel>
                Dịch vụ<span className='text-red-500'>*</span>
              </FieldLabel>
              <AppSelect
                options={nameOptions}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  const found = getServiceOptions(serviceType!).find((o) => o.value === value);
                  if (found) {
                    setValue(`services.${index}.unitPrice`, found.price);
                    setValue(`services.${index}.currency`, found.currency);
                  }
                }}
                disabled={!serviceType}
                placeholder='Chọn dịch vụ'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div>
        <FormCurrenctyInput name={`services.${index}.quantity`} label='Số lượng' required />
      </div>

      <div>
        <FormCurrenctyInput name={`services.${index}.unitPrice`} label='Đơn giá' required />
      </div>

      <div>
        <Controller
          control={control}
          name={`services.${index}.currency`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className='min-w-24 max-w-28'>
              <FieldLabel>Tiền tệ</FieldLabel>
              <AppSelect options={CURRENCY_OPTIONS} value={field.value} onChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <FormInput name={`services.${index}.notes`} label='Ghi chú' className='flex-1 min-w-40' />

      <div className='flex items-end gap-2'>
        <ActionButton action='add' onClick={onAdd} />
        <ActionButton action='delete' onClick={onRemove} />
      </div>
    </div>
  );
}

export default function DayServiceForm() {
  const { control } = useFormContext<DayFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const handleAdd = () => {
    append({
      serviceType: undefined as unknown as "hotel",
      name: "",
      quantity: undefined as unknown as number,
      unitPrice: undefined as unknown as number,
      currency: "VND",
      notes: "",
    });
  };

  if (fields.length === 0) {
    return (
      <Section type='dashed' className='text-muted-foreground text-xs text-center'>
        <p className='mb-3'>Chưa có dịch vụ nào. Nhấn &quot;Thêm dịch vụ&quot; để bắt đầu.</p>
        <Button type='button' onClick={handleAdd}>
          <PlusCircle className='w-4 h-4' />
          Thêm dịch vụ
        </Button>
      </Section>
    );
  }

  return (
    <div className='space-y-3'>
      {fields.map((field, index) => (
        <DayServiceRow key={field.id} index={index} onAdd={handleAdd} onRemove={() => remove(index)} />
      ))}
    </div>
  );
}
