import { dayMockStore } from "@/modules/tour/day/data/day.mock-store";
import type { Tour, TourDay } from "../types/tour.type";

const embedDay = (id: string): TourDay => {
  const d = dayMockStore.getById(id)!;
  return { code: d.code, title: d.title, country: d.country, city: d.city, description: d.description, services: d.services };
};

let _tours: Tour[] = [
  {
    id: "t1",
    code: "HN-HAL-3N2D",
    name: "Hà Nội - Hạ Long 3 Ngày 2 Đêm",
    description: "Hành trình khám phá Hà Nội và vịnh Hạ Long kỳ vĩ",
    content: "<p>Chào mừng quý khách đến với hành trình khám phá <strong>Hà Nội – Hạ Long</strong> tuyệt vời!</p>",
    numberOfPeople: 10,
    groupTours: [
      {
        groupTourId: "1",
        pricingPeriodId: "gt1-p1",
        dayGroupId: "gt1-dg1",
        name: "Tour Hà Nội - Hạ Long 3N2Đ",
        unitPrice: 4500000,
        currency: "VND",
      },
    ],
    days: [embedDay("day1"), embedDay("day2"), embedDay("day3")],
  },
  {
    id: "t2",
    code: "HN-2N1D",
    name: "Hà Nội City Tour 2 Ngày 1 Đêm",
    description: "Khám phá thủ đô Hà Nội trong 2 ngày",
    content: "<p>Trải nghiệm <strong>Hà Nội</strong> – thành phố ngàn năm văn hiến.</p>",
    numberOfPeople: 15,
    groupTours: [],
    days: [embedDay("day1"), embedDay("day2")],
  },
];

export const tourMockStore = {
  getAll: (): Tour[] => [..._tours],
  getById: (id: string): Tour | undefined => _tours.find((t) => t.id === id),
  create: (data: Omit<Tour, "id">): Tour => {
    const tour: Tour = { ...data, id: `t${Date.now()}` };
    _tours = [..._tours, tour];
    return tour;
  },
  update: (id: string, data: Omit<Tour, "id">): Tour => {
    const tour: Tour = { ...data, id };
    _tours = _tours.map((t) => (t.id === id ? tour : t));
    return tour;
  },
  delete: (id: string): void => {
    _tours = _tours.filter((t) => t.id !== id);
  },
};
