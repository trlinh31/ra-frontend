import type { Flight } from "@/modules/masterData/flights/types/flight.type";

let _flights: Flight[] = [
  {
    id: "f1",
    origin: "HAN",
    destination: "DAD",
    airline: "Vietnam Airlines",
    flightTime: "02:00",
    provider: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    fromCountry: "Vietnam",
    fromCity: "Hanoi",
    toCountry: "Vietnam",
    toCity: "Da Nang",
    notes: "",
    isActive: true,
    seatClasses: [
      { id: 1, name: "Economy", note: "" },
      { id: 2, name: "Business", note: "" },
    ],
    pricingPeriods: [
      {
        id: "f1-p1",
        label: "Giá vé HAN-DAD",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-01-01",
            to: "2026-06-30",
            dayGroups: [
              { id: "f1-dg1", label: "T2-T6", days: [1, 2, 3, 4, 5], price: 1500000, seatClassId: 1 },
              { id: "f1-dg2", label: "Cuối tuần", days: [6, 0], price: 1900000, seatClassId: 1 },
              { id: "f1-dg3-b", label: "T2-T6", days: [1, 2, 3, 4, 5], price: 3200000, seatClassId: 2 },
              { id: "f1-dg4-b", label: "Cuối tuần", days: [6, 0], price: 3800000, seatClassId: 2 },
            ],
          },
          {
            from: "2026-07-01",
            to: "2026-12-31",
            dayGroups: [
              { id: "f1-dg5", label: "T2-T6", days: [1, 2, 3, 4, 5], price: 1700000, seatClassId: 1 },
              { id: "f1-dg6", label: "Cuối tuần", days: [6, 0], price: 2100000, seatClassId: 1 },
              { id: "f1-dg7-b", label: "T2-T6", days: [1, 2, 3, 4, 5], price: 3500000, seatClassId: 2 },
              { id: "f1-dg8-b", label: "Cuối tuần", days: [6, 0], price: 4200000, seatClassId: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "f2",
    origin: "DAD",
    destination: "SGN",
    airline: "Vietnam Airlines",
    flightTime: "01:30",
    provider: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    fromCountry: "Vietnam",
    fromCity: "Hanoi",
    toCountry: "Vietnam",
    toCity: "Da Nang",
    notes: "",
    isActive: true,
    seatClasses: [{ id: 1, name: "Economy", note: "" }],
    pricingPeriods: [
      {
        id: "f2-p1",
        label: "Giá vé DAD-SGN",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-01-01",
            to: "2026-12-31",
            dayGroups: [{ id: "f2-dg1", label: "Cả tuần", days: [0, 1, 2, 3, 4, 5, 6], price: 1200000, seatClassId: 1 }],
          },
        ],
      },
    ],
  },
  {
    id: "f3",
    origin: "BKK",
    destination: "CNX",
    airline: "American Airlines",
    flightTime: "02:00",
    provider: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    fromCountry: "Vietnam",
    fromCity: "Hanoi",
    toCountry: "Vietnam",
    toCity: "Da Nang",
    notes: "Yipeng Lantern Festival period - case by case",
    isActive: true,
    seatClasses: [
      { id: 1, name: "Economy", note: "" },
      { id: 2, name: "Business", note: "" },
    ],
    pricingPeriods: [],
  },
  {
    id: "f4",
    origin: "CNX",
    destination: "HKT",
    airline: "American Airlines",
    flightTime: "01:30",
    provider: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    fromCountry: "Vietnam",
    fromCity: "Hanoi",
    toCountry: "Vietnam",
    toCity: "Da Nang",
    notes: "Yipeng Lantern Festival period - case by case",
    isActive: false,
    seatClasses: [
      { id: 1, name: "Economy", note: "" },
      { id: 2, name: "Business", note: "" },
    ],
    pricingPeriods: [],
  },
];

export const flightMockStore = {
  getAll: (): Flight[] => [..._flights],
  getById: (id: string) => _flights.find((f) => f.id === id),
  create: (data: Omit<Flight, "id">): Flight => {
    const f: Flight = { ...data, id: `f${Date.now()}` };
    _flights = [..._flights, f];
    return f;
  },
  update: (id: string, data: Omit<Flight, "id">): Flight => {
    const f: Flight = { ...data, id };
    _flights = _flights.map((x) => (x.id === id ? f : x));
    return f;
  },
  delete: (id: string): void => {
    _flights = _flights.filter((f) => f.id !== id);
  },
};
