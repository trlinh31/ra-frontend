import { dayMockStore } from "@/modules/tour/day/data/day.mock-store";
import { SERVICE_TYPE_CONFIG } from "@/modules/tour/day/types/day.type";
import type { TourFormValues } from "@/modules/tour/tour/schemas/tour.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import Section from "@/shared/components/common/Section";
import ActionButton from "@/shared/components/table/ActionButton";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldError } from "@/shared/components/ui/field";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { ChevronDown, ChevronUp, PlusCircle } from "lucide-react";
import { useMemo } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

interface TourDayRowProps {
  index: number;
  total: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function TourDayRow({ index, total, onRemove, onMoveUp, onMoveDown }: TourDayRowProps) {
  const { control, watch } = useFormContext<TourFormValues>();
  const allDays = useMemo(() => dayMockStore.getAll(), []);
  const dayOptions = useMemo(() => allDays.map((d) => ({ label: `[${d.code}] ${d.title}`, value: d.id })), [allDays]);

  const selectedDayId = watch(`days.${index}.dayId`);
  const selectedDay = allDays.find((d) => d.id === selectedDayId);

  const dayTotals = useMemo(() => {
    if (!selectedDay) return {} as Record<string, number>;
    return selectedDay.services.reduce<Record<string, number>>((acc, s) => {
      if (!s.unitPrice || !s.currency) return acc;
      acc[s.currency] = (acc[s.currency] ?? 0) + s.unitPrice;
      return acc;
    }, {});
  }, [selectedDay]);

  return (
    <div className='bg-background border rounded-md overflow-hidden'>
      <div className='flex flex-wrap items-center gap-3 px-3 py-2'>
        <span className='w-14 font-medium text-sm shrink-0'>Ngày {index + 1}</span>

        {selectedDay && (
          <Badge variant='outline' className='shrink-0'>
            {selectedDay.code}
          </Badge>
        )}

        <Controller
          control={control}
          name={`days.${index}.dayId`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className='flex-1 min-w-52'>
              <AppSelect options={dayOptions} value={field.value} onChange={field.onChange} placeholder='Chọn ngày hành trình' />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {selectedDay &&
          Object.entries(dayTotals).map(([currency, total]) => (
            <Badge key={currency} variant='outline' className='bg-green-50 border-green-300 text-green-700 shrink-0'>
              {currency === "VND" ? formatNumberVN(total) : total.toLocaleString()} {currency}
            </Badge>
          ))}

        <div className='flex items-center gap-1 shrink-0'>
          <Button type='button' variant='ghost' size='icon' onClick={onMoveUp} disabled={index === 0}>
            <ChevronUp className='w-4 h-4' />
          </Button>
          <Button type='button' variant='ghost' size='icon' onClick={onMoveDown} disabled={index === total - 1}>
            <ChevronDown className='w-4 h-4' />
          </Button>
          <ActionButton action='delete' onClick={onRemove} />
        </div>
      </div>

      {selectedDay && selectedDay.services.length > 0 && (
        <div className='border-t divide-y'>
          {selectedDay.services.map((service) => {
            const config = SERVICE_TYPE_CONFIG[service.serviceType];
            return (
              <div key={service.id} className='flex items-center gap-3 bg-muted/30 px-3 py-2 text-sm'>
                <span className='flex items-center gap-1 w-28 text-muted-foreground shrink-0'>
                  {config?.icon}
                  <span className='text-xs'>{config?.label}</span>
                </span>
                <span className='flex-1 truncate'>{service.name}</span>
                {service.unitPrice > 0 && service.currency && (
                  <span className='font-medium text-green-700 shrink-0'>
                    {service.currency === "VND" ? formatNumberVN(service.unitPrice) : service.unitPrice.toLocaleString()} {service.currency}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TourDayForm() {
  const { control, formState } = useFormContext<TourFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "days" });

  const handleAdd = () => append({ dayId: crypto.randomUUID(), order: fields.length + 1 });

  if (fields.length === 0) {
    return (
      <Section type='dashed' bgColor='transparent' className='text-muted-foreground text-sm text-center'>
        <p className='mb-3'>Chưa có ngày nào. Nhấn &quot;Thêm ngày&quot; để bắt đầu.</p>
        <Button type='button' onClick={handleAdd}>
          <PlusCircle className='w-4 h-4' />
          Thêm ngày
        </Button>
        {formState.errors.days?.message && <p className='mt-2 font-normal text-destructive text-sm'>{formState.errors.days.message}</p>}
      </Section>
    );
  }

  return (
    <div className='space-y-3'>
      {fields.map((field, index) => (
        <TourDayRow
          key={field.id}
          index={index}
          total={fields.length}
          onRemove={() => remove(index)}
          onMoveUp={() => move(index, index - 1)}
          onMoveDown={() => move(index, index + 1)}
        />
      ))}
      <div>
        <Button type='button' onClick={handleAdd}>
          <PlusCircle className='w-4 h-4' />
          Thêm ngày
        </Button>
      </div>
      {formState.errors.days?.message && <p className='font-normal text-destructive text-sm'>{formState.errors.days.message}</p>}
    </div>
  );
}
