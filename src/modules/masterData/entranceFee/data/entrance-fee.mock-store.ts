import type { EntranceFee } from "../types/entrance-fee.type";

let _items: EntranceFee[] = [
  {
    id: "i1",
    code: "EF001",
    serviceName: "Vé tham quan vịnh Hạ Long",
    country: "Vietnam",
    city: "Hanoi",
    price: 300000,
    unitPrice: "VNĐ",
    notes: "Áp dụng cho người lớn, trẻ em dưới 1m miễn phí",
    isActive: true,
  },
  {
    id: "i2",
    code: "EF002",
    serviceName: "Vé tham quan phố cổ Hội An",
    country: "Vietnam",
    city: "Hanoi",
    price: 120000,
    unitPrice: "VNĐ",
    notes: "Áp dụng cho người lớn, trẻ em dưới 1m miễn phí",
    isActive: true,
  },
];

export const entranceFeeMockStore = {
  getAllItems: (): EntranceFee[] => [..._items],
  getItemById: (id: string) => _items.find((i) => i.id === id),
  createItem: (data: Omit<EntranceFee, "id">): EntranceFee => {
    const item: EntranceFee = { ...data, id: `i${Date.now()}` };
    _items = [..._items, item];
    return item;
  },
  updateItem: (id: string, data: Omit<EntranceFee, "id">): EntranceFee => {
    const item: EntranceFee = { ...data, id };
    _items = _items.map((x) => (x.id === id ? item : x));
    return item;
  },
  deleteItem: (id: string): void => {
    _items = _items.filter((i) => i.id !== id);
  },
};
