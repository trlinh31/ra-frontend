import type { Transportation } from "../types/transportation.type";

let _items: Transportation[] = [
  {
    id: "1",
    code: "TRANS001",
    name: "Đón / Tiễn sân bay Nội Bài – Hà Nội",
    country: "Vietnam",
    city: "Hanoi",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    km: 45,
    vehicleCapacityPrice: [
      { capacity: 4, currency: "VND", price: 600000 },
      { capacity: 7, currency: "VND", price: 900000 },
      { capacity: 16, currency: "VND", price: 1800000 },
      { capacity: 35, currency: "VND", price: 3500000 },
    ],
    notes: "Giá áp dụng cho chuyến bay không delay. Chuyến bay delay trên 3 tiếng sẽ tính thêm phụ phí.",
    isActive: true,
  },
  {
    id: "2",
    code: "TRANS002",
    name: "Hà Nội – Hạ Long",
    country: "Vietnam",
    city: "Hanoi",
    supplier: "Công ty Du Lịch Sao Việt",
    km: 165,
    vehicleCapacityPrice: [
      { capacity: 4, currency: "VND", price: 1200000 },
      { capacity: 7, currency: "VND", price: 1800000 },
      { capacity: 16, currency: "VND", price: 3200000 },
      { capacity: 35, currency: "VND", price: 5500000 },
      { capacity: 45, currency: "VND", price: 6800000 },
    ],
    notes: "",
    isActive: true,
  },
  {
    id: "3",
    code: "TRANS003",
    name: "Đón / Tiễn sân bay Đà Nẵng – Trung tâm",
    country: "Vietnam",
    city: "Da Nang",
    supplier: "Công ty Du Lịch Quốc Tế Thái Bình Dương",
    km: 5,
    vehicleCapacityPrice: [
      { capacity: 4, currency: "VND", price: 250000 },
      { capacity: 7, currency: "VND", price: 380000 },
      { capacity: 16, currency: "VND", price: 750000 },
    ],
    notes: "Phục vụ 24/7.",
    isActive: true,
  },
  {
    id: "4",
    code: "TRANS004",
    name: "Bangkok – Pattaya Transfer",
    country: "Thailand",
    city: "Bangkok",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    km: 145,
    vehicleCapacityPrice: [
      { capacity: 4, currency: "THB", price: 2800 },
      { capacity: 9, currency: "THB", price: 4500 },
      { capacity: 25, currency: "THB", price: 9000 },
    ],
    notes: "Thời gian di chuyển khoảng 1.5 – 2 giờ.",
    isActive: true,
  },
  {
    id: "5",
    code: "TRANS005",
    name: "Sân bay Changi – Singapore City",
    country: "Singapore",
    city: "Singapore",
    supplier: "Công ty Du Lịch Quốc Tế Thái Bình Dương",
    km: 20,
    vehicleCapacityPrice: [
      { capacity: 4, currency: "SGD", price: 65 },
      { capacity: 7, currency: "SGD", price: 95 },
      { capacity: 13, currency: "SGD", price: 160 },
    ],
    notes: "",
    isActive: false,
  },
];

export const transportMockStore = {
  getAll: (): Transportation[] => [..._items],
  getById: (id: string) => _items.find((i) => i.id === id),
  create: (data: Omit<Transportation, "id">): Transportation => {
    const item: Transportation = { ...data, id: String(Date.now()) };
    _items = [..._items, item];
    return item;
  },
  update: (id: string, data: Omit<Transportation, "id">): Transportation => {
    const item: Transportation = { ...data, id };
    _items = _items.map((i) => (i.id === id ? item : i));
    return item;
  },
  delete: (id: string): void => {
    _items = _items.filter((i) => i.id !== id);
  },
};
