import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import { Button } from "@/shared/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

export type DayFilters = {
  search: string;
};

const DEFAULT_FILTERS: DayFilters = {
  search: "",
};

interface DayFilterBarProps {
  onFilter: (filters: DayFilters) => void;
}

export default function DayFilterBar({ onFilter }: DayFilterBarProps) {
  const [filters, setFilters] = useState<DayFilters>(DEFAULT_FILTERS);

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
      <SearchBox value={filters.search} onChange={handleChange} placeholder='Tìm theo tiêu đề hoặc mã hành trình...' />

      <Button type='button' variant='outline' onClick={handleReset}>
        <RotateCcw className='w-4 h-4' />
        Đặt lại
      </Button>
    </div>
  );
}
