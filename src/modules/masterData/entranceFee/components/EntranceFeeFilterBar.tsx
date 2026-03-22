import AppSelect from "@/shared/components/common/AppSelect";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import { Button } from "@/shared/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

export type EntranceFeeFilters = {
  serviceName: string;
  isActive: string;
};

const DEFAULT_FILTERS: EntranceFeeFilters = {
  serviceName: "",
  isActive: "",
};

const STATUS_OPTIONS = [
  { label: "Đang hoạt động", value: "true" },
  { label: "Ngừng hoạt động", value: "false" },
];

interface EntranceFeeFilterBarProps {
  onFilter: (filters: EntranceFeeFilters) => void;
}

export default function EntranceFeeFilterBar({ onFilter }: EntranceFeeFilterBarProps) {
  const [filters, setFilters] = useState<EntranceFeeFilters>(DEFAULT_FILTERS);

  const handleChange = (key: keyof EntranceFeeFilters, value: string) => {
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
      <SearchBox value={filters.serviceName} onChange={(value) => handleChange("serviceName", value)} placeholder='Tìm theo tên dịch vụ...' />

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
