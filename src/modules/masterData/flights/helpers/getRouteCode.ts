import type { Flight } from "@/modules/masterData/flights/types/flight.type";

export const getRouteCode = (f: Flight) => {
  return `${f.origin}-${f.destination}`;
};
