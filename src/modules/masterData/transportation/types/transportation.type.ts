export type VehicleCapacityPrice = {
  capacity: number;
  currency: string;
  price: number;
};

export type Transportation = {
  id: string;
  code: string;
  name: string;
  country: string;
  city: string;
  supplier: string;
  km: number;
  vehicleCapacityPrice: VehicleCapacityPrice[];
  notes: string;
  isActive: boolean;
};
