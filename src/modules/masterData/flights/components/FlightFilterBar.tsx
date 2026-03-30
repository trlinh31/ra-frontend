import AppSelect from "@/shared/components/common/AppSelect";
import SearchBox from "@/shared/components/common/SearchBox/SearchBox";
import { Button } from "@/shared/components/ui/button";
import type { Country } from "@/shared/types/country/country.type";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

export type FlightFilters = {
  // routeCode: string;
  // isActive: string;
  fromCountry: string;
  toCountry: string;
  fromCity: string;
  toCity: string;
  provider: string;
  airline: string;
};

const DEFAULT_FILTERS: FlightFilters = {
  // routeCode: "",
  // isActive: "",
  fromCountry: "",
  toCountry: "",
  fromCity: "",
  toCity: "",
  provider: "",
  airline: "",
};

const STATUS_OPTIONS = [
  { label: "Đang hoạt động", value: "true" },
  { label: "Ngừng hoạt động", value: "false" },
];

interface FlightFilterBarProps {
  onFilter: (filters: FlightFilters) => void;
  countries: Country[];
  providerOptions: { label: string; value: string }[];
  airlineOptions: { label: string; value: string }[];
}

export default function FlightFilterBar({countries,  onFilter, providerOptions, airlineOptions }: FlightFilterBarProps) {
  const [filters, setFilters] = useState<FlightFilters>(DEFAULT_FILTERS);

  const handleChange = (key: keyof FlightFilters, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilter(next);
  };

  const fromCountryOptions = countries.map((c) => ({ label: c.country, value: c.country }));
  const toCountryOptions = countries.map((c) => ({ label: c.country, value: c.country }));
  const fromCityOptions = countries.find((c) => c.country === filters.fromCountry)?.cities.map((city) => ({ label: city, value: city })) ?? [];
  const toCityOptions = countries.find((c) => c.country === filters.toCountry)?.cities.map((city) => ({ label: city, value: city })) ?? [];

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    onFilter(DEFAULT_FILTERS);
  };

  return (
    < div className='flex flex-wrap items-center gap-3'>
      {/* <SearchBox value={filters.routeCode} onChange={(value) => handleChange("routeCode", value)} placeholder='Tìm theo mã tuyến đường...' />

      <div className='min-w-44'>
        <AppSelect options={STATUS_OPTIONS} value={filters.isActive} onChange={(v) => handleChange("isActive", v)} placeholder='Trạng thái' />
      </div> */}
      <div className='min-w-40'>
        <AppSelect options={fromCountryOptions} value={filters.fromCountry} onChange={(v) => handleChange("fromCountry", v)} placeholder='Quốc gia khởi hành' />
      </div>
      <div className='min-w-40'>
        <AppSelect options={fromCityOptions} value={filters.fromCity} onChange={(v) => handleChange("fromCity", v)} placeholder='Thành phố khởi hành' />
      </div>
      <span className="flex items-center justify-center text-muted-foreground">
        &rarr;
      </span>
      <div className='min-w-40'>
        <AppSelect options={toCountryOptions} value={filters.toCountry} onChange={(v) => handleChange("toCountry", v)} placeholder='Quốc gia đến' />
      </div>
      <div className='min-w-40'>
        <AppSelect options={toCityOptions} value={filters.toCity} onChange={(v) => handleChange("toCity", v)} placeholder='Thành phố đến' />
      </div>
      <div className='min-w-44'>
        <AppSelect options={providerOptions} value={filters.provider} onChange={(v) => handleChange("provider", v)} placeholder='Nhà cung cấp             ' />
      </div>

      <div className='min-w-44'>
        <AppSelect options={airlineOptions} value={filters.airline} onChange={(v) => handleChange("airline", v)} placeholder='Hãng bay' />
      </div>
      <Button type='button' variant='outline' onClick={handleReset}>
        <RotateCcw className='w-4 h-4' />
        Đặt lại
      </Button>
    </div>
  );
}
