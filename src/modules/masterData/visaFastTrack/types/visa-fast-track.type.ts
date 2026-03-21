export type UnitPriceType = "PAX" | "GROUP";

export type VisaService = {
  id: string;
  code: string;
  group: string;
  serviceName: string;
  price: number;
  priceUnit: UnitPriceType;
  description: string;
  pickupLocation: string;
};
