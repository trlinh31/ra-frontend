import type { DayService } from "@/modules/tour/day/types/day.type";

export type TourDay = {
  kind: "day";
  code: string;
  title: string;
  country: string;
  city: string;
  description: string;
  services: DayService[];
};

export type TourGroupTour = {
  kind: "group_tour";
  groupTourId: string;
  pricingPeriodId: string;
  dayGroupId: string;
  name: string;
  unitPrice: number;
  currency: string;
};

export type TourItineraryItem = TourDay | TourGroupTour;

export type Tour = {
  id: string;
  code: string;
  name: string;
  description: string;
  content: string;
  numberOfPeople: number;
  itinerary: TourItineraryItem[];
};
