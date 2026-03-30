import type { Currency, ServiceType } from "../types/day.type";

export type ServiceOption = {
  label: string;
  value: string;
  price: number;
  currency: Currency;
};

export const getServiceOptions = (serviceType: ServiceType): ServiceOption[] => {
  return [];
};
