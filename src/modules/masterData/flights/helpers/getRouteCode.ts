import type { Flight } from "@/modules/masterData/flights/types/flight.type";

export const getRouteCode = (f: Flight) => {
  return `${f.airlineCode}-${f.origin}-${f.destination}`;
};
