import type { TransportKmGroup, TransportKmItem, TransportRouteItem } from "../types/transportation.type";

let _groups: TransportKmGroup[] = [
  { id: "g1", code: "A", title: "TUYẾN ĐƯỜNG CLASSIC" },
  { id: "g2", code: "B", title: "TUYẾN ĐƯỜNG MỞ RỘNG" },
];

let _kmItems: TransportKmItem[] = [
  { id: "k1", groupId: "g1", schedule: "Hà Nội - đón / tiền sân bay", km: 100, notes: "" },
  { id: "k2", groupId: "g1", schedule: "HN - đón hoặc tiền sbay", km: 130, notes: "" },
  {
    id: "k3",
    groupId: "g1",
    schedule: "HN - đón hoặc tiền sbay - chuyến bay delay từ 3-5 tiếng (Quá 5 tiếng tính thành 2 chuyến)",
    km: 130,
    notes: "",
  },
  {
    id: "k4",
    groupId: "g1",
    schedule: "Hà Nội - city tour Hà Nội",
    km: 180,
    notes: "Riêng xe 35s, 45s tính 200km",
  },
  { id: "k5", groupId: "g1", schedule: "Hà Nội - Hạ Long (Bãi Cháy)", km: 350, notes: "" },
  { id: "k6", groupId: "g2", schedule: "Đà Nẵng - Hội An", km: 80, notes: "" },
  { id: "k7", groupId: "g2", schedule: "Đà Nẵng - Huế", km: 130, notes: "" },
];

let _routeItems: TransportRouteItem[] = [
  { id: "r1", route: "ĐÓN/TIỀN SB ĐN - HỘI AN", prices: { 4: 290, 7: 340, 16: 440 } },
  { id: "r2", route: "ĐÓN/TIỀN SB ĐN-ĐN", prices: { 4: 190, 7: 240, 16: 340 } },
  { id: "r3", route: "ĐÓN/TIỀN SB-KS VEN BIỂN", prices: { 4: 250, 7: 300, 16: 400 } },
  { id: "r4", route: "ĐÀ NẴNG - HỘI AN (1 CHIỀU)", prices: { 4: 200, 7: 280, 16: 380, 29: 520 } },
  { id: "r5", route: "TOUR ĐÀ NẴNG TRỌN NGÀY", prices: { 4: 750, 7: 950, 16: 1200, 29: 1600, 35: 1800, 45: 2000 } },
];

export const transportMockStore = {
  // ─── Groups ───────────────────────────────────────────────
  getAllGroups: (): TransportKmGroup[] => [..._groups],
  getGroupById: (id: string) => _groups.find((g) => g.id === id),
  createGroup: (data: Omit<TransportKmGroup, "id">): TransportKmGroup => {
    const group: TransportKmGroup = { ...data, id: `g${Date.now()}` };
    _groups = [..._groups, group];
    return group;
  },
  updateGroup: (id: string, data: Omit<TransportKmGroup, "id">): TransportKmGroup => {
    const group: TransportKmGroup = { ...data, id };
    _groups = _groups.map((g) => (g.id === id ? group : g));
    return group;
  },
  deleteGroup: (id: string): void => {
    _groups = _groups.filter((g) => g.id !== id);
    _kmItems = _kmItems.filter((i) => i.groupId !== id); // cascade
  },

  // ─── KM Items ─────────────────────────────────────────────
  getAllKmItems: (): TransportKmItem[] => [..._kmItems],
  getKmItemById: (id: string) => _kmItems.find((i) => i.id === id),
  createKmItem: (data: Omit<TransportKmItem, "id">): TransportKmItem => {
    const item: TransportKmItem = { ...data, id: `k${Date.now()}` };
    _kmItems = [..._kmItems, item];
    return item;
  },
  updateKmItem: (id: string, data: Omit<TransportKmItem, "id">): TransportKmItem => {
    const item: TransportKmItem = { ...data, id };
    _kmItems = _kmItems.map((i) => (i.id === id ? item : i));
    return item;
  },
  deleteKmItem: (id: string): void => {
    _kmItems = _kmItems.filter((i) => i.id !== id);
  },

  // ─── Route Items ──────────────────────────────────────────
  getAllRouteItems: (): TransportRouteItem[] => [..._routeItems],
  getRouteItemById: (id: string) => _routeItems.find((i) => i.id === id),
  createRouteItem: (data: Omit<TransportRouteItem, "id">): TransportRouteItem => {
    const item: TransportRouteItem = { ...data, id: `r${Date.now()}` };
    _routeItems = [..._routeItems, item];
    return item;
  },
  updateRouteItem: (id: string, data: Omit<TransportRouteItem, "id">): TransportRouteItem => {
    const item: TransportRouteItem = { ...data, id };
    _routeItems = _routeItems.map((i) => (i.id === id ? item : i));
    return item;
  },
  deleteRouteItem: (id: string): void => {
    _routeItems = _routeItems.filter((i) => i.id !== id);
  },
};
