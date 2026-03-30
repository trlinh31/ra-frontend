import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { HOTEL_RATE_OPTIONS } from "@/modules/masterData/hotel/constants/hotel-rate-options.constant";
import { DEFAULT_FILTERS } from "@/modules/masterData/hotel/pages/HotelListPage";
import AppSelect from "@/shared/components/common/AppSelect";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import { Button } from "@/shared/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

interface HotelFilterBarProps {
  onFilter: (filters: typeof DEFAULT_FILTERS) => void;
}

export default function HotelFilterBar({ onFilter }: HotelFilterBarProps) {
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
      <SearchBox value={filters.name} onChange={(value) => handleChange("name", value)} placeholder='Tìm theo tên khách sạn...' />

      <div className='min-w-40'>
        <AppSelect options={countryOptions} value={filters.country} onChange={(v) => handleChange("country", v)} placeholder='Quốc gia' />
      </div>

      <div className='min-w-40'>
        <AppSelect options={cityOptions} value={filters.city} onChange={(v) => handleChange("city", v)} placeholder='Thành phố' />
      </div>

      <div className='min-w-36'>
        <AppSelect options={HOTEL_RATE_OPTIONS} value={filters.rate} onChange={(v) => handleChange("rate", v)} placeholder='Hạng sao' />
      </div>

      <Button type='button' variant='outline' onClick={handleReset}>
        <RotateCcw className='w-4 h-4' />
        Đặt lại
      </Button>
    </div>
  );
}
