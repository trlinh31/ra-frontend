import { HOTEL_RATE_OPTIONS } from "@/modules/masterData/hotel/constants/hotel-rate-options.constant";
import { DEFAULT_FILTERS } from "@/modules/masterData/hotel/pages/HotelListPage";
import AppSelect from "@/shared/components/common/AppSelect";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import { Button } from "@/shared/components/ui/button";
import type { Country } from "@/shared/types/country/country.type";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

export type HotelFilters = {
  name: string;
  rate: string;
  country: string;
  city: string;
  isActive: string;
};

const STATUS_OPTIONS = [
  { label: "Đang hoạt động", value: "true" },
  { label: "Ngừng hoạt động", value: "false" },
];

interface HotelFilterBarProps {
  countries: Country[];
  onFilter: (filters: HotelFilters) => void;
}

export default function HotelFilterBar({ countries, onFilter }: HotelFilterBarProps) {
  const [filters, setFilters] = useState<HotelFilters>(DEFAULT_FILTERS);

  const countryOptions = countries.map((c) => ({ label: c.country, value: c.iso2 }));
  const cityOptions = countries.find((c) => c.iso2 === filters.country)?.cities.map((city) => ({ label: city, value: city })) ?? [];

  const handleChange = (key: keyof HotelFilters, value: string) => {
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
