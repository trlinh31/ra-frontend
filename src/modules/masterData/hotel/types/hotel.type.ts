// 0 = CN, 1 = T2, 2 = T3, 3 = T4, 4 = T5, 5 = T6, 6 = T7
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Hotel = {
  id: string;
  code: string;
  name: string;
  rate: string;
  country: string;
  city: string;
  address: string;
  note: string;
  supplier: string;
  isActive: boolean;
  roomTypes: RoomType[];
  pricingPeriods: PricingPeriod[];
};

export type RoomType = {
  id: number;
  name: string;
  maxGuests: number;
  note: string;
};

export type DateRange = {
  from: string;
  to: string;
};

export type DayGroup = {
  id: string;
  label: string;
  days: DayOfWeek[];
};

export type DayGroupPrice = {
  dayGroupId: string;
  price: number;
};

export type RoomTypePricing = {
  roomTypeId: number;
  dayGroupPrices: DayGroupPrice[];
};

export type PricingPeriod = {
  id: string;
  label: string;
  currency: string;
  dateRanges: DateRange[];
  dayGroups: DayGroup[];
  prices: RoomTypePricing[];
};
