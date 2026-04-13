import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { entranceFeeMockStore } from "@/modules/masterData/entranceFee/data/entrance-fee.mock-store";
import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import FormSelect from "@/shared/components/form/FormSelect";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface EntranceFeeServiceFieldsProps {
  index: number;
}

export default function EntranceFeeServiceFields({ index }: EntranceFeeServiceFieldsProps) {
  const { control, setValue } = useFormContext<DayFormValues>();

  const [filterCountry, setFilterCountry] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const entranceFeeId = useWatch({ control, name: `services.${index}.entranceFeeDetail.entranceFeeId` });
  const pricingPeriodId = useWatch({ control, name: `services.${index}.entranceFeeDetail.pricingPeriodId` });
  const dayGroupId = useWatch({ control, name: `services.${index}.entranceFeeDetail.dayGroupId` });

  const allItems = useMemo(() => entranceFeeMockStore.getAllItems(), []);

  const { data: countries = [] } = useCountries();
  const countryOptions = useMemo(() => countries.map((c) => ({ label: c.country, value: c.country })), [countries]);

  const { data: cities = [] } = useCities(filterCountry);
  const cityOptions = useMemo(() => cities.map((city) => ({ label: city, value: city })), [cities]);

  const entranceFeeOptions = useMemo(() => {
    let items = allItems;
    if (filterCountry) items = items.filter((i) => i.country === filterCountry);
    if (filterCity) items = items.filter((i) => i.city === filterCity);
    return items.map((i) => ({ label: i.serviceName, value: i.id }));
  }, [allItems, filterCountry, filterCity]);

  const selectedItem = useMemo(() => allItems.find((i) => i.id === entranceFeeId), [allItems, entranceFeeId]);

  const pricingPeriodOptions = useMemo(() => {
    if (!selectedItem) return [];
    return selectedItem.pricingPeriods.map((p) => ({ label: p.label, value: p.id }));
  }, [selectedItem]);

  const selectedPeriod = useMemo(() => selectedItem?.pricingPeriods.find((p) => p.id === pricingPeriodId), [selectedItem, pricingPeriodId]);

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
    return { adultPrice: dg.adultPrice, childPrice: dg.childPrice, currency: selectedPeriod.currency };
  }, [selectedPeriod, allDayGroups, dayGroupId]);

  const prevPriceKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const key = computedPrice ? `${computedPrice.adultPrice}-${computedPrice.childPrice}-${computedPrice.currency}` : null;
    if (key === prevPriceKeyRef.current) return;
    prevPriceKeyRef.current = key;
    if (computedPrice) {
      setValue(`services.${index}.unitPrice`, computedPrice.adultPrice, { shouldValidate: true });
      setValue(`services.${index}.currency`, computedPrice.currency, { shouldValidate: true });
      setValue(`services.${index}.entranceFeeDetail.adultPrice`, computedPrice.adultPrice);
      setValue(`services.${index}.entranceFeeDetail.childPrice`, computedPrice.childPrice);
    } else {
      setValue(`services.${index}.unitPrice`, 0);
      setValue(`services.${index}.currency`, "");
      setValue(`services.${index}.entranceFeeDetail.adultPrice`, undefined);
      setValue(`services.${index}.entranceFeeDetail.childPrice`, undefined);
    }
  }, [computedPrice, index, setValue]);

  const prevEntranceFeeIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (entranceFeeId === prevEntranceFeeIdRef.current) return;
    prevEntranceFeeIdRef.current = entranceFeeId;
    if (selectedItem) {
      setValue(`services.${index}.name`, selectedItem.serviceName);
      setFilterCountry(selectedItem.country);
      setFilterCity(selectedItem.city);
    }
  }, [selectedItem, entranceFeeId, index, setValue]);

  const resetDownstream = () => {
    setValue(`services.${index}.entranceFeeDetail.entranceFeeId`, "");
    setValue(`services.${index}.entranceFeeDetail.pricingPeriodId`, "");
    setValue(`services.${index}.entranceFeeDetail.dayGroupId`, "");
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
        name={`services.${index}.entranceFeeDetail.entranceFeeId`}
        label='Phí vào cổng'
        options={entranceFeeOptions}
        onChange={() => {
          setValue(`services.${index}.entranceFeeDetail.pricingPeriodId`, "");
          setValue(`services.${index}.entranceFeeDetail.dayGroupId`, "");
        }}
        placeholder='Chọn phí vào cổng'
      />

      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <FormSelect
          name={`services.${index}.entranceFeeDetail.pricingPeriodId`}
          label='Giai đoạn giá'
          options={pricingPeriodOptions}
          onChange={() => {
            setValue(`services.${index}.entranceFeeDetail.dayGroupId`, "");
          }}
          placeholder='Chọn giai đoạn giá'
          disabled={!entranceFeeId}
        />

        <FormSelect
          name={`services.${index}.entranceFeeDetail.dayGroupId`}
          label='Nhóm ngày'
          options={dayGroupOptions}
          placeholder='Chọn nhóm ngày'
          disabled={!pricingPeriodId}
        />
      </div>

      {computedPrice && (
        <div className='flex flex-wrap gap-4 font-semibold text-green-600 text-sm'>
          <span>
            Người lớn: {formatNumberVN(computedPrice.adultPrice)} {computedPrice.currency}
          </span>
          <span>
            Trẻ em: {formatNumberVN(computedPrice.childPrice)} {computedPrice.currency}
          </span>
        </div>
      )}
    </div>
  );
}
