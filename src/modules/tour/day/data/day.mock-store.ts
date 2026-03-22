import type { Day } from "../types/day.type";

let _days: Day[] = [
  {
    id: "day1",
    code: "HN-01",
    title: "Hà Nội - Khởi hành",
    description: "Ngày đầu đón khách tại Hà Nội, nhận phòng và tham quan nội thành",
    services: [
      { id: "s1", serviceType: "transport", name: "TRANSR1 - Hanoi → Hanoi (16 chỗ)", quantity: 1, unitPrice: 30000000, currency: "VND", notes: "" },
      { id: "s2", serviceType: "hotel", name: "Khách sạn Ánh Dương", quantity: 1, unitPrice: 500000, currency: "VND", notes: "Bao gồm ăn sáng" },
      { id: "s3", serviceType: "flight", name: "VNA-HAN-DAD", quantity: 1, unitPrice: 150000, currency: "VND", notes: "" },
    ],
  },
  {
    id: "day2",
    code: "HAL-01",
    title: "Hạ Long - Tham quan vịnh",
    description: "Di chuyển từ Hà Nội xuống Hạ Long, tham quan vịnh bằng thuyền",
    services: [
      { id: "s4", serviceType: "transport", name: "TRANSR1 - Hanoi → Hanoi (16 chỗ)", quantity: 1, unitPrice: 30000000, currency: "VND", notes: "" },
      { id: "s5", serviceType: "hotel", name: "Khách sạn Ánh Dương", quantity: 1, unitPrice: 500000, currency: "VND", notes: "Bao gồm ăn sáng" },
    ],
  },
  {
    id: "day3",
    code: "HN-02",
    title: "Hà Nội - Kết thúc",
    description: "Trở về Hà Nội, tiễn khách tại sân bay",
    services: [
      { id: "s6", serviceType: "transport", name: "TRANSR1 - Hanoi → Hanoi (16 chỗ)", quantity: 1, unitPrice: 30000000, currency: "VND", notes: "" },
      { id: "s7", serviceType: "flight", name: "VNA-HAN-DAD", quantity: 1, unitPrice: 150000, currency: "VND", notes: "" },
    ],
  },
];

export const dayMockStore = {
  getAll: (): Day[] => [..._days],
  getById: (id: string): Day | undefined => _days.find((d) => d.id === id),
  create: (data: Omit<Day, "id">): Day => {
    const day: Day = { ...data, id: `day${Date.now()}` };
    _days = [..._days, day];
    return day;
  },
  update: (id: string, data: Omit<Day, "id">): Day => {
    const day: Day = { ...data, id };
    _days = _days.map((d) => (d.id === id ? day : d));
    return day;
  },
  delete: (id: string): void => {
    _days = _days.filter((d) => d.id !== id);
  },
};
