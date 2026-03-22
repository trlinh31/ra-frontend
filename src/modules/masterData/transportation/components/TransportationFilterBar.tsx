import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import { Button } from "@/shared/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

export type TransportationFilters = {
  search: string;
};

const DEFAULT_FILTERS: TransportationFilters = {
  search: "",
};

interface TransportationFilterBarProps {
  onFilter: (filters: TransportationFilters) => void;
  placeholder?: string;
}

export default function TransportationFilterBar({ onFilter, placeholder = "Tìm kiếm..." }: TransportationFilterBarProps) {
  const [filters, setFilters] = useState<TransportationFilters>(DEFAULT_FILTERS);

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
      <SearchBox value={filters.search} onChange={handleChange} placeholder={placeholder} />

      <Button type='button' variant='outline' onClick={handleReset}>
        <RotateCcw className='w-4 h-4' />
        Đặt lại
      </Button>
    </div>
  );
}
