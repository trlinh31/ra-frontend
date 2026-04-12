import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { visaFastTrackMockStore } from "@/modules/masterData/visaFastTrack/data/visa-fast-track.mock-store";
import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import FormSelect from "@/shared/components/form/FormSelect";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface VisaServiceFieldsProps {
  index: number;
}

export default function VisaServiceFields({ index }: VisaServiceFieldsProps) {
  const { control, setValue } = useFormContext<DayFormValues>();

  const [filterCountry, setFilterCountry] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const providerId = useWatch({ control, name: `services.${index}.visaDetail.providerId` });
  const serviceName = useWatch({ control, name: `services.${index}.visaDetail.serviceName` });

  const allProviders = useMemo(() => visaFastTrackMockStore.getAll(), []);

  const { data: countries = [] } = useCountries();
  const countryOptions = useMemo(() => countries.map((c) => ({ label: c.country, value: c.country })), [countries]);

  const { data: cities = [] } = useCities(filterCountry);
  const cityOptions = useMemo(() => cities.map((city) => ({ label: city, value: city })), [cities]);

  const providerOptions = useMemo(() => {
    let items = allProviders;
    if (filterCountry) items = items.filter((p) => p.country === filterCountry);
    if (filterCity) items = items.filter((p) => p.city === filterCity);
    return items.map((p) => ({ label: p.provider, value: p.id }));
  }, [allProviders, filterCountry, filterCity]);

  const selectedProvider = useMemo(() => allProviders.find((p) => p.id === providerId), [allProviders, providerId]);

  const serviceOptions = useMemo(() => {
    if (!selectedProvider) return [];
    return selectedProvider.services.map((s) => ({
      label: `[${s.group}] ${s.serviceName}`,
      value: s.serviceName,
    }));
  }, [selectedProvider]);

  const computedPrice = useMemo(() => {
    if (!selectedProvider || !serviceName) return null;
    const svc = selectedProvider.services.find((s) => s.serviceName === serviceName);
    if (!svc) return null;
    return { price: svc.price, currency: svc.priceUnit };
  }, [selectedProvider, serviceName]);

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

  const prevProviderIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (providerId === prevProviderIdRef.current) return;
    prevProviderIdRef.current = providerId;
    if (selectedProvider) {
      setValue(`services.${index}.name`, selectedProvider.provider);
      setFilterCountry(selectedProvider.country);
      setFilterCity(selectedProvider.city);
    }
  }, [selectedProvider, providerId, index, setValue]);

  const resetDownstream = () => {
    setValue(`services.${index}.visaDetail.providerId`, "");
    setValue(`services.${index}.visaDetail.serviceName`, "");
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
        name={`services.${index}.visaDetail.providerId`}
        label='Nhà cung cấp'
        options={providerOptions}
        onChange={() => {
          setValue(`services.${index}.visaDetail.serviceName`, "");
        }}
        placeholder='Chọn nhà cung cấp'
      />

      <FormSelect
        name={`services.${index}.visaDetail.serviceName`}
        label='Dịch vụ'
        options={serviceOptions}
        placeholder='Chọn dịch vụ'
        disabled={!providerId}
      />

      {computedPrice && (
        <p className='font-semibold text-green-600 text-lg'>
          Giá: {formatNumberVN(computedPrice.price)} {computedPrice.currency}
        </p>
      )}
    </div>
  );
}
