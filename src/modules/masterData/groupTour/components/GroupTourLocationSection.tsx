import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import type { GroupTourFormValues } from "@/modules/masterData/groupTour/schemas/group-tour.schema";
import Section from "@/shared/components/common/Section";
import FormSelect from "@/shared/components/form/FormSelect";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

export default function GroupTourLocationSection() {
  const { watch } = useFormContext<GroupTourFormValues>();

  const { data: countries } = useCountries();
  const { data: cities } = useCities(watch("country") || "");

  const countriesOptions = useMemo(() => (countries ?? []).map((item) => ({ label: item.country, value: item.country })), [countries]);
  const citiesOptions = useMemo(() => (cities ?? []).map((city) => ({ label: city, value: city })), [cities]);

  return (
    <Section title='1. Địa điểm'>
      <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
        <FormSelect name='country' options={countriesOptions} label='Quốc gia' required />
        <FormSelect name='city' options={citiesOptions} label='Thành phố' disabled={!watch("country")} required />
      </div>
    </Section>
  );
}
