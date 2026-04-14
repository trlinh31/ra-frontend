export type FlightSeatClass = {
  id: number;
  name: string;
  note: string;
};

export type FlightDayGroup = {
  id: string;
  label: string;
  days: number[];
  price: number;
  seatClassId: number;
};

export type FlightDateRange = {
  from: string;
  to: string;
  dayGroups: FlightDayGroup[];
};

export type FlightPricingPeriod = {
  id: string;
  label: string;
  currency: string;
  dateRanges: FlightDateRange[];
};

export type Flight = {
  id: string;
  // code: string;
  // airlineCode: string;
  origin: string;
  destination: string;
  airline: string;
  flightTime: string;
  provider: string;
  fromCountry: string;
  fromCity: string;
  toCountry: string;
  toCity: string;
  notes: string;
  isActive: boolean;
  seatClasses: FlightSeatClass[];
  pricingPeriods: FlightPricingPeriod[];
};
