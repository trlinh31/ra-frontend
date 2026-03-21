export type TransportKm = {
  id: string;
  code: string;
  country: string;
  city: string;
  category: string;
  km: number;
  price: number;
  notes: string;
  isActive: boolean;
};

export type TransportRoute = {
  id: string;
  code: string;
  country: string;
  startLocation: string;
  endLocation: string;
  vehicleCapacityPrice: VehicleCapacityPrice[];
  notes: string;
  isActive: boolean;
};

export type VehicleCapacityPrice = {
  capacity: number;
  price: number;
};
