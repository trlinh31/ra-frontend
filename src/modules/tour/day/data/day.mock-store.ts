import { ServiceType, type Day } from "../types/day.type";

let _days: Day[] = [
  {
    id: "day1",
    code: "HN-01",
    title: "Day 1 - Hà Nội",
    country: "Vietnam",
    city: "Hanoi",
    description: "",
    services: [
      {
        id: "service1",
        serviceType: ServiceType.HOTEL,
        name: "Khách sạn Ánh Dương",
        unitPrice: 850000,
        currency: "VND",
        hotelDetail: {
          hotelId: "1",
          pricingPeriodId: "1",
          dayGroupId: "2",
          roomTypeId: "1",
        },
      },
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
