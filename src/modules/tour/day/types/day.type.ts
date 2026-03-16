export const SERVICE_TYPES = ["hotel", "transport", "entrance_fee", "flight", "guide", "meal", "other"] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  hotel: "Khách sạn",
  transport: "Vận chuyển",
  entrance_fee: "Phí vào cổng",
  flight: "Chuyến bay",
  guide: "Hướng dẫn viên",
  meal: "Bữa ăn",
  other: "Khác",
};

export const CURRENCIES = ["VND", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export type DayService = {
  id: string;
  serviceType: ServiceType;
  name: string;
  quantity: number;
  unitPrice: number;
  currency: Currency;
  notes: string;
};

export type Day = {
  id: string;
  code: string;
  title: string;
  description: string;
  services: DayService[];
};
