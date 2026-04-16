import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { flightMockStore } from "@/modules/masterData/flights/data/flight.mock-store";
import { useNumberOfPeople } from "@/modules/tour/day/contexts/NumberOfPeopleContext";
import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import FormSelect from "@/shared/components/form/FormSelect";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import InlinePriceInput from "./InlinePriceInput";

interface FlightServiceFieldsProps {
  index: number;
}

export default function FlightServiceFields({ index }: FlightServiceFieldsProps) {
  const { control, setValue } = useFormContext<DayFormValues>();
  const numberOfPeople = useNumberOfPeople();

  const [filterFromCountry, setFilterFromCountry] = useState("");
  const [filterFromCity, setFilterFromCity] = useState("");
  const [filterToCountry, setFilterToCountry] = useState("");
  const [filterToCity, setFilterToCity] = useState("");

  const flightId = useWatch({ control, name: `services.${index}.flightDetail.flightId` });
  const pricingPeriodId = useWatch({ control, name: `services.${index}.flightDetail.pricingPeriodId` });
  const seatClassId = useWatch({ control, name: `services.${index}.flightDetail.seatClassId` });
  const dayGroupId = useWatch({ control, name: `services.${index}.flightDetail.dayGroupId` });

  const allFlights = useMemo(() => flightMockStore.getAll(), []);

  const { data: countries = [] } = useCountries();
  const countryOptions = useMemo(() => countries.map((c) => ({ label: c.country, value: c.country })), [countries]);

  const { data: fromCities = [] } = useCities(filterFromCountry);
  const fromCityOptions = useMemo(() => fromCities.map((city) => ({ label: city, value: city })), [fromCities]);

  const { data: toCities = [] } = useCities(filterToCountry);
  const toCityOptions = useMemo(() => toCities.map((city) => ({ label: city, value: city })), [toCities]);

  const flightOptions = useMemo(() => {
    let items = allFlights;
    if (filterFromCountry) items = items.filter((f) => f.fromCountry === filterFromCountry);
    if (filterFromCity) items = items.filter((f) => f.fromCity === filterFromCity);
    if (filterToCountry) items = items.filter((f) => f.toCountry === filterToCountry);
    if (filterToCity) items = items.filter((f) => f.toCity === filterToCity);
    return items.map((f) => ({
      label: `${f.origin} → ${f.destination} (${f.airline})`,
      value: f.id,
    }));
  }, [allFlights, filterFromCountry, filterFromCity, filterToCountry, filterToCity]);

  const selectedFlight = useMemo(() => allFlights.find((f) => f.id === flightId), [allFlights, flightId]);

  const pricingPeriodOptions = useMemo(() => {
    if (!selectedFlight) return [];
    return selectedFlight.pricingPeriods.map((p) => ({ label: p.label, value: p.id }));
  }, [selectedFlight]);

  const selectedPeriod = useMemo(() => selectedFlight?.pricingPeriods.find((p) => p.id === pricingPeriodId), [selectedFlight, pricingPeriodId]);

  const seatClassOptions = useMemo(() => {
    if (!selectedFlight) return [];
    return selectedFlight.seatClasses.map((sc) => ({ label: sc.name, value: String(sc.id) }));
  }, [selectedFlight]);

  const allDayGroups = useMemo(() => selectedPeriod?.dateRanges.flatMap((dr) => dr.dayGroups) ?? [], [selectedPeriod]);

  const dayGroupOptions = useMemo(() => {
    if (!selectedPeriod) return [];
    const filtered = seatClassId ? allDayGroups.filter((g) => String(g.seatClassId) === seatClassId) : allDayGroups;
    const seen = new Set<string>();
    return filtered.filter((g) => (seen.has(g.id) ? false : seen.add(g.id))).map((g) => ({ label: g.label, value: g.id }));
  }, [selectedPeriod, allDayGroups, seatClassId]);

  const computedPrice = useMemo(() => {
    if (!selectedPeriod || !dayGroupId || !seatClassId) return null;
    const dg = allDayGroups.find((g) => g.id === dayGroupId && String(g.seatClassId) === seatClassId);
    if (!dg) return null;
    return { pricePerSeat: dg.price, totalPrice: dg.price * numberOfPeople, currency: selectedPeriod.currency };
  }, [selectedPeriod, allDayGroups, dayGroupId, seatClassId, numberOfPeople]);

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

  const prevFlightIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (flightId === prevFlightIdRef.current) return;
    prevFlightIdRef.current = flightId;
    if (selectedFlight) {
      setValue(`services.${index}.name`, `${selectedFlight.origin} → ${selectedFlight.destination} (${selectedFlight.airline})`);
      setFilterFromCountry(selectedFlight.fromCountry);
      setFilterFromCity(selectedFlight.fromCity);
      setFilterToCountry(selectedFlight.toCountry);
      setFilterToCity(selectedFlight.toCity);
    }
  }, [selectedFlight, flightId, index, setValue]);

  const resetDownstream = () => {
    setValue(`services.${index}.flightDetail.flightId`, "");
    setValue(`services.${index}.flightDetail.pricingPeriodId`, "");
    setValue(`services.${index}.flightDetail.seatClassId`, "");
    setValue(`services.${index}.flightDetail.dayGroupId`, "");
  };

  return (
    <div className='space-y-3 mt-1 pt-3 border-t'>
      <div className='gap-3 grid grid-cols-2 sm:grid-cols-4'>
        <Field>
          <FieldLabel>Quốc gia đi</FieldLabel>
          <AppSelect
            options={countryOptions}
            value={filterFromCountry}
            onChange={(v) => {
              setFilterFromCountry(v);
              setFilterFromCity("");
              resetDownstream();
            }}
            placeholder='Chọn quốc gia'
          />
        </Field>

        <Field>
          <FieldLabel>Thành phố đi</FieldLabel>
          <AppSelect
            options={fromCityOptions}
            value={filterFromCity}
            onChange={(v) => {
              setFilterFromCity(v);
              resetDownstream();
            }}
            placeholder='Chọn thành phố'
            disabled={!filterFromCountry}
          />
        </Field>

        <Field>
          <FieldLabel>Quốc gia đến</FieldLabel>
          <AppSelect
            options={countryOptions}
            value={filterToCountry}
            onChange={(v) => {
              setFilterToCountry(v);
              setFilterToCity("");
              resetDownstream();
            }}
            placeholder='Chọn quốc gia'
          />
        </Field>

        <Field>
          <FieldLabel>Thành phố đến</FieldLabel>
          <AppSelect
            options={toCityOptions}
            value={filterToCity}
            onChange={(v) => {
              setFilterToCity(v);
              resetDownstream();
            }}
            placeholder='Chọn thành phố'
            disabled={!filterToCountry}
          />
        </Field>
      </div>

      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <FormSelect
          name={`services.${index}.flightDetail.flightId`}
          label='Chuyến bay'
          options={flightOptions}
          onChange={() => {
            setValue(`services.${index}.flightDetail.pricingPeriodId`, "");
            setValue(`services.${index}.flightDetail.seatClassId`, "");
            setValue(`services.${index}.flightDetail.dayGroupId`, "");
          }}
          placeholder='Chọn chuyến bay'
        />

        <FormSelect
          name={`services.${index}.flightDetail.pricingPeriodId`}
          label='Giai đoạn giá'
          options={pricingPeriodOptions}
          onChange={() => {
            setValue(`services.${index}.flightDetail.seatClassId`, "");
            setValue(`services.${index}.flightDetail.dayGroupId`, "");
          }}
          placeholder='Chọn giai đoạn giá'
          disabled={!flightId}
        />

        <FormSelect
          name={`services.${index}.flightDetail.seatClassId`}
          label='Hạng vé'
          options={seatClassOptions}
          onChange={() => {
            setValue(`services.${index}.flightDetail.dayGroupId`, "");
          }}
          placeholder='Chọn hạng vé'
          disabled={!pricingPeriodId}
        />

        <FormSelect
          name={`services.${index}.flightDetail.dayGroupId`}
          label='Nhóm ngày'
          options={dayGroupOptions}
          placeholder='Chọn nhóm ngày'
          disabled={!seatClassId}
        />
      </div>

      {computedPrice && (
        <InlinePriceInput
          index={index}
          breakdownText={`${numberOfPeople} người × ${formatNumberVN(computedPrice.pricePerSeat)} ${computedPrice.currency}`}
        />
      )}
    </div>
  );
}
