import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { groupTourMockStore } from "@/modules/masterData/groupTour/data/group-tour.mock-store";
import DayServicesSection from "@/modules/tour/day/components/DayServicesSection";
import { NumberOfPeopleProvider } from "@/modules/tour/day/contexts/NumberOfPeopleContext";
import { dayMockStore } from "@/modules/tour/day/data/day.mock-store";
import { mapDayDataToFormValues } from "@/modules/tour/day/mappers/day-form.mapper";
import { daySchema, type DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import { SERVICE_TYPE_CONFIG } from "@/modules/tour/day/types/day.type";
import type { TourFormValues, TourGroupTourItemFormValues } from "@/modules/tour/tour/schemas/tour.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import Section from "@/shared/components/common/Section";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea";
import ActionButton from "@/shared/components/table/ActionButton";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Form } from "@/shared/components/ui/form";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, ChevronsUpDown, PlusCircle } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, useFormContext, useWatch } from "react-hook-form";

// ─── Shared row props ───────────────────────────────────────────────────────

interface TourItineraryRowProps {
  index: number;
  total: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

// ─── Day item row ────────────────────────────────────────────────────────────

function TourDayItemRow({ index, total, onRemove, onMoveUp, onMoveDown }: TourItineraryRowProps) {
  const parentForm = useFormContext<TourFormValues>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [templateId, setTemplateId] = useState<string>("");

  const allDays = useMemo(() => dayMockStore.getAll(), []);
  const templateOptions = useMemo(() => allDays.map((d) => ({ label: `[${d.code}] ${d.title}`, value: d.id })), [allDays]);

  const parentValues = parentForm.getValues(`itinerary.${index}`) as (DayFormValues & { kind: "day" }) | undefined;
  const { kind: _kind, ...dayDefaults } = parentValues ?? { kind: "day" as const, ...mapDayDataToFormValues(undefined) };

  const localForm = useForm<DayFormValues>({
    resolver: zodResolver(daySchema),
    defaultValues: (dayDefaults as DayFormValues | undefined) ?? mapDayDataToFormValues(undefined),
  });

  useEffect(() => {
    const { unsubscribe } = localForm.watch((values) => {
      parentForm.setValue(`itinerary.${index}`, { kind: "day" as const, ...(values as DayFormValues) }, { shouldDirty: true });
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
    parentForm.setValue(`itinerary.${index}`, { kind: "day" as const, ...values }, { shouldDirty: true });
  };

  return (
    <div className='bg-background border rounded-md overflow-hidden'>
      <div className='flex flex-wrap items-center gap-3 px-3 py-2'>
        <span className='w-14 font-medium text-sm shrink-0'>Ngày {index + 1}</span>

        <Badge variant='secondary' className='shrink-0'>
          Lịch trình
        </Badge>

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
              <DayServicesSection />
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}

// ─── Group tour item row ─────────────────────────────────────────────────────

function TourGroupTourItemRow({ index, total, onRemove, onMoveUp, onMoveDown }: TourItineraryRowProps) {
  const { control, setValue } = useFormContext<TourFormValues>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterCountry, setFilterCountry] = useState("");
  const [filterCity, setFilterCity] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = useWatch({ control, name: `itinerary.${index}` as any }) as TourGroupTourItemFormValues;
  const groupTourId = item?.groupTourId ?? "";
  const pricingPeriodId = item?.pricingPeriodId ?? "";
  const dayGroupId = item?.dayGroupId ?? "";

  const allGroupTours = useMemo(() => groupTourMockStore.getAll(), []);

  const { data: countries = [] } = useCountries();
  const countryOptions = useMemo(() => countries.map((c) => ({ label: c.country, value: c.country })), [countries]);

  const { data: cities = [] } = useCities(filterCountry);
  const cityOptions = useMemo(() => cities.map((city) => ({ label: city, value: city })), [cities]);

  const groupTourOptions = useMemo(() => {
    let items = allGroupTours;
    if (filterCountry) items = items.filter((t) => t.country === filterCountry);
    if (filterCity) items = items.filter((t) => t.city === filterCity);
    return items.map((t) => ({ label: t.tourName, value: t.id }));
  }, [allGroupTours, filterCountry, filterCity]);

  const selectedTour = useMemo(() => allGroupTours.find((t) => t.id === groupTourId), [allGroupTours, groupTourId]);

  const pricingPeriodOptions = useMemo(() => {
    if (!selectedTour) return [];
    return selectedTour.pricingPeriods.map((p) => ({ label: p.label, value: p.id }));
  }, [selectedTour]);

  const selectedPeriod = useMemo(() => selectedTour?.pricingPeriods.find((p) => p.id === pricingPeriodId), [selectedTour, pricingPeriodId]);

  const allDayGroups = useMemo(() => selectedPeriod?.dateRanges.flatMap((dr) => dr.dayGroups) ?? [], [selectedPeriod]);

  const dayGroupOptions = useMemo(() => {
    if (!selectedPeriod) return [];
    const seen = new Set<string>();
    return allDayGroups.filter((g) => (seen.has(g.id) ? false : seen.add(g.id))).map((g) => ({ label: g.label, value: g.id }));
  }, [selectedPeriod, allDayGroups]);

  const computedPrice = useMemo(() => {
    if (!selectedPeriod || !dayGroupId) return null;
    const dg = allDayGroups.find((g) => g.id === dayGroupId);
    if (!dg) return null;
    return { price: dg.price, currency: selectedPeriod.currency };
  }, [selectedPeriod, allDayGroups, dayGroupId]);

  const prevPriceKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const key = computedPrice ? `${computedPrice.price}-${computedPrice.currency}` : null;
    if (key === prevPriceKeyRef.current) return;
    prevPriceKeyRef.current = key;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(`itinerary.${index}.unitPrice` as any, computedPrice?.price ?? 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(`itinerary.${index}.currency` as any, computedPrice?.currency ?? "");
  }, [computedPrice, index, setValue]);

  const prevTourIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (groupTourId === prevTourIdRef.current) return;
    prevTourIdRef.current = groupTourId;
    if (selectedTour) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(`itinerary.${index}.name` as any, selectedTour.tourName);
      setFilterCountry(selectedTour.country);
      setFilterCity(selectedTour.city);
    }
  }, [selectedTour, groupTourId, index, setValue]);

  const resetDownstream = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(`itinerary.${index}.groupTourId` as any, "");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(`itinerary.${index}.pricingPeriodId` as any, "");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(`itinerary.${index}.dayGroupId` as any, "");
  };

  const name = item?.name ?? "";
  const unitPrice = item?.unitPrice ?? 0;
  const currency = item?.currency ?? "";

  return (
    <div className='bg-background border rounded-md overflow-hidden'>
      <div className='flex flex-wrap items-center gap-3 px-3 py-2'>
        <span className='w-14 font-medium text-sm shrink-0'>Ngày {index + 1}</span>

        <Badge variant='secondary' className='bg-blue-50 border-blue-300 text-blue-700 shrink-0'>
          Nhóm tour
        </Badge>

        <span className='flex-1 min-w-0 text-sm truncate'>{name || <span className='text-muted-foreground italic'>Chưa chọn nhóm tour</span>}</span>

        {unitPrice > 0 && currency && (
          <Badge variant='outline' className='bg-green-50 border-green-300 text-green-700 shrink-0'>
            {currency === "VND" ? formatNumberVN(unitPrice) : unitPrice.toLocaleString()} {currency}
          </Badge>
        )}

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

      {isExpanded && (
        <div className='space-y-3 p-4 border-t'>
          <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
            <Field>
              <FieldLabel>Quốc gia</FieldLabel>
              <AppSelect
                options={countryOptions}
                value={filterCountry}
                onChange={(v) => {
                  setFilterCountry(v ?? "");
                  setFilterCity("");
                  resetDownstream();
                }}
                placeholder='Chọn quốc gia'
              />
            </Field>

            <Field>
              <FieldLabel>Thành phố</FieldLabel>
              <AppSelect
                options={cityOptions}
                value={filterCity}
                onChange={(v) => {
                  setFilterCity(v ?? "");
                  resetDownstream();
                }}
                placeholder='Chọn thành phố'
                disabled={!filterCountry}
              />
            </Field>
          </div>

          <FormSelect
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            name={`itinerary.${index}.groupTourId` as any}
            label='Nhóm tour'
            options={groupTourOptions}
            onChange={() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setValue(`itinerary.${index}.pricingPeriodId` as any, "");
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setValue(`itinerary.${index}.dayGroupId` as any, "");
            }}
            placeholder='Chọn nhóm tour'
          />

          <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
            <FormSelect
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              name={`itinerary.${index}.pricingPeriodId` as any}
              label='Giai đoạn giá'
              options={pricingPeriodOptions}
              onChange={() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setValue(`itinerary.${index}.dayGroupId` as any, "");
              }}
              placeholder='Chọn giai đoạn giá'
              disabled={!groupTourId}
            />

            <FormSelect
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              name={`itinerary.${index}.dayGroupId` as any}
              label='Nhóm ngày'
              options={dayGroupOptions}
              placeholder='Chọn nhóm ngày'
              disabled={!pricingPeriodId}
            />
          </div>

          {computedPrice && (
            <p className='font-semibold text-green-600 text-lg'>
              Giá: {formatNumberVN(computedPrice.price)} {computedPrice.currency}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Dispatcher row (memo’d to block re-renders from parent) ────────────────

interface TourItineraryDispatchProps {
  index: number;
  total: number;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
}

const TourItineraryRow = memo(function TourItineraryRow({ index, total, remove, move }: TourItineraryDispatchProps) {
  const { control } = useFormContext<TourFormValues>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kind = useWatch({ control, name: `itinerary.${index}.kind` as any });

  const onRemove = useCallback(() => remove(index), [remove, index]);
  const onMoveUp = useCallback(() => move(index, index - 1), [move, index]);
  const onMoveDown = useCallback(() => move(index, index + 1), [move, index]);

  if (kind === "group_tour")
    return <TourGroupTourItemRow index={index} total={total} onRemove={onRemove} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />;
  return <TourDayItemRow index={index} total={total} onRemove={onRemove} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />;
});

// ─── Main export ─────────────────────────────────────────────────────────────

export default function TourDayForm() {
  const { control, formState } = useFormContext<TourFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "itinerary" });
  const numberOfPeople = (useWatch({ control, name: "numberOfPeople" }) as number) ?? 1;

  const handleAddDay = () => append({ kind: "day" as const, ...mapDayDataToFormValues(undefined) });
  const handleAddGroupTour = () =>
    append({ kind: "group_tour" as const, groupTourId: "", pricingPeriodId: "", dayGroupId: "", name: "", unitPrice: 0, currency: "" });

  if (fields.length === 0) {
    return (
      <Section type='dashed' bgColor='transparent' className='text-muted-foreground text-sm text-center'>
        <p className='mb-3'>Chưa có mục nào. Nhấn &quot;Thêm ngày&quot; hoặc &quot;Thêm nhóm tour&quot; để bắt đầu.</p>
        <div className='flex justify-center gap-2'>
          <Button type='button' onClick={handleAddDay}>
            <PlusCircle className='w-4 h-4' />
            Thêm ngày
          </Button>
          <Button type='button' variant='secondary' onClick={handleAddGroupTour}>
            <PlusCircle className='w-4 h-4' />
            Thêm nhóm tour
          </Button>
        </div>
        {formState.errors.itinerary?.message && <p className='mt-2 font-normal text-destructive text-sm'>{formState.errors.itinerary.message}</p>}
      </Section>
    );
  }

  return (
    <NumberOfPeopleProvider value={numberOfPeople}>
      <div className='space-y-3'>
        {fields.map((field, index) => (
          <TourItineraryRow key={field.id} index={index} total={fields.length} remove={remove} move={move} />
        ))}
        <div className='flex gap-2'>
          <Button type='button' onClick={handleAddDay}>
            <PlusCircle className='w-4 h-4' />
            Thêm ngày
          </Button>
          <Button type='button' variant='secondary' onClick={handleAddGroupTour}>
            <PlusCircle className='w-4 h-4' />
            Thêm nhóm tour
          </Button>
        </div>
        {formState.errors.itinerary?.message && <p className='font-normal text-destructive text-sm'>{formState.errors.itinerary.message}</p>}
      </div>
    </NumberOfPeopleProvider>
  );
}
