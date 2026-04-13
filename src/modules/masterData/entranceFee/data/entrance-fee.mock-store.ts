import type { EntranceFee } from "../types/entrance-fee.type";

let _items: EntranceFee[] = [
  {
    id: "i1",
    code: "EF001",
    serviceName: "Vé tham quan vịnh Hạ Long",
    country: "Vietnam",
    city: "Hanoi",
    notes: "Áp dụng cho người lớn, trẻ em dưới 1m miễn phí",
    isActive: true,
    pricingPeriods: [
      {
        id: "ef1-p1",
        label: "Giá vé Hạ Long",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-01-01",
            to: "2026-06-30",
            dayGroups: [
              { id: "ef1-dg1", label: "T2-T6", days: [1, 2, 3, 4, 5], adultPrice: 300000, childPrice: 150000 },
              { id: "ef1-dg2", label: "Cuối tuần", days: [6, 0], adultPrice: 380000, childPrice: 190000 },
            ],
          },
          {
            from: "2026-07-01",
            to: "2026-12-31",
            dayGroups: [
              { id: "ef1-dg3", label: "T2-T6", days: [1, 2, 3, 4, 5], adultPrice: 320000, childPrice: 160000 },
              { id: "ef1-dg4", label: "Cuối tuần", days: [6, 0], adultPrice: 400000, childPrice: 200000 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "i2",
    code: "EF002",
    serviceName: "Vé tham quan phố cổ Hội An",
    country: "Vietnam",
    city: "Hanoi",
    notes: "Áp dụng cho người lớn, trẻ em dưới 1m miễn phí",
    isActive: true,
    pricingPeriods: [
      {
        id: "ef2-p1",
        label: "Giá vé Hội An",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-01-01",
            to: "2026-12-31",
            dayGroups: [{ id: "ef2-dg1", label: "Cả tuần", days: [0, 1, 2, 3, 4, 5, 6], adultPrice: 120000, childPrice: 60000 }],
          },
        ],
      },
    ],
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
