import type { Flight } from "../types/flight.type";

let _flights: Flight[] = [
  { id: "f1", route: "VNA HAN - DAD", netRateUsd: 120, notes: "" },
  { id: "f2", route: "VNA DAD - SGN", netRateUsd: 120, notes: "" },
  { id: "f3", route: "AA BKK - CNX", netRateUsd: 100, notes: "Yipeng Lantern Festival period - case by case" },
  { id: "f4", route: "AA CNX - HKT", netRateUsd: 250, notes: "Yipeng Lantern Festival period - case by case" },
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
