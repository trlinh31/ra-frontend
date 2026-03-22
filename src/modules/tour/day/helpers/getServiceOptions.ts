import { entranceFeeMockStore } from "@/modules/masterData/entranceFee/data/entrance-fee.mock-store";
import { flightMockStore } from "@/modules/masterData/flights/data/flight.mock-store";
import { getRouteCode } from "@/modules/masterData/flights/helpers/getRouteCode";
import { groupTourMockStore } from "@/modules/masterData/groupTour/data/group-tour.mock-store";
import { hotelMockStore } from "@/modules/masterData/hotel/data/hotel.mock-store";
import { transportMockStore } from "@/modules/masterData/transportation/data/transportation.mock-store";
import { visaFastTrackMockStore } from "@/modules/masterData/visaFastTrack/data/visa-fast-track.mock-store";
import type { Currency, ServiceType } from "../types/day.type";

export type ServiceOption = {
  label: string;
  value: string;
  price: number;
  currency: Currency;
};

export const getServiceOptions = (serviceType: ServiceType): ServiceOption[] => {
  switch (serviceType) {
    case "hotel":
      return hotelMockStore.getAll().map((h) => ({
        label: h.name,
        value: h.name,
        price: 0,
        currency: "VND",
      }));
    case "transport":
      return [
        ...transportMockStore.getAllKmItems().map((k) => ({
          label: `${k.code} - ${k.category}`,
          value: `${k.code} - ${k.category}`,
          price: k.price,
          currency: "VND" as Currency,
        })),
        ...transportMockStore.getAllRouteItems().flatMap((r) =>
          r.vehicleCapacityPrice.map((v) => ({
            label: `${r.code} - ${r.startLocation} → ${r.endLocation} (${v.capacity} chỗ)`,
            value: `${r.code} - ${r.startLocation} → ${r.endLocation} (${v.capacity} chỗ)`,
            price: v.price,
            currency: "VND" as Currency,
          }))
        ),
      ];
    case "group_tour":
      return groupTourMockStore.getAll().map((t) => ({
        label: t.tourName,
        value: t.tourName,
        price: t.price,
        currency: "VND",
      }));
    case "visa":
      return visaFastTrackMockStore.getAll().map((v) => ({
        label: v.serviceName,
        value: v.serviceName,
        price: v.price,
        currency: "USD",
      }));
    case "entrance_fee":
      return entranceFeeMockStore.getAllItems().map((ef) => ({
        label: ef.serviceName,
        value: ef.serviceName,
        price: ef.price,
        currency: "VND",
      }));
    case "flight":
      return flightMockStore.getAll().map((f) => ({
        label: getRouteCode(f),
        value: getRouteCode(f),
        price: f.price,
        currency: "VND",
      }));
    default:
      return [];
  }
};
