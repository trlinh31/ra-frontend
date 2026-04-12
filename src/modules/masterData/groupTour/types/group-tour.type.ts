export type GroupTourDayGroup = {
  id: string;
  label: string;
  days: number[];
  price: number;
};

export type GroupTourDateRange = {
  from: string;
  to: string;
  dayGroups: GroupTourDayGroup[];
};

export type GroupTourPricingPeriod = {
  id: string;
  label: string;
  currency: string;
  dateRanges: GroupTourDateRange[];
};

export type GroupTour = {
  id: string;
  code: string;
  tourName: string;
  country: string;
  city: string;
  supplier: string;
  content: string;
  notes: string;
  isActive: boolean;
  pricingPeriods: GroupTourPricingPeriod[];
};
