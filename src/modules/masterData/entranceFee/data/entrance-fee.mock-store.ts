import type { EntranceFeeGroup, EntranceFeeItem } from "../types/entrance-fee.type";

let _groups: EntranceFeeGroup[] = [
  { id: "g1", code: "I", name: "" },
  { id: "g2", code: "II", name: "" },
];

let _items: EntranceFeeItem[] = [
  { id: "i1", groupId: "g1", serviceName: "Dau Dang Waterfalls", adultNetRateVnd: 0, notes: "" },
  { id: "i2", groupId: "g1", serviceName: "Ba Be National Park", adultNetRateVnd: 70000, notes: "" },
  { id: "i3", groupId: "g1", serviceName: "Puong Cave", adultNetRateVnd: 0, notes: "" },
  { id: "i4", groupId: "g1", serviceName: "Hua Ma Cave", adultNetRateVnd: 45000, notes: "" },
  { id: "i5", groupId: "g2", serviceName: "But Thap Pagoda", adultNetRateVnd: 15000, notes: "" },
  { id: "i6", groupId: "g2", serviceName: "Dinh Bang Village & Communal House", adultNetRateVnd: 0, notes: "" },
  { id: "i7", groupId: "g2", serviceName: "Dong Ho Traditional Paper Village", adultNetRateVnd: 0, notes: "" },
];

export const entranceFeeMockStore = {
  // Groups
  getAllGroups: (): EntranceFeeGroup[] => [..._groups],
  getGroupById: (id: string) => _groups.find((g) => g.id === id),
  createGroup: (data: Omit<EntranceFeeGroup, "id">): EntranceFeeGroup => {
    const g: EntranceFeeGroup = { ...data, id: `g${Date.now()}` };
    _groups = [..._groups, g];
    return g;
  },
  updateGroup: (id: string, data: Omit<EntranceFeeGroup, "id">): EntranceFeeGroup => {
    const g: EntranceFeeGroup = { ...data, id };
    _groups = _groups.map((x) => (x.id === id ? g : x));
    return g;
  },
  deleteGroup: (id: string): void => {
    _groups = _groups.filter((g) => g.id !== id);
    _items = _items.filter((i) => i.groupId !== id);
  },

  // Items
  getAllItems: (): EntranceFeeItem[] => [..._items],
  getItemById: (id: string) => _items.find((i) => i.id === id),
  createItem: (data: Omit<EntranceFeeItem, "id">): EntranceFeeItem => {
    const item: EntranceFeeItem = { ...data, id: `i${Date.now()}` };
    _items = [..._items, item];
    return item;
  },
  updateItem: (id: string, data: Omit<EntranceFeeItem, "id">): EntranceFeeItem => {
    const item: EntranceFeeItem = { ...data, id };
    _items = _items.map((x) => (x.id === id ? item : x));
    return item;
  },
  deleteItem: (id: string): void => {
    _items = _items.filter((i) => i.id !== id);
  },
};
