import AppSelect from "@/shared/components/common/AppSelect";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import { Button } from "@/shared/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { VISA_GROUP_OPTIONS } from "../constants/visa-group-options.constant";

export type VisaFastTrackFilters = {
  serviceName: string;
  group: string;
  provider: string;
};

const DEFAULT_FILTERS: VisaFastTrackFilters = {
  serviceName: "",
  group: "",
  provider: "",
};

interface VisaFastTrackFilterBarProps {
  onFilter: (filters: VisaFastTrackFilters) => void;
  providerOptions: { label: string; value: string }[];
}

export default function VisaFastTrackFilterBar({ onFilter ,providerOptions}: VisaFastTrackFilterBarProps) {
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
      <div className='min-w-50'>
          <AppSelect options={providerOptions} value={filters.provider} onChange={(v) => handleChange("provider", v)} placeholder='Nhà cung cấp' />
      </div>
      <div className='min-w-30'>
        <AppSelect options={VISA_GROUP_OPTIONS} value={filters.group} onChange={(v) => handleChange("group", v)} placeholder='Nhóm' />
      </div>
      <SearchBox value={filters.serviceName} onChange={(value) => handleChange("serviceName", value)} placeholder='Tìm theo tên dịch vụ...' />

      <Button type='button' variant='outline' onClick={handleReset}>
        <RotateCcw className='w-4 h-4' />
        Đặt lại
      </Button>
    </div>
  );
}
