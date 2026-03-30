export const SERVICE_TYPES = ["hotel", "transport", "group_tour", "visa", "entrance_fee", "flight"] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  hotel: "Khách sạn",
  transport: "Vận chuyển",
  group_tour: "Nhóm tour",
  visa: "Visa",
  entrance_fee: "Phí vào cổng",
  flight: "Chuyến bay",
};

export const CURRENCIES = ["VND", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export type HotelServiceDetail = {
  hotelId: string;
  pricingPeriodId: string;
  dayGroupId: string;
  roomTypeId: number;
};

export type DayService = {
  id: string;
  serviceType: ServiceType;
  name: string;
  quantity: number;
  unitPrice: number;
  currency: Currency;
  notes: string;
  hotelDetail?: HotelServiceDetail;
};

export type Day = {
  id: string;
  code: string;
  title: string;
  country: string;
  city: string;
  description: string;
  services: DayService[];
};
