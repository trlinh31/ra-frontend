export type TourDay = {
  dayId: string;
  order: number;
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
