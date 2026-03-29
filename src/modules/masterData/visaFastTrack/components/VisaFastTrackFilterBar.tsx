import AppSelect from "@/shared/components/common/AppSelect";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import { Button } from "@/shared/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { VISA_GROUP_OPTIONS } from "../constants/visa-group-options.constant";
import type { Country } from "@/shared/types/country/country.type";

export type VisaFastTrackFilters = {
  serviceName: string;
  group: string;
  provider: string;
  country: string;
  city: string;
};

const DEFAULT_FILTERS: VisaFastTrackFilters = {
  serviceName: "",
  group: "",
  provider: "",
  country: "",
  city: "", 
};

interface VisaFastTrackFilterBarProps {
  onFilter: (filters: VisaFastTrackFilters) => void;
  providerOptions: { label: string; value: string }[];
  countries: Country[];
}

export default function VisaFastTrackFilterBar({countries, onFilter ,providerOptions}: VisaFastTrackFilterBarProps) {
  const [filters, setFilters] = useState<VisaFastTrackFilters>(DEFAULT_FILTERS);

  const handleChange = (key: keyof VisaFastTrackFilters, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilter(next);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    onFilter(DEFAULT_FILTERS);
  };

  const countryOptions = countries.map((c) => ({ label: c.country, value: c.country }));
  const cityOptions = countries.find((c) => c.country === filters.country)?.cities.map((city) => ({ label: city, value: city })) ?? [];

  return (
    <div className='flex flex-wrap items-end gap-3'>
      
      <div className='min-w-50'>
          <AppSelect options={providerOptions} value={filters.provider} onChange={(v) => handleChange("provider", v)} placeholder='Nhà cung cấp' />
      </div>
      <div className='min-w-40'>
        <AppSelect options={countryOptions} value={filters.country} onChange={(v) => handleChange("country", v)} placeholder='Quốc gia' />
      </div>
      <div className='min-w-40'>
        <AppSelect options={cityOptions} value={filters.city} onChange={(v) => handleChange("city", v)} placeholder='Thành phố' />
      </div>
      <div className='min-w-30'>
        <AppSelect options={VISA_GROUP_OPTIONS} value={filters.group} onChange={(v) => handleChange("group", v)} placeholder='Nhóm' />
      </div>
      <SearchBox value={filters.serviceName} onChange={(value) => handleChange("serviceName", value)} placeholder='Tìm theo tên dịch vụ...' />

      <Button type='button' variant='outline' onClick={handleReset}>
        <RotateCcw className='w-4 h-4' />
        Đặt lại
      </Button>
    </div>
  );
}
