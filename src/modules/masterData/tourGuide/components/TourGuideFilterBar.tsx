import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { DEFAULT_FILTERS } from "@/modules/masterData/tourGuide/pages/TourGuideListPage";
import AppSelect from "@/shared/components/common/AppSelect";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import { Button } from "@/shared/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

const LANGUAGE_OPTIONS = [
  { label: "Tiếng Anh", value: "Tiếng Anh" },
  { label: "Tiếng Pháp", value: "Tiếng Pháp" },
  { label: "Tiếng Trung", value: "Tiếng Trung" },
  { label: "Tiếng Nhật", value: "Tiếng Nhật" },
  { label: "Tiếng Hàn", value: "Tiếng Hàn" },
  { label: "Tiếng Đức", value: "Tiếng Đức" },
  { label: "Tiếng Tây Ban Nha", value: "Tiếng Tây Ban Nha" },
  { label: "Tiếng Ý", value: "Tiếng Ý" },
];

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
        <AppSelect options={LANGUAGE_OPTIONS} value={filters.language} onChange={(v) => handleChange("language", v)} placeholder='Ngôn ngữ' />
      </div>

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
