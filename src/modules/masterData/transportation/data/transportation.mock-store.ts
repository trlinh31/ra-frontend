import type { TransportKm, TransportRoute } from "../types/transportation.type";

let _kmItems: TransportKm[] = [
  {
    id: "k1",
    code: "TRANS1",
    country: "Vietnam",
    city: "Hanoi",
    category: "Đón / tiễn sân bay",
    km: 30,
    price: 20000000,
    notes: "Riêng xe 35s, 45s tính 200km",
    isActive: true,
  },
  {
    id: "k2",
    code: "TRANS2",
    country: "Vietnam",
    city: "Hanoi",
    category: "Đón hoặc tiễn sbay - chuyến bay delay từ 3 -5 tiếng (Quá 5 tiếng tính thành 2 chuyến )",
    km: 130,
    price: 40000000,
    notes: "",
    isActive: false,
  },
];

let _routeItems: TransportRoute[] = [
  {
    id: "r1",
    code: "TRANSR1",
    country: "Vietnam",
    startLocation: "Hanoi",
    endLocation: "Hanoi",
    vehicleCapacityPrice: [
      { capacity: 4, price: 10000000 },
      { capacity: 7, price: 15000000 },
      { capacity: 16, price: 30000000 },
    ],
    notes: "",
    isActive: true,
  },
  {
    id: "r2",
    code: "TRANSR2",
    country: "Vietnam",
    startLocation: "Hanoi",
    endLocation: "Hanoi",
    vehicleCapacityPrice: [
      { capacity: 4, price: 10000000 },
      { capacity: 7, price: 15000000 },
      { capacity: 16, price: 30000000 },
    ],
    notes: "",
    isActive: false,
  },
  {
    id: "r3",
    code: "TRANSR3",
    country: "Vietnam",
    startLocation: "Hanoi",
    endLocation: "Hanoi",
    vehicleCapacityPrice: [
      { capacity: 4, price: 10000000 },
      { capacity: 7, price: 15000000 },
      { capacity: 16, price: 30000000 },
    ],
    notes: "",
    isActive: false,
  },
];

export const transportMockStore = {
  getAllKmItems: (): TransportKm[] => [..._kmItems],
  getKmItemById: (id: string) => _kmItems.find((i) => i.id === id),
  createKmItem: (data: Omit<TransportKm, "id">): TransportKm => {
    const item: TransportKm = { ...data, id: `k${Date.now()}` };
    _kmItems = [..._kmItems, item];
    return item;
  },
  updateKmItem: (id: string, data: Omit<TransportKm, "id">): TransportKm => {
    const item: TransportKm = { ...data, id };
    _kmItems = _kmItems.map((i) => (i.id === id ? item : i));
    return item;
  },
  deleteKmItem: (id: string): void => {
    _kmItems = _kmItems.filter((i) => i.id !== id);
  },

  getAllRouteItems: (): TransportRoute[] => [..._routeItems],
  getRouteItemById: (id: string) => _routeItems.find((i) => i.id === id),
  createRouteItem: (data: Omit<TransportRoute, "id">): TransportRoute => {
    const item: TransportRoute = { ...data, id: `r${Date.now()}` };
    _routeItems = [..._routeItems, item];
    return item;
  },
  updateRouteItem: (id: string, data: Omit<TransportRoute, "id">): TransportRoute => {
    const item: TransportRoute = { ...data, id };
    _routeItems = _routeItems.map((i) => (i.id === id ? item : i));
    return item;
  },
  deleteRouteItem: (id: string): void => {
    _routeItems = _routeItems.filter((i) => i.id !== id);
  },
};
