import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { tourGuideMockStore } from "@/modules/masterData/tourGuide/data/tourGuide.mock-store";
import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import FormSelect from "@/shared/components/form/FormSelect";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import InlinePriceInput from "./InlinePriceInput";

interface TourGuideServiceFieldsProps {
  index: number;
}

export default function TourGuideServiceFields({ index }: TourGuideServiceFieldsProps) {
  const { control, setValue } = useFormContext<DayFormValues>();

  const [filterCountry, setFilterCountry] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const tourGuideId = useWatch({ control, name: `services.${index}.tourGuideDetail.tourGuideId` });

  const allGuides = useMemo(() => tourGuideMockStore.getAll().filter((g) => g.isActive), []);

  const { data: countries = [] } = useCountries();
  const countryOptions = useMemo(() => countries.map((c) => ({ label: c.country, value: c.country })), [countries]);

  const { data: cities = [] } = useCities(filterCountry);
  const cityOptions = useMemo(() => cities.map((city) => ({ label: city, value: city })), [cities]);

  const guideOptions = useMemo(() => {
    let items = allGuides;
    if (filterCountry) items = items.filter((g) => g.country === filterCountry);
    if (filterCity) items = items.filter((g) => g.city === filterCity);
    return items.map((g) => ({ label: `${g.name} (${g.language})`, value: g.id }));
  }, [allGuides, filterCountry, filterCity]);

  const selectedGuide = useMemo(() => allGuides.find((g) => g.id === tourGuideId), [allGuides, tourGuideId]);

  const prevGuideIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (tourGuideId === prevGuideIdRef.current) return;
    prevGuideIdRef.current = tourGuideId;
    if (selectedGuide) {
      setValue(`services.${index}.name`, selectedGuide.name, { shouldValidate: true });
      setValue(`services.${index}.unitPrice`, selectedGuide.pricePerDay, { shouldValidate: true });
      setValue(`services.${index}.currency`, "VND", { shouldValidate: true });
    }
  }, [tourGuideId, selectedGuide, index, setValue]);

  return (
    <div className='space-y-4 mt-3'>
      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <Field>
          <FieldLabel>Lọc theo quốc gia</FieldLabel>
          <AppSelect
            value={filterCountry}
            options={countryOptions}
            placeholder='Tất cả quốc gia'
            onChange={(v) => {
              setFilterCountry(v);
              setFilterCity("");
            }}
          />
        </Field>

        <Field>
          <FieldLabel>Lọc theo thành phố</FieldLabel>
          <AppSelect value={filterCity} options={cityOptions} placeholder='Tất cả thành phố' disabled={!filterCountry} onChange={setFilterCity} />
        </Field>
      </div>

      <FormSelect name={`services.${index}.tourGuideDetail.tourGuideId`} label='Hướng dẫn viên' options={guideOptions} required />

      {selectedGuide && (
        <div className='space-y-1 bg-muted/50 p-3 rounded-md text-sm'>
          <p className='text-muted-foreground'>
            Ngôn ngữ: <span className='font-medium text-foreground'>{selectedGuide.language}</span>
          </p>
          <p className='text-muted-foreground'>
            Địa điểm:{" "}
            <span className='font-medium text-foreground'>
              {selectedGuide.city}, {selectedGuide.country}
            </span>
          </p>
          <p className='text-muted-foreground'>
            Giá/ngày: <span className='font-medium text-primary'>{formatNumberVN(selectedGuide.pricePerDay)} VND</span>
          </p>
        </div>
      )}

      <InlinePriceInput
        index={index}
        breakdownText={selectedGuide ? `${selectedGuide.name} — ${formatNumberVN(selectedGuide.pricePerDay)} VND/ngày` : undefined}
      />
    </div>
  );
}
