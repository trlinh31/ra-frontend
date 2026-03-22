import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import { Button } from "@/shared/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

export type TourFilters = {
  search: string;
};

const DEFAULT_FILTERS: TourFilters = {
  search: "",
};

interface TourFilterBarProps {
  onFilter: (filters: TourFilters) => void;
}

export default function TourFilterBar({ onFilter }: TourFilterBarProps) {
  const [filters, setFilters] = useState<TourFilters>(DEFAULT_FILTERS);

  const handleChange = (value: string) => {
    const next = { search: value };
    setFilters(next);
    onFilter(next);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    onFilter(DEFAULT_FILTERS);
  };

  return (
    <div className='flex flex-wrap items-end gap-3'>
      <SearchBox value={filters.search} onChange={handleChange} placeholder='Tìm theo mã hoặc tên tour...' />

      <Button type='button' variant='outline' onClick={handleReset}>
        <RotateCcw className='w-4 h-4' />
        Đặt lại
      </Button>
    </div>
  );
}
