export type TourDay = {
  dayId: string;
  order: number;
};

export type Tour = {
  id: string;
  code: string;
  name: string;
  description: string;
  content: string;
  numberOfPeople: number;
  days: TourDay[];
};
