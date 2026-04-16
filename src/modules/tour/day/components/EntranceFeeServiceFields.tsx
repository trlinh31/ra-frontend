import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { entranceFeeMockStore } from "@/modules/masterData/entranceFee/data/entrance-fee.mock-store";
import { useNumberOfPeople } from "@/modules/tour/day/contexts/NumberOfPeopleContext";
import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import InlinePriceInput from "./InlinePriceInput";

interface EntranceFeeServiceFieldsProps {
  index: number;
}

type PriceBase = { pricePerPerson: number; currency: string };

interface EntranceFeePriceSectionProps {
  index: number;
  priceBase: PriceBase | null;
  numberOfPeople: number;
  disabled: boolean;
}

function EntranceFeePriceSection({ index, priceBase, numberOfPeople, disabled }: EntranceFeePriceSectionProps) {
  const { control, setValue } = useFormContext<DayFormValues>();
  const count = useWatch({ control, name: `services.${index}.entranceFeeDetail.count` });

  const qty = Number(count) > 0 ? Number(count) : 0;
  const totalPrice = priceBase && qty > 0 ? priceBase.pricePerPerson * qty : null;

  const prevPriceKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const key = totalPrice != null && priceBase ? `${totalPrice}-${priceBase.currency}` : null;
    if (key === prevPriceKeyRef.current) return;
    prevPriceKeyRef.current = key;
    if (totalPrice != null && priceBase) {
      setValue(`services.${index}.unitPrice`, totalPrice, { shouldValidate: true });
      setValue(`services.${index}.currency`, priceBase.currency, { shouldValidate: true });
    } else {
      setValue(`services.${index}.unitPrice`, 0);
      setValue(`services.${index}.currency`, "");
    }
  }, [totalPrice, priceBase, index, setValue]);

  return (
    <>
      <div className='items-end gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <FormInput
          name={`services.${index}.entranceFeeDetail.count`}
          label='Số lượng'
          type='number'
          min={1}
          max={numberOfPeople}
          placeholder='Nhập số lượng'
          disabled={disabled}
        />
        {numberOfPeople > 0 && <p className='pb-2 text-muted-foreground text-xs'>Tổng tour: {numberOfPeople} người</p>}
      </div>

      {priceBase && totalPrice != null && (
        <InlinePriceInput index={index} breakdownText={`${qty} người × ${formatNumberVN(priceBase.pricePerPerson)} ${priceBase.currency}`} />
      )}
    </>
  );
}

export default function EntranceFeeServiceFields({ index }: EntranceFeeServiceFieldsProps) {
  const { control, setValue } = useFormContext<DayFormValues>();
  const numberOfPeople = useNumberOfPeople();

  const [filterCountry, setFilterCountry] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const entranceFeeId = useWatch({ control, name: `services.${index}.entranceFeeDetail.entranceFeeId` });
  const pricingPeriodId = useWatch({ control, name: `services.${index}.entranceFeeDetail.pricingPeriodId` });
  const ticketTypeIndex = useWatch({ control, name: `services.${index}.entranceFeeDetail.ticketTypeIndex` });
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

  const ticketTypeOptions = useMemo(() => {
    if (!selectedItem) return [];
    return selectedItem.ticketTypes.map((tt, i) => ({ label: tt.name, value: String(i) }));
  }, [selectedItem]);

  const allDayGroups = useMemo(() => selectedPeriod?.dateRanges.flatMap((dr) => dr.dayGroups) ?? [], [selectedPeriod]);

  const dayGroupOptions = useMemo(() => {
    if (!selectedPeriod) return [];
    const filtered = ticketTypeIndex ? allDayGroups.filter((g) => g.ticketTypeIndex === ticketTypeIndex) : allDayGroups;
    const seen = new Set<string>();
    return filtered.filter((g) => (seen.has(g.id) ? false : seen.add(g.id))).map((g) => ({ label: g.label, value: g.id }));
  }, [selectedPeriod, allDayGroups, ticketTypeIndex]);

  const computedPriceBase = useMemo((): PriceBase | null => {
    if (!selectedPeriod || !ticketTypeIndex || !dayGroupId) return null;
    const dg = allDayGroups.find((g) => g.id === dayGroupId && g.ticketTypeIndex === ticketTypeIndex);
    if (!dg) return null;
    return { pricePerPerson: dg.price, currency: selectedPeriod.currency };
  }, [selectedPeriod, allDayGroups, ticketTypeIndex, dayGroupId]);

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
    setValue(`services.${index}.entranceFeeDetail.ticketTypeIndex`, "");
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

      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <FormSelect
          name={`services.${index}.entranceFeeDetail.entranceFeeId`}
          label='Phí vào cổng'
          options={entranceFeeOptions}
          onChange={() => {
            setValue(`services.${index}.entranceFeeDetail.pricingPeriodId`, "");
            setValue(`services.${index}.entranceFeeDetail.ticketTypeIndex`, "");
            setValue(`services.${index}.entranceFeeDetail.dayGroupId`, "");
          }}
          placeholder='Chọn phí vào cổng'
        />

        <FormSelect
          name={`services.${index}.entranceFeeDetail.pricingPeriodId`}
          label='Khoảng ngày'
          options={pricingPeriodOptions}
          onChange={() => {
            setValue(`services.${index}.entranceFeeDetail.ticketTypeIndex`, "");
            setValue(`services.${index}.entranceFeeDetail.dayGroupId`, "");
          }}
          placeholder='Chọn khoảng ngày'
          disabled={!entranceFeeId}
        />
      </div>

      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <FormSelect
          name={`services.${index}.entranceFeeDetail.ticketTypeIndex`}
          label='Loại đối tượng'
          options={ticketTypeOptions}
          onChange={() => {
            setValue(`services.${index}.entranceFeeDetail.dayGroupId`, "");
          }}
          placeholder='Chọn loại đối tượng'
          disabled={!pricingPeriodId}
        />
        <FormSelect
          name={`services.${index}.entranceFeeDetail.dayGroupId`}
          label='Nhóm ngày'
          options={dayGroupOptions}
          placeholder='Chọn nhóm ngày'
          disabled={!ticketTypeIndex}
        />
      </div>

      <EntranceFeePriceSection index={index} priceBase={computedPriceBase} numberOfPeople={numberOfPeople} disabled={!dayGroupId} />
    </div>
  );
}
