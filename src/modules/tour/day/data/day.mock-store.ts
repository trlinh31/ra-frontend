import type { Day } from "../types/day.type";

let _days: Day[] = [
  {
    id: "day1",
    code: "HN-01",
    title: "Hà Nội - Khởi hành",
    description: "Ngày đầu đón khách tại Hà Nội, nhận phòng và tham quan nội thành",
    services: [
      { id: "s1", serviceType: "transport", name: "Xe 16 chỗ đón sân bay Nội Bài", quantity: 1, unitPrice: 800000, currency: "VND", notes: "" },
      { id: "s2", serviceType: "hotel", name: "Khách sạn 3★ Hà Nội (DBL)", quantity: 1, unitPrice: 50, currency: "USD", notes: "Bao gồm ăn sáng" },
      { id: "s3", serviceType: "flight", name: "Hướng dẫn viên tiếng Anh", quantity: 1, unitPrice: 50, currency: "USD", notes: "" },
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
