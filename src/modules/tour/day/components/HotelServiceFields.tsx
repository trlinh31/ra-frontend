import { hotelMockStore } from "@/modules/masterData/hotel/data/hotel.mock-store";
import AppSelect from "@/shared/components/common/AppSelect";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

interface HotelServiceFieldsProps {
  index: number;
}

export default function HotelServiceFields({ index }: HotelServiceFieldsProps) {
  const { control, setValue } = useFormContext();

  const [filterCountry, setFilterCountry] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterRate, setFilterRate] = useState("");

  const hotelId = useWatch({ control, name: `services.${index}.hotelDetail.hotelId` }) as string;
  const pricingPeriodId = useWatch({ control, name: `services.${index}.hotelDetail.pricingPeriodId` }) as string;
  const dayGroupId = useWatch({ control, name: `services.${index}.hotelDetail.dayGroupId` }) as string;
  const roomTypeId = useWatch({ control, name: `services.${index}.hotelDetail.roomTypeId` }) as number;

  const allHotels = useMemo(() => hotelMockStore.getAll(), []);

  const countryOptions = useMemo(() => {
    const countries = [...new Set(allHotels.map((h) => h.country))];
    return countries.map((c) => ({ label: c, value: c }));
  }, [allHotels]);

  const cityOptions = useMemo(() => {
    if (!filterCountry) return [];
    const cities = [...new Set(allHotels.filter((h) => h.country === filterCountry).map((h) => h.city))];
    return cities.map((c) => ({ label: c, value: c }));
  }, [allHotels, filterCountry]);

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

  const dayGroupOptions = useMemo(() => {
    if (!selectedPeriod) return [];
    return selectedPeriod.dayGroups.map((g) => ({ label: g.label, value: g.id }));
  }, [selectedPeriod]);

  const roomTypeOptions = useMemo(() => {
    if (!selectedHotel) return [];
    return selectedHotel.roomTypes.map((rt) => ({ label: rt.name, value: String(rt.id) }));
  }, [selectedHotel]);

  const computedPrice = useMemo(() => {
    if (!selectedPeriod || !dayGroupId || !roomTypeId) return null;
    const pricing = selectedPeriod.prices.find((p) => p.roomTypeId === roomTypeId);
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
    }
  }, [computedPrice, index, setValue]);

  const prevHotelIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (hotelId === prevHotelIdRef.current) return;
    prevHotelIdRef.current = hotelId;
    if (selectedHotel) {
      setValue(`services.${index}.name`, selectedHotel.name);
    }
  }, [selectedHotel, hotelId, index, setValue]);

  const resetDownstream = (from: "hotel" | "period") => {
    if (from === "hotel") {
      setValue(`services.${index}.hotelDetail.hotelId`, "");
    }
    setValue(`services.${index}.hotelDetail.pricingPeriodId`, "");
    setValue(`services.${index}.hotelDetail.dayGroupId`, "");
    setValue(`services.${index}.hotelDetail.roomTypeId`, 0);
  };

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
        <Controller
          control={control}
          name={`services.${index}.hotelDetail.hotelId`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Khách sạn <span className='text-red-500'>*</span>
              </FieldLabel>
              <AppSelect
                options={hotelOptions}
                value={field.value || ""}
                onChange={(v) => {
                  field.onChange(v);
                  setValue(`services.${index}.hotelDetail.pricingPeriodId`, "");
                  setValue(`services.${index}.hotelDetail.dayGroupId`, "");
                  setValue(`services.${index}.hotelDetail.roomTypeId`, 0);
                }}
                placeholder='Chọn khách sạn'
                disabled={!filterCountry}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={control}
          name={`services.${index}.hotelDetail.pricingPeriodId`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Khoảng ngày <span className='text-red-500'>*</span>
              </FieldLabel>
              <AppSelect
                options={pricingPeriodOptions}
                value={field.value || ""}
                onChange={(v) => {
                  field.onChange(v);
                  setValue(`services.${index}.hotelDetail.dayGroupId`, "");
                  setValue(`services.${index}.hotelDetail.roomTypeId`, 0);
                }}
                placeholder='Chọn khoảng ngày'
                disabled={!hotelId}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <Controller
          control={control}
          name={`services.${index}.hotelDetail.dayGroupId`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Nhóm ngày <span className='text-red-500'>*</span>
              </FieldLabel>
              <AppSelect
                options={dayGroupOptions}
                value={field.value || ""}
                onChange={field.onChange}
                placeholder='Chọn nhóm ngày'
                disabled={!pricingPeriodId}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={control}
          name={`services.${index}.hotelDetail.roomTypeId`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Hạng phòng <span className='text-red-500'>*</span>
              </FieldLabel>
              <AppSelect
                options={roomTypeOptions}
                value={field.value ? String(field.value) : ""}
                onChange={(v) => field.onChange(v ? Number(v) : 0)}
                placeholder='Chọn hạng phòng'
                disabled={!pricingPeriodId}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}
