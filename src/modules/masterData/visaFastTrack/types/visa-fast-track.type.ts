
export type VisaService = {
  id: string;
  provider: string;
  // code: string;
  services: Service[];
};

export type Service = {
  group: string;
  serviceName: string;
  price: number;
  priceUnit: string;
  description: string;
  pickupLocation: string;
}