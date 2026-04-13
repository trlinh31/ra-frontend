export interface EntranceFeeTicketType {
  name: string;
  note: string;
}

export interface EntranceFeeDayGroup {
  id: string;
  label: string;
  days: number[];
  ticketTypeIndex: string;
  price: number;
}

export interface EntranceFeeDateRange {
  from: string;
  to: string;
  dayGroups: EntranceFeeDayGroup[];
}

export interface EntranceFeePricingPeriod {
  id: string;
  label: string;
  currency: string;
  dateRanges: EntranceFeeDateRange[];
}

export interface EntranceFee {
  id: string;
  code: string;
  serviceName: string;
  country: string;
  city: string;
  notes: string;
  isActive: boolean;
  ticketTypes: EntranceFeeTicketType[];
  pricingPeriods: EntranceFeePricingPeriod[];
}
