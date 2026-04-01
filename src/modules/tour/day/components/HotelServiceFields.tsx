import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { hotelMockStore } from "@/modules/masterData/hotel/data/hotel.mock-store";
import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import FormSelect from "@/shared/components/form/FormSelect";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface HotelServiceFieldsProps {
  index: number;
}

export default function HotelServiceFields({ index }: HotelServiceFieldsProps) {
  const { control, setValue } = useFormContext<DayFormValues>();

  const [filterCountry, setFilterCountry] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterRate, setFilterRate] = useState("");

  const hotelId = useWatch({ control, name: `services.${index}.hotelDetail.hotelId` });
  const pricingPeriodId = useWatch({ control, name: `services.${index}.hotelDetail.pricingPeriodId` });
  const dayGroupId = useWatch({ control, name: `services.${index}.hotelDetail.dayGroupId` });
  const roomTypeId = useWatch({ control, name: `services.${index}.hotelDetail.roomTypeId` });

  const allHotels = useMemo(() => hotelMockStore.getAll(), []);

  const { data: countries = [] } = useCountries();
  const countryOptions = useMemo(() => countries.map((c) => ({ label: c.country, value: c.country })), [countries]);

  const { data: cities = [] } = useCities(filterCountry);
  const cityOptions = useMemo(() => cities.map((city) => ({ label: city, value: city })), [cities]);

  const rateOptions = useMemo(() => {
    let hotels = allHotels;
    if (filterCountry) hotels = hotels.filter((h) => h.country === filterCountry);
    if (filterCity) hotels = hotels.filter((h) => h.city === filterCity);
    const rates = [...new Set(hotels.map((h) => h.rate))].sort();
    return rates.map((r) => ({ label: `${r} sao`, value: r }));
  }, [allHotels, filterCountry, filterCity]);

  const hotelOptions = useMemo(() => {
    let hotels = allHotels;
    if (filterCountry) hotels = hotels.filter((h) => h.country === filterCountry);
    if (filterCity) hotels = hotels.filter((h) => h.city === filterCity);
    if (filterRate) hotels = hotels.filter((h) => h.rate === filterRate);
    return hotels.map((h) => ({ label: h.name, value: h.id }));
  }, [allHotels, filterCountry, filterCity, filterRate]);

  const selectedHotel = useMemo(() => allHotels.find((h) => h.id === hotelId), [allHotels, hotelId]);

  const pricingPeriodOptions = useMemo(() => {
    if (!selectedHotel) return [];
    return selectedHotel.pricingPeriods.map((p) => ({ label: p.label, value: p.id }));
  }, [selectedHotel]);

  const selectedPeriod = useMemo(() => selectedHotel?.pricingPeriods.find((p) => p.id === pricingPeriodId), [selectedHotel, pricingPeriodId]);

  const roomTypeOptions = useMemo(() => {
    if (!selectedHotel) return [];
    return selectedHotel.roomTypes.map((rt) => ({ label: rt.name, value: String(rt.id) }));
  }, [selectedHotel]);

  const dayGroupOptions = useMemo(() => {
    if (!selectedPeriod) return [];
    return selectedPeriod.dayGroups.map((g) => ({ label: g.label, value: g.id }));
  }, [selectedPeriod]);

  const computedPrice = useMemo(() => {
    if (!selectedPeriod || !dayGroupId || !roomTypeId) return null;
    const pricing = selectedPeriod.prices.find((p) => String(p.roomTypeId) === roomTypeId);
    if (!pricing) return null;
    const dgPrice = pricing.dayGroupPrices.find((dgp) => dgp.dayGroupId === dayGroupId);
    if (!dgPrice) return null;
    return { price: dgPrice.price, currency: selectedPeriod.currency };
  }, [selectedPeriod, dayGroupId, roomTypeId]);

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

  const prevHotelIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (hotelId === prevHotelIdRef.current) return;
    prevHotelIdRef.current = hotelId;
    if (selectedHotel) {
      setValue(`services.${index}.name`, selectedHotel.name);
      setFilterCountry(selectedHotel.country);
      setFilterCity(selectedHotel.city);
      setFilterRate(selectedHotel.rate);
    }
  }, [selectedHotel, hotelId, index, setValue]);

  const resetDownstream = (from: "hotel" | "period") => {
    if (from === "hotel") {
      setValue(`services.${index}.hotelDetail.hotelId`, "");
    }
    setValue(`services.${index}.hotelDetail.pricingPeriodId`, "");
    setValue(`services.${index}.hotelDetail.dayGroupId`, "");
    setValue(`services.${index}.hotelDetail.roomTypeId`, "");
  };

  useEffect(() => {
    console.log(`[${index}] filterCountry:`, filterCountry);
  }, [filterCountry, index]);

  return (
    <div className='space-y-3 mt-1 pt-3 border-t'>
      <div className='gap-3 grid grid-cols-1 sm:grid-cols-3'>
        <Field>
          <FieldLabel>Quốc gia</FieldLabel>
          <AppSelect
            options={countryOptions}
            value={filterCountry}
            onChange={(v) => {
              setFilterCountry(v);
              setFilterCity("");
              setFilterRate("");
              resetDownstream("hotel");
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
              setFilterRate("");
              resetDownstream("hotel");
            }}
            placeholder='Chọn thành phố'
            disabled={!filterCountry}
          />
        </Field>

        <Field>
          <FieldLabel>Hạng sao</FieldLabel>
          <AppSelect
            options={rateOptions}
            value={filterRate}
            onChange={(v) => {
              setFilterRate(v);
              resetDownstream("hotel");
            }}
            placeholder='Chọn hạng sao'
            disabled={!filterCountry}
          />
        </Field>
      </div>

      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <FormSelect
          name={`services.${index}.hotelDetail.hotelId`}
          label='Khách sạn'
          options={hotelOptions}
          onChange={() => {
            setValue(`services.${index}.hotelDetail.pricingPeriodId`, "");
            setValue(`services.${index}.hotelDetail.dayGroupId`, "");
            setValue(`services.${index}.hotelDetail.roomTypeId`, "");
          }}
          placeholder='Chọn khách sạn'
        />

        <FormSelect
          name={`services.${index}.hotelDetail.pricingPeriodId`}
          label='Khoảng ngày'
          options={pricingPeriodOptions}
          onChange={() => {
            setValue(`services.${index}.hotelDetail.dayGroupId`, "");
            setValue(`services.${index}.hotelDetail.roomTypeId`, "");
          }}
          placeholder='Chọn khoảng ngày'
        />
      </div>

      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <FormSelect name={`services.${index}.hotelDetail.roomTypeId`} label='Hạng phòng' options={roomTypeOptions} placeholder='Chọn hạng phòng' />
        <FormSelect name={`services.${index}.hotelDetail.dayGroupId`} label='Nhóm ngày' options={dayGroupOptions} placeholder='Chọn nhóm ngày' />
      </div>

      {computedPrice && (
        <p className='font-semibold text-green-600 text-lg'>
          Giá: {formatNumberVN(computedPrice.price)} {computedPrice.currency}
        </p>
      )}
    </div>
  );
}
