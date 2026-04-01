import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { transportMockStore } from "@/modules/masterData/transportation/data/transportation.mock-store";
import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import FormSelect from "@/shared/components/form/FormSelect";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface TransportServiceFieldsProps {
  index: number;
}

export default function TransportServiceFields({ index }: TransportServiceFieldsProps) {
  const { control, setValue } = useFormContext<DayFormValues>();

  const [filterCountry, setFilterCountry] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const transportId = useWatch({ control, name: `services.${index}.transportDetail.transportId` });
  const capacity = useWatch({ control, name: `services.${index}.transportDetail.capacity` });

  const allTransports = useMemo(() => transportMockStore.getAll(), []);

  const { data: countries = [] } = useCountries();
  const countryOptions = useMemo(() => countries.map((c) => ({ label: c.country, value: c.country })), [countries]);

  const { data: cities = [] } = useCities(filterCountry);
  const cityOptions = useMemo(() => cities.map((city) => ({ label: city, value: city })), [cities]);

  const transportOptions = useMemo(() => {
    let items = allTransports;
    if (filterCountry) items = items.filter((t) => t.country === filterCountry);
    if (filterCity) items = items.filter((t) => t.city === filterCity);
    return items.map((t) => ({ label: t.name, value: t.id }));
  }, [allTransports, filterCountry, filterCity]);

  const selectedTransport = useMemo(() => allTransports.find((t) => t.id === transportId), [allTransports, transportId]);

  const capacityOptions = useMemo(() => {
    if (!selectedTransport) return [];
    return selectedTransport.vehicleCapacityPrice.map((vcp) => ({
      label: `${vcp.capacity} chỗ`,
      value: String(vcp.capacity),
    }));
  }, [selectedTransport]);

  const computedPrice = useMemo(() => {
    if (!selectedTransport || !capacity) return null;
    const vcp = selectedTransport.vehicleCapacityPrice.find((v) => String(v.capacity) === capacity);
    if (!vcp) return null;
    return { price: vcp.price, currency: vcp.currency };
  }, [selectedTransport, capacity]);

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

  const prevTransportIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (transportId === prevTransportIdRef.current) return;
    prevTransportIdRef.current = transportId;
    if (selectedTransport) {
      setValue(`services.${index}.name`, selectedTransport.name);
      setFilterCountry(selectedTransport.country);
      setFilterCity(selectedTransport.city);
    }
  }, [selectedTransport, transportId, index, setValue]);

  const resetTransport = () => {
    setValue(`services.${index}.transportDetail.transportId`, "");
    setValue(`services.${index}.transportDetail.capacity`, "");
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
              resetTransport();
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
              resetTransport();
            }}
            placeholder='Chọn thành phố'
            disabled={!filterCountry}
          />
        </Field>
      </div>

      <FormSelect
        name={`services.${index}.transportDetail.transportId`}
        label='Lịch trình'
        options={transportOptions}
        onChange={() => {
          setValue(`services.${index}.transportDetail.capacity`, "");
        }}
        placeholder='Chọn lịch trình'
      />

      <FormSelect
        name={`services.${index}.transportDetail.capacity`}
        label='Sức chứa'
        options={capacityOptions}
        placeholder='Chọn sức chứa'
        disabled={!transportId}
      />

      {computedPrice && (
        <p className='font-semibold text-green-600 text-lg'>
          Giá: {formatNumberVN(computedPrice.price)} {computedPrice.currency}
        </p>
      )}
    </div>
  );
}
