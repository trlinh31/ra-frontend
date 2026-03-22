import AppSelect from "@/shared/components/common/AppSelect";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import { Button } from "@/shared/components/ui/button";
import { RotateCcw } from "lucide-react";
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
      <SearchBox value={filters.serviceName} onChange={(value) => handleChange("serviceName", value)} placeholder='Tìm theo tên dịch vụ...' />

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
