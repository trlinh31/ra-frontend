import type { EntranceFee } from "../types/entrance-fee.type";

let _items: EntranceFee[] = [
  {
    id: "i1",
    code: "EF001",
    serviceName: "Vé tham quan vịnh Hạ Long",
    country: "Vietnam",
    city: "Hanoi",
    notes: "Mọi đối tượng",
    isActive: true,
    ticketTypes: [
      { name: "Người lớn", note: "" },
      { name: "Trẻ em", note: "Chiều cao dưới 1.3m" },
    ],
    pricingPeriods: [
      {
        id: "ef1-p1",
        label: "01/01 - 30/06, 01/07 - 31/12",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-01-01",
            to: "2026-06-30",
            dayGroups: [
              { id: "ef1-dg1", label: "T2-T6", days: [1, 2, 3, 4, 5], ticketTypeIndex: "0", price: 300000 },
              { id: "ef1-dg2", label: "T2-T6", days: [1, 2, 3, 4, 5], ticketTypeIndex: "1", price: 150000 },
              { id: "ef1-dg3", label: "Cuối tuần", days: [6, 0], ticketTypeIndex: "0", price: 380000 },
              { id: "ef1-dg4", label: "Cuối tuần", days: [6, 0], ticketTypeIndex: "1", price: 190000 },
            ],
          },
          {
            from: "2026-07-01",
            to: "2026-12-31",
            dayGroups: [
              { id: "ef1-dg5", label: "T2-T6", days: [1, 2, 3, 4, 5], ticketTypeIndex: "0", price: 320000 },
              { id: "ef1-dg6", label: "T2-T6", days: [1, 2, 3, 4, 5], ticketTypeIndex: "1", price: 160000 },
              { id: "ef1-dg7", label: "Cuối tuần", days: [6, 0], ticketTypeIndex: "0", price: 400000 },
              { id: "ef1-dg8", label: "Cuối tuần", days: [6, 0], ticketTypeIndex: "1", price: 200000 },
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
    notes: "",
    isActive: true,
    ticketTypes: [
      { name: "Người lớn", note: "" },
      { name: "Trẻ em", note: "" },
    ],
    pricingPeriods: [
      {
        id: "ef2-p1",
        label: "Giá vé Hội An",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-01-01",
            to: "2026-12-31",
            dayGroups: [
              { id: "ef2-dg1", label: "Cả tuần", days: [0, 1, 2, 3, 4, 5, 6], ticketTypeIndex: "0", price: 120000 },
              { id: "ef2-dg2", label: "Cả tuần", days: [0, 1, 2, 3, 4, 5, 6], ticketTypeIndex: "1", price: 60000 },
            ],
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
