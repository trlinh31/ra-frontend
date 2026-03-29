import type { Flight } from "@/modules/masterData/flights/types/flight.type";

let _flights: Flight[] = [
  {
    id: "f1",
    code: "FL1",
    // provider: ""
    airlineCode: "VNA",
    origin: "HAN",
    destination: "DAD",
    airline: "Vietnam Airlines",
    flightTime: "02:00",
    price: 150000,
    unitPrice: "VNĐ",
    provider: "SB Nội Bài",
    fromCountry: "Việt Nam",
    fromCity: "Hà Nội",
    toCountry: "Việt Nam",
    toCity: "Đà Nẵng",
    notes: "",
    isActive: true,
  },
  {
    id: "f2",
    code: "FL2",
    airlineCode: "VNA",
    origin: "DAD",
    destination: "SGN",
    airline: "Vietnam Airlines",
    flightTime: "01:30",
    price: 120000,
    unitPrice: "VNĐ",
    provider: "SB Nội Bài",
    fromCountry: "Việt Nam",
    fromCity: "Hà Nội",
    toCountry: "Việt Nam",
    toCity: "Đà Nẵng",
    notes: "",
    isActive: true,
  },
  {
    id: "f3",
    code: "FL3",
    airlineCode: "AA",
    origin: "BKK",
    destination: "CNX",
    airline: "American Airlines",
    flightTime: "02:00",
    price: 100000,
    unitPrice: "VNĐ",
    provider: "SB Nội Bài",
    fromCountry: "Việt Nam",
    fromCity: "Hà Nội",
    toCountry: "Việt Nam",
    toCity: "Đà Nẵng",
    notes: "Yipeng Lantern Festival period - case by case",
    isActive: true,
  },
  {
    id: "f4",
    code: "FL4",
    airlineCode: "AA",
    origin: "CNX",
    destination: "HKT",
    airline: "American Airlines",
    flightTime: "01:30",
    price: 250000,
    unitPrice: "VNĐ",
    provider: "SB Nội Bài",
    fromCountry: "Việt Nam",
    fromCity: "Hà Nội",
    toCountry: "Việt Nam",
    toCity: "Đà Nẵng",
    notes: "Yipeng Lantern Festival period - case by case",
    isActive: false,
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
