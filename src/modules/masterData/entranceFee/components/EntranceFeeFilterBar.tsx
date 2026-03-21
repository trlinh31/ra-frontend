import AppSelect from "@/shared/components/common/AppSelect";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { RotateCcw, Search } from "lucide-react";
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
      <div className='relative min-w-48'>
        <Search className='top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 pointer-events-none' />
        <Input
          placeholder='Tìm theo tên dịch vụ...'
          value={filters.serviceName}
          onChange={(e) => handleChange("serviceName", e.target.value)}
          className='bg-white pl-9'
        />
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
