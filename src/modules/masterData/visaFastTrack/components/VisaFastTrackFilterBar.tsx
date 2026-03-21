import AppSelect from "@/shared/components/common/AppSelect";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { RotateCcw, Search } from "lucide-react";
import { useState } from "react";
import { VISA_GROUP_OPTIONS } from "../constants/visa-group-options.constant";

export type VisaFastTrackFilters = {
  serviceName: string;
  group: string;
};

const DEFAULT_FILTERS: VisaFastTrackFilters = {
  serviceName: "",
  group: "",
};

interface VisaFastTrackFilterBarProps {
  onFilter: (filters: VisaFastTrackFilters) => void;
}

export default function VisaFastTrackFilterBar({ onFilter }: VisaFastTrackFilterBarProps) {
  const [filters, setFilters] = useState<VisaFastTrackFilters>(DEFAULT_FILTERS);

  const handleChange = (key: keyof VisaFastTrackFilters, value: string) => {
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
        <AppSelect options={VISA_GROUP_OPTIONS} value={filters.group} onChange={(v) => handleChange("group", v)} placeholder='Nhóm' />
      </div>

      <Button type='button' variant='outline' onClick={handleReset}>
        <RotateCcw className='w-4 h-4' />
        Đặt lại
      </Button>
    </div>
  );
}
