import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { groupTourMockStore } from "@/modules/masterData/groupTour/data/group-tour.mock-store";
import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import FormSelect from "@/shared/components/form/FormSelect";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface GroupTourServiceFieldsProps {
  index: number;
}

export default function GroupTourServiceFields({ index }: GroupTourServiceFieldsProps) {
  const { control, setValue } = useFormContext<DayFormValues>();

  const [filterCountry, setFilterCountry] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const groupTourId = useWatch({ control, name: `services.${index}.groupTourDetail.groupTourId` });
  const pricingPeriodId = useWatch({ control, name: `services.${index}.groupTourDetail.pricingPeriodId` });
  const dayGroupId = useWatch({ control, name: `services.${index}.groupTourDetail.dayGroupId` });

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
      setValue(`services.${index}.unitPrice`, computedPrice.price, { shouldValidate: true });
      setValue(`services.${index}.currency`, computedPrice.currency, { shouldValidate: true });
    } else {
      setValue(`services.${index}.unitPrice`, 0);
      setValue(`services.${index}.currency`, "");
    }
  }, [computedPrice, index, setValue]);

  const prevGroupTourIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (groupTourId === prevGroupTourIdRef.current) return;
    prevGroupTourIdRef.current = groupTourId;
    if (selectedTour) {
      setValue(`services.${index}.name`, selectedTour.tourName);
      setFilterCountry(selectedTour.country);
      setFilterCity(selectedTour.city);
    }
  }, [selectedTour, groupTourId, index, setValue]);

  const resetDownstream = () => {
    setValue(`services.${index}.groupTourDetail.groupTourId`, "");
    setValue(`services.${index}.groupTourDetail.pricingPeriodId`, "");
    setValue(`services.${index}.groupTourDetail.dayGroupId`, "");
  };

  return (
    <div className='space-y-3 mt-1 pt-3 border-t'>
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
        name={`services.${index}.groupTourDetail.groupTourId`}
        label='Nhóm tour'
        options={groupTourOptions}
        onChange={() => {
          setValue(`services.${index}.groupTourDetail.pricingPeriodId`, "");
          setValue(`services.${index}.groupTourDetail.dayGroupId`, "");
        }}
        placeholder='Chọn nhóm tour'
      />

      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <FormSelect
          name={`services.${index}.groupTourDetail.pricingPeriodId`}
          label='Giai đoạn giá'
          options={pricingPeriodOptions}
          onChange={() => {
            setValue(`services.${index}.groupTourDetail.dayGroupId`, "");
          }}
          placeholder='Chọn giai đoạn giá'
          disabled={!groupTourId}
        />

        <FormSelect
          name={`services.${index}.groupTourDetail.dayGroupId`}
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
  );
}
