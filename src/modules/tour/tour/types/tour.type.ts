import type { DayService } from "@/modules/tour/day/types/day.type";

export type TourDay = {
  code: string;
  title: string;
  country: string;
  city: string;
  description: string;
  services: DayService[];
};

export type TourGroupTour = {
  groupTourId: string;
  pricingPeriodId: string;
  dayGroupId: string;
  name: string;
  unitPrice: number;
  currency: string;
};

export type Tour = {
  id: string;
  code: string;
  name: string;
  description: string;
  content: string;
  numberOfPeople: number;
  groupTours: TourGroupTour[];
  days: TourDay[];
};
