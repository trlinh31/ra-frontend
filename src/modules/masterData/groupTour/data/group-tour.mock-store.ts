import type { GroupTour } from "../types/group-tour.type";

let _tours: GroupTour[] = [
  {
    id: "1",
    code: "GT001",
    tourName: "Tour Hà Nội - Hạ Long",
    supplier: "Công ty ABC",
    content: "Tham quan Hà Nội và Hạ Long trong 3 ngày 2 đêm",
    price: 5000000,
    notes: "Bao gồm vé máy bay và khách sạn",
    isActive: true,
  },
  {
    id: "2",
    code: "GT002",
    tourName: "Tour Đà Nẵng - Hội An",
    supplier: "Công ty XYZ",
    content: "Khám phá Đà Nẵng và Hội An trong 4 ngày 3 đêm",
    price: 6000000,
    notes: "Bao gồm vé máy bay, khách sạn và ăn uống",
    isActive: true,
  },
];

export const groupTourMockStore = {
  getAll: (): GroupTour[] => [..._tours],
  getById: (id: string) => _tours.find((t) => t.id === id),
  create: (data: Omit<GroupTour, "id">): GroupTour => {
    const tour: GroupTour = { ...data, id: String(Date.now()) };
    _tours = [..._tours, tour];
    return tour;
  },
  update: (id: string, data: Omit<GroupTour, "id">): GroupTour => {
    const tour: GroupTour = { ...data, id };
    _tours = _tours.map((t) => (t.id === id ? tour : t));
    return tour;
  },
  delete: (id: string): void => {
    _tours = _tours.filter((t) => t.id !== id);
  },
};
