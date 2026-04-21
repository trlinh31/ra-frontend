// 0 = CN, 1 = T2, 2 = T3, 3 = T4, 4 = T5, 5 = T6, 6 = T7
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type ComboPackage = {
  name: string;
  maxGuests: number;
};

export type DayGroup = {
  label: string;
  days: DayOfWeek[];
  price: number;
  comboPackageIndex: string;
};

export type DateRange = {
  from: string;
  to: string;
  dayGroups: DayGroup[];
};

export type PricingPeriod = {
  currency: string;
  dateRanges: DateRange[];
};

export type Restaurant = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  address: string;
  capacity: number;
  comboPackages: ComboPackage[];
  pricingPeriods: PricingPeriod[];
  isActive: boolean;
};
