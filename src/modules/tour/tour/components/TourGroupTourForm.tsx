import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { groupTourMockStore } from "@/modules/masterData/groupTour/data/group-tour.mock-store";
import type { TourFormValues } from "@/modules/tour/tour/schemas/tour.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import Section from "@/shared/components/common/Section";
import FormSelect from "@/shared/components/form/FormSelect";
import ActionButton from "@/shared/components/table/ActionButton";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

interface TourGroupTourRowProps {
  index: number;
  onRemove: () => void;
}

function TourGroupTourRow({ index, onRemove }: TourGroupTourRowProps) {
  const { control, setValue } = useFormContext<TourFormValues>();

  const [filterCountry, setFilterCountry] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const groupTourId = useWatch({ control, name: `groupTours.${index}.groupTourId` });
  const pricingPeriodId = useWatch({ control, name: `groupTours.${index}.pricingPeriodId` });
  const dayGroupId = useWatch({ control, name: `groupTours.${index}.dayGroupId` });

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
    if (computedPrice) {
      setValue(`groupTours.${index}.unitPrice`, computedPrice.price);
      setValue(`groupTours.${index}.currency`, computedPrice.currency);
    } else {
      setValue(`groupTours.${index}.unitPrice`, 0);
      setValue(`groupTours.${index}.currency`, "");
    }
  }, [computedPrice, index, setValue]);

  const prevTourIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (groupTourId === prevTourIdRef.current) return;
    prevTourIdRef.current = groupTourId;
    if (selectedTour) {
      setValue(`groupTours.${index}.name`, selectedTour.tourName);
      setFilterCountry(selectedTour.country);
      setFilterCity(selectedTour.city);
    }
  }, [selectedTour, groupTourId, index, setValue]);

  const resetDownstream = () => {
    setValue(`groupTours.${index}.groupTourId`, "");
    setValue(`groupTours.${index}.pricingPeriodId`, "");
    setValue(`groupTours.${index}.dayGroupId`, "");
  };

  return (
    <Section type='dashed' borderColor='red' className='relative'>
      <div className='top-3 right-3 absolute'>
        <ActionButton action='delete' variant='destructive' onClick={onRemove} />
      </div>

      <div className='space-y-3'>
        <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
          <Field>
            <FieldLabel>Quốc gia</FieldLabel>
            <AppSelect
              options={countryOptions}
              value={filterCountry}
              onChange={(v) => {
                setFilterCountry(v);
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
                setFilterCity(v);
                resetDownstream();
              }}
              placeholder='Chọn thành phố'
              disabled={!filterCountry}
            />
          </Field>
        </div>

        <FormSelect
          name={`groupTours.${index}.groupTourId`}
          label='Nhóm tour'
          options={groupTourOptions}
          onChange={() => {
            setValue(`groupTours.${index}.pricingPeriodId`, "");
            setValue(`groupTours.${index}.dayGroupId`, "");
          }}
          placeholder='Chọn nhóm tour'
        />

        <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
          <FormSelect
            name={`groupTours.${index}.pricingPeriodId`}
            label='Giai đoạn giá'
            options={pricingPeriodOptions}
            onChange={() => {
              setValue(`groupTours.${index}.dayGroupId`, "");
            }}
            placeholder='Chọn giai đoạn giá'
            disabled={!groupTourId}
          />

          <FormSelect
            name={`groupTours.${index}.dayGroupId`}
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
    </Section>
  );
}

export default function TourGroupTourForm() {
  const { control, formState } = useFormContext<TourFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "groupTours" });

  const handleAdd = () => {
    append({ groupTourId: "", pricingPeriodId: "", dayGroupId: "", name: "", unitPrice: 0, currency: "" });
  };

  if (fields.length === 0) {
    return (
      <Section type='dashed' className='text-muted-foreground text-xs text-center'>
        <p className='mb-3'>Chưa có nhóm tour nào. Nhấn &ldquo;Thêm nhóm tour&rdquo; để bắt đầu.</p>
        <ActionButton action='add' text='Thêm nhóm tour' variant='default' size='default' onClick={handleAdd} />
      </Section>
    );
  }

  return (
    <div className='space-y-4'>
      {fields.map((field, index) => (
        <TourGroupTourRow key={field.id} index={index} onRemove={() => remove(index)} />
      ))}

      <div className='flex justify-center'>
        <ActionButton action='add' text='Thêm nhóm tour' variant='default' size='default' onClick={handleAdd} />
      </div>

      {formState.errors.groupTours?.message && <FieldError errors={[formState.errors.groupTours]} />}
    </div>
  );
}
