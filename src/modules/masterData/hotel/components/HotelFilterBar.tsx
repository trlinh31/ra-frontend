import { HOTEL_RATE_OPTIONS } from "@/modules/masterData/hotel/constants/hotel-rate-options.constant";
import AppSelect from "@/shared/components/common/AppSelect";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import { Button } from "@/shared/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

export type HotelFilters = {
  name: string;
  rate: string;
  country: string;
  isActive: string;
};

const DEFAULT_FILTERS: HotelFilters = {
  name: "",
  rate: "",
  country: "",
  isActive: "",
};

const STATUS_OPTIONS = [
  { label: "Đang hoạt động", value: "true" },
  { label: "Ngừng hoạt động", value: "false" },
];

interface HotelFilterBarProps {
  countries: string[];
  onFilter: (filters: HotelFilters) => void;
}

export default function HotelFilterBar({ countries, onFilter }: HotelFilterBarProps) {
  const [filters, setFilters] = useState<HotelFilters>(DEFAULT_FILTERS);

  const countryOptions = countries.map((c) => ({ label: c, value: c }));

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

      <div className='min-w-36'>
        <AppSelect options={HOTEL_RATE_OPTIONS} value={filters.rate} onChange={(v) => handleChange("rate", v)} placeholder='Đánh giá' />
      </div>

      <div className='min-w-40'>
        <AppSelect options={countryOptions} value={filters.country} onChange={(v) => handleChange("country", v)} placeholder='Quốc gia' />
      </div>

      <div className='min-w-44'>
        <AppSelect options={STATUS_OPTIONS} value={filters.isActive} onChange={(v) => handleChange("isActive", v)} placeholder='Trạng thái' />
      </div>

      <Button type='button' variant='outline' onClick={handleReset}>
        <RotateCcw className='w-4 h-4' />
        Đặt lại
      </Button>
    </div>
  );
}
