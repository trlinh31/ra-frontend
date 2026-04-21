import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { DEFAULT_FILTERS } from "@/modules/masterData/tourGuide/pages/TourGuideListPage";
import AppSelect from "@/shared/components/common/AppSelect";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import { Button } from "@/shared/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

interface TourGuideFilterBarProps {
  onFilter: (filters: typeof DEFAULT_FILTERS) => void;
}

export default function TourGuideFilterBar({ onFilter }: TourGuideFilterBarProps) {
  const [filters, setFilters] = useState<typeof DEFAULT_FILTERS>(DEFAULT_FILTERS);

  const { data: countries } = useCountries();

  const countryOptions = (countries ?? []).map((c) => ({ label: c.country, value: c.country }));
  const cityOptions = (countries ?? []).find((c) => c.country === filters.country)?.cities.map((city) => ({ label: city, value: city })) ?? [];

  const handleChange = (key: keyof typeof DEFAULT_FILTERS, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilter(next);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    onFilter(DEFAULT_FILTERS);
  };

  return (
    <div className='flex flex-wrap items-end gap-3'>
      <SearchBox value={filters.name} onChange={(value) => handleChange("name", value)} placeholder='Tìm theo tên hướng dẫn viên...' />

      <div className='min-w-40'>
        <AppSelect options={countryOptions} value={filters.country} onChange={(v) => handleChange("country", v)} placeholder='Quốc gia' />
      </div>

      <div className='min-w-40'>
        <AppSelect options={cityOptions} value={filters.city} onChange={(v) => handleChange("city", v)} placeholder='Thành phố' />
      </div>

      <Button type='button' variant='outline' onClick={handleReset}>
        <RotateCcw className='w-4 h-4' />
        Đặt lại
      </Button>
    </div>
  );
}
