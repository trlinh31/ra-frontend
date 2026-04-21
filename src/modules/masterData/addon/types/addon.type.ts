export type AddonEntityType = "hotel" | "restaurant" | "transport" | "flight" | "tour_guide" | "visa" | "entrance_fee" | "group_tour";

export type AddonService = {
  id: string;
  entityType: AddonEntityType;
  entityId: string;
  name: string;
  price: number;
  currency: string;
  description: string;
};
