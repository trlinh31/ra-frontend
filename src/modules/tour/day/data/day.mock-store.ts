import type { Day } from "../types/day.type";

let _days: Day[] = [
  {
    id: "day1",
    code: "HN-01",
    title: "Hà Nội – Khởi hành",
    description: "Ngày đầu đón khách tại Hà Nội, nhận phòng và tham quan nội thành",
    services: [
      { id: "s1", serviceType: "transport", name: "Xe 16 chỗ đón sân bay Nội Bài", quantity: 1, unitPrice: 800000, currency: "VND", notes: "" },
      { id: "s2", serviceType: "hotel", name: "Khách sạn 3★ Hà Nội (DBL)", quantity: 1, unitPrice: 50, currency: "USD", notes: "Bao gồm ăn sáng" },
      { id: "s3", serviceType: "guide", name: "Hướng dẫn viên tiếng Anh", quantity: 1, unitPrice: 50, currency: "USD", notes: "" },
      { id: "s4", serviceType: "meal", name: "Bữa tối nhà hàng Hà Nội", quantity: 1, unitPrice: 200000, currency: "VND", notes: "" },
    ],
  },
  {
    id: "day2",
    code: "HN-HAL-01",
    title: "Hà Nội → Hạ Long",
    description: "Di chuyển từ Hà Nội xuống Hạ Long, lên tàu nghỉ đêm trên vịnh",
    services: [
      { id: "s5", serviceType: "transport", name: "Xe 29 chỗ Hà Nội – Hạ Long", quantity: 1, unitPrice: 1200000, currency: "VND", notes: "" },
      { id: "s6", serviceType: "entrance_fee", name: "Vé vào vịnh Hạ Long (người lớn)", quantity: 1, unitPrice: 270000, currency: "VND", notes: "" },
      { id: "s7", serviceType: "hotel", name: "Tàu nghỉ đêm 3★ Hạ Long", quantity: 1, unitPrice: 80, currency: "USD", notes: "" },
      { id: "s8", serviceType: "guide", name: "Hướng dẫn viên tiếng Anh", quantity: 1, unitPrice: 60, currency: "USD", notes: "" },
    ],
  },
  {
    id: "day3",
    code: "HAL-HN-01",
    title: "Hạ Long → Hà Nội",
    description: "Sáng tham quan buổi cuối trên vịnh, chiều về Hà Nội",
    services: [
      { id: "s9", serviceType: "entrance_fee", name: "Kayak Hang Sáng Tối", quantity: 1, unitPrice: 150000, currency: "VND", notes: "" },
      { id: "s10", serviceType: "transport", name: "Xe 29 chỗ Hạ Long – Hà Nội", quantity: 1, unitPrice: 1200000, currency: "VND", notes: "" },
      { id: "s11", serviceType: "meal", name: "Bữa trưa hải sản Hạ Long", quantity: 1, unitPrice: 350000, currency: "VND", notes: "" },
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
