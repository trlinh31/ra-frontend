export const VEHICLE_SEAT_OPTIONS = [4, 7, 16, 29, 35, 45] as const;
export type VehicleSeat = (typeof VEHICLE_SEAT_OPTIONS)[number];

export type TransportKmGroup = {
  id: string;
  code: string; // "A", "B"
  title: string; // "TUYẾN ĐƯỜNG CLASSIC"
};

export type TransportKmItem = {
  id: string;
  groupId: string;
  schedule: string;
  km: number;
  notes: string;
};

export type TransportRouteItem = {
  id: string;
  route: string;
  prices: Partial<Record<VehicleSeat, number>>; // giá nghìn VND
};
