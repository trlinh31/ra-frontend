import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { dayMockStore } from "@/modules/tour/day/data/day.mock-store";
import { mapDayDataToFormValues } from "@/modules/tour/day/mappers/day-form.mapper";
import { daySchema, type DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import { SERVICE_TYPE_CONFIG } from "@/modules/tour/day/types/day.type";
import TourDayServicesSection from "@/modules/tour/tour/components/TourDayServicesSection";
import type { TourFormValues } from "@/modules/tour/tour/schemas/tour.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import Section from "@/shared/components/common/Section";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea";
import ActionButton from "@/shared/components/table/ActionButton";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";

interface TourDayRowProps {
  index: number;
  total: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function TourDayRow({ index, total, onRemove, onMoveUp, onMoveDown }: TourDayRowProps) {
  const parentForm = useFormContext<TourFormValues>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [templateId, setTemplateId] = useState<string>("");

  const allDays = useMemo(() => dayMockStore.getAll(), []);
  const templateOptions = useMemo(() => allDays.map((d) => ({ label: `[${d.code}] ${d.title}`, value: d.id })), [allDays]);

  const localForm = useForm<DayFormValues>({
    resolver: zodResolver(daySchema),
    defaultValues: (parentForm.getValues(`days.${index}`) as DayFormValues | undefined) ?? mapDayDataToFormValues(undefined),
  });

  // Sync local form → parent form on every change
  useEffect(() => {
    const { unsubscribe } = localForm.watch((values) => {
      parentForm.setValue(`days.${index}`, values as DayFormValues, { shouldDirty: true });
    });
    return unsubscribe;
  }, [index, localForm, parentForm]);

  const { data: countries } = useCountries();
  const watchedCountry = localForm.watch("country");
  const { data: cities } = useCities(watchedCountry || "");

  const countriesOptions = useMemo(() => (countries ?? []).map((c) => ({ label: c.country, value: c.country })), [countries]);
  const citiesOptions = useMemo(() => (cities ?? []).map((city) => ({ label: city, value: city })), [cities]);

  const title = localForm.watch("title");
  const code = localForm.watch("code");
  const services = localForm.watch("services") ?? [];

  const dayTotals = useMemo(() => {
    return services.reduce<Record<string, number>>((acc, s) => {
      if (!s.unitPrice || !s.currency) return acc;
      acc[s.currency] = (acc[s.currency] ?? 0) + s.unitPrice;
      return acc;
    }, {});
  }, [services]);

  const handleSelectTemplate = (dayId: string | null) => {
    const id = dayId ?? "";
    setTemplateId(id);
    if (!id) return;
    const day = allDays.find((d) => d.id === id);
    if (!day) return;
    const values = mapDayDataToFormValues(day);
    localForm.reset(values);
    parentForm.setValue(`days.${index}`, values, { shouldDirty: true });
  };

  return (
    <div className='bg-background border rounded-md overflow-hidden'>
      {/* Header */}
      <div className='flex flex-wrap items-center gap-3 px-3 py-2'>
        <span className='w-14 font-medium text-sm shrink-0'>Ngày {index + 1}</span>

        {code && (
          <Badge variant='outline' className='shrink-0'>
            {code}
          </Badge>
        )}

        <span className='flex-1 min-w-0 text-sm truncate'>{title || <span className='text-muted-foreground italic'>Chưa đặt tên</span>}</span>

        {Object.entries(dayTotals).map(([currency, total]) => (
          <Badge key={currency} variant='outline' className='bg-green-50 border-green-300 text-green-700 shrink-0'>
            {currency === "VND" ? formatNumberVN(total) : total.toLocaleString()} {currency}
          </Badge>
        ))}

        <div className='flex items-center gap-1 shrink-0'>
          <Button type='button' variant='ghost' size='icon' onClick={() => setIsExpanded((e) => !e)} title={isExpanded ? "Thu gọn" : "Chỉnh sửa"}>
            <ChevronsUpDown className='w-4 h-4' />
          </Button>
          <Button type='button' variant='ghost' size='icon' onClick={onMoveUp} disabled={index === 0}>
            <ChevronUp className='w-4 h-4' />
          </Button>
          <Button type='button' variant='ghost' size='icon' onClick={onMoveDown} disabled={index === total - 1}>
            <ChevronDown className='w-4 h-4' />
          </Button>
          <ActionButton action='delete' onClick={onRemove} />
        </div>
      </div>

      {!isExpanded && services.length > 0 && (
        <div className='border-t divide-y'>
          {services.map((service, serviceIdx) => {
            const config = SERVICE_TYPE_CONFIG[service.serviceType];
            return (
              <div key={serviceIdx} className='flex items-center gap-3 bg-muted/30 px-3 py-2 text-sm'>
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

      {isExpanded && (
        <div className='space-y-4 p-4 border-t'>
          <div className='flex items-center gap-3'>
            <span className='font-medium text-sm shrink-0'>Tải từ mẫu:</span>
            <div className='flex-1 max-w-xs'>
              <AppSelect options={templateOptions} value={templateId} onChange={handleSelectTemplate} placeholder='Chọn mẫu ngày hành trình...' />
            </div>
          </div>

          <Form {...localForm}>
            <div className='space-y-4'>
              <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
                <FormSelect name='country' options={countriesOptions} label='Quốc gia' required />
                <FormSelect name='city' options={citiesOptions} label='Thành phố' disabled={!watchedCountry} required />
              </div>
              <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
                <FormInput name='code' label='Mã ngày' required />
                <FormInput name='title' label='Tên hành trình' required />
                <FormTextarea name='description' label='Mô tả' className='sm:col-span-2' />
              </div>
              <TourDayServicesSection />
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}

export default function TourDayForm() {
  const { control, formState } = useFormContext<TourFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "days" });

  const handleAdd = () => append(mapDayDataToFormValues(undefined));

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
