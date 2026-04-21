import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { restaurantMockStore } from "@/modules/masterData/restaurant/data/restaurant.mock-store";
import { useNumberOfPeople } from "@/modules/tour/day/contexts/NumberOfPeopleContext";
import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import FormSelect from "@/shared/components/form/FormSelect";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { formatDate } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import InlinePriceInput from "./InlinePriceInput";

interface RestaurantServiceFieldsProps {
  index: number;
}

export default function RestaurantServiceFields({ index }: RestaurantServiceFieldsProps) {
  const { control, setValue } = useFormContext<DayFormValues>();
  const numberOfPeople = useNumberOfPeople();

  const [filterCountry, setFilterCountry] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const restaurantId = useWatch({ control, name: `services.${index}.restaurantDetail.restaurantId` });
  const pricingPeriodIndex = useWatch({ control, name: `services.${index}.restaurantDetail.pricingPeriodIndex` });
  const comboPackageIndex = useWatch({ control, name: `services.${index}.restaurantDetail.comboPackageIndex` });
  const dayGroupKey = useWatch({ control, name: `services.${index}.restaurantDetail.dayGroupKey` });

  const allRestaurants = useMemo(() => restaurantMockStore.getAll().filter((r) => r.isActive), []);

  const { data: countries = [] } = useCountries();
  const countryOptions = useMemo(() => countries.map((c) => ({ label: c.country, value: c.country })), [countries]);

  const { data: cities = [] } = useCities(filterCountry);
  const cityOptions = useMemo(() => cities.map((city) => ({ label: city, value: city })), [cities]);

  const restaurantOptions = useMemo(() => {
    let items = allRestaurants;
    if (filterCountry) items = items.filter((r) => r.country === filterCountry);
    if (filterCity) items = items.filter((r) => r.city === filterCity);
    return items.map((r) => ({ label: r.name, value: r.id }));
  }, [allRestaurants, filterCountry, filterCity]);

  const selectedRestaurant = useMemo(() => allRestaurants.find((r) => r.id === restaurantId), [allRestaurants, restaurantId]);

  const pricingPeriodOptions = useMemo(() => {
    if (!selectedRestaurant) return [];
    return selectedRestaurant.pricingPeriods.map((p, i) => {
      const label = p.dateRanges
        .filter((dr) => dr.from && dr.to)
        .map((dr) => `${formatDate(new Date(dr.from), "dd/MM/yyyy")} – ${formatDate(new Date(dr.to), "dd/MM/yyyy")}`)
        .join(", ");
      return { label: label || `Giai đoạn #${i + 1}`, value: String(i) };
    });
  }, [selectedRestaurant]);

  const selectedPeriod = useMemo(() => {
    if (!selectedRestaurant || pricingPeriodIndex === "") return undefined;
    return selectedRestaurant.pricingPeriods[Number(pricingPeriodIndex)];
  }, [selectedRestaurant, pricingPeriodIndex]);

  const comboPackageOptions = useMemo(() => {
    if (!selectedRestaurant) return [];
    return selectedRestaurant.comboPackages.map((c, i) => ({
      label: `${c.name} (tối đa ${c.maxGuests} người)`,
      value: String(i),
    }));
  }, [selectedRestaurant]);

  const selectedCombo = useMemo(() => {
    if (!selectedRestaurant || comboPackageIndex === "") return undefined;
    return selectedRestaurant.comboPackages[Number(comboPackageIndex)];
  }, [selectedRestaurant, comboPackageIndex]);

  // Flatten all dayGroups in selected period filtered by selected combo, deduplicated by label
  const allDayGroupsInPeriod = useMemo(() => {
    if (!selectedPeriod) return [];
    return selectedPeriod.dateRanges.flatMap((dr, rangeIdx) => dr.dayGroups.map((g, groupIdx) => ({ ...g, key: `${rangeIdx}-${groupIdx}` })));
  }, [selectedPeriod]);

  const dayGroupOptions = useMemo(() => {
    if (!selectedPeriod || comboPackageIndex === "") return [];
    const filtered = allDayGroupsInPeriod.filter((g) => g.comboPackageIndex === comboPackageIndex);
    const seen = new Set<string>();
    return filtered.filter((g) => (seen.has(g.label) ? false : seen.add(g.label))).map((g) => ({ label: g.label, value: g.key }));
  }, [selectedPeriod, allDayGroupsInPeriod, comboPackageIndex]);

  const selectedDayGroup = useMemo(() => allDayGroupsInPeriod.find((g) => g.key === dayGroupKey), [allDayGroupsInPeriod, dayGroupKey]);

  const numberOfCombos = useMemo(() => {
    if (!selectedCombo || selectedCombo.maxGuests <= 0) return 1;
    return Math.ceil(numberOfPeople / selectedCombo.maxGuests);
  }, [numberOfPeople, selectedCombo]);

  const computedPrice = useMemo(() => {
    if (!selectedDayGroup || !selectedPeriod) return null;
    return {
      pricePerCombo: selectedDayGroup.price,
      totalPrice: selectedDayGroup.price * numberOfCombos,
      currency: selectedPeriod.currency,
    };
  }, [selectedDayGroup, selectedPeriod, numberOfCombos]);

  // Sync computed price into form
  const prevPriceKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const key = computedPrice ? `${computedPrice.totalPrice}-${computedPrice.currency}` : null;
    if (key === prevPriceKeyRef.current) return;
    prevPriceKeyRef.current = key;
    if (computedPrice) {
      setValue(`services.${index}.unitPrice`, computedPrice.totalPrice, { shouldValidate: true });
      setValue(`services.${index}.currency`, computedPrice.currency, { shouldValidate: true });
    } else {
      setValue(`services.${index}.unitPrice`, 0);
      setValue(`services.${index}.currency`, "");
    }
  }, [computedPrice, index, setValue]);

  // Sync name when restaurant changes
  const prevRestaurantIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (restaurantId === prevRestaurantIdRef.current) return;
    prevRestaurantIdRef.current = restaurantId;
    if (selectedRestaurant) {
      setValue(`services.${index}.name`, selectedRestaurant.name);
      setValue(`services.${index}.restaurantDetail.pricingPeriodIndex`, "");
      setValue(`services.${index}.restaurantDetail.comboPackageIndex`, "");
      setValue(`services.${index}.restaurantDetail.dayGroupKey`, "");
      setFilterCountry(selectedRestaurant.country);
      setFilterCity(selectedRestaurant.city);
    }
  }, [restaurantId, selectedRestaurant, index, setValue]);

  const resetDownstream = (from: "restaurant" | "period" | "combo") => {
    if (from === "restaurant") setValue(`services.${index}.restaurantDetail.restaurantId`, "");
    if (from === "restaurant" || from === "period") setValue(`services.${index}.restaurantDetail.pricingPeriodIndex`, "");
    setValue(`services.${index}.restaurantDetail.comboPackageIndex`, "");
    setValue(`services.${index}.restaurantDetail.dayGroupKey`, "");
  };

  return (
    <div className='space-y-3 mt-1 pt-3 border-t'>
      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <Field>
          <FieldLabel>Quốc gia</FieldLabel>
          <AppSelect
            value={filterCountry}
            options={countryOptions}
            placeholder='Tất cả quốc gia'
            onChange={(v) => {
              setFilterCountry(v);
              setFilterCity("");
              resetDownstream("restaurant");
            }}
          />
        </Field>

        <Field>
          <FieldLabel>Thành phố</FieldLabel>
          <AppSelect
            value={filterCity}
            options={cityOptions}
            placeholder='Tất cả thành phố'
            disabled={!filterCountry}
            onChange={(v) => {
              setFilterCity(v);
              resetDownstream("restaurant");
            }}
          />
        </Field>
      </div>

      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <FormSelect
          name={`services.${index}.restaurantDetail.restaurantId`}
          label='Nhà hàng'
          options={restaurantOptions}
          placeholder='Chọn nhà hàng'
          onChange={() => {
            setValue(`services.${index}.restaurantDetail.pricingPeriodIndex`, "");
            setValue(`services.${index}.restaurantDetail.comboPackageIndex`, "");
            setValue(`services.${index}.restaurantDetail.dayGroupKey`, "");
          }}
          required
        />

        <FormSelect
          name={`services.${index}.restaurantDetail.pricingPeriodIndex`}
          label='Khoảng ngày'
          options={pricingPeriodOptions}
          placeholder='Chọn khoảng ngày'
          disabled={!restaurantId}
          onChange={() => {
            setValue(`services.${index}.restaurantDetail.comboPackageIndex`, "");
            setValue(`services.${index}.restaurantDetail.dayGroupKey`, "");
          }}
          required
        />
      </div>

      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <FormSelect
          name={`services.${index}.restaurantDetail.comboPackageIndex`}
          label='Gói combo'
          options={comboPackageOptions}
          placeholder='Chọn gói combo'
          disabled={!pricingPeriodIndex}
          onChange={() => setValue(`services.${index}.restaurantDetail.dayGroupKey`, "")}
          required
        />

        <FormSelect
          name={`services.${index}.restaurantDetail.dayGroupKey`}
          label='Nhóm ngày'
          options={dayGroupOptions}
          placeholder='Chọn nhóm ngày'
          disabled={!comboPackageIndex}
          required
        />
      </div>

      {computedPrice && (
        <InlinePriceInput
          index={index}
          breakdownText={`${numberOfPeople} khách ÷ ${selectedCombo?.maxGuests ?? "?"} người/combo = ${numberOfCombos} combo × ${formatNumberVN(computedPrice.pricePerCombo)} ${computedPrice.currency}`}
        />
      )}
    </div>
  );
}
