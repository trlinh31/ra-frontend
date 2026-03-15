import type { GroupTour } from "../types/group-tour.type";

let _tours: GroupTour[] = [
  { id: "1", tourName: "Hoi An Motorbike Street Food Tour", contractRateUsd: 45, notes: "3.00 pm - 8.00 pm" },
  { id: "2", tourName: "Bike Tour to Countryside and Food tour", contractRateUsd: 35, notes: "3.00 pm - 8.00 pm" },
  { id: "3", tourName: "Hoi An Street Walking Food Tour", contractRateUsd: 34, notes: "3.00 pm - 7.00 pm" },
  { id: "4", tourName: "Evening Walking Food Tour", contractRateUsd: 34, notes: "5.00 pm - 9.00 pm" },
  {
    id: "5",
    tourName: "Hoi An City and Food Tour with Foot Massage",
    contractRateUsd: 29,
    notes: "8.00 am - 12.00 pm",
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
