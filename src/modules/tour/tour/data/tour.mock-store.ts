import type { Tour } from "../types/tour.type";

let _tours: Tour[] = [
  {
    id: "t1",
    code: "HN-HAL-3N2D",
    name: "Hà Nội - Hạ Long 3 Ngày 2 Đêm",
    description: "Hành trình khám phá Hà Nội và vịnh Hạ Long kỳ vĩ",
    days: [
      { dayId: "day1", order: 1 },
      { dayId: "day2", order: 2 },
      { dayId: "day3", order: 3 },
    ],
  },
  {
    id: "t2",
    code: "HN-2N1D",
    name: "Hà Nội City Tour 2 Ngày 1 Đêm",
    description: "Khám phá thủ đô Hà Nội trong 2 ngày",
    days: [
      { dayId: "day1", order: 1 },
      { dayId: "day2", order: 2 },
    ],
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
