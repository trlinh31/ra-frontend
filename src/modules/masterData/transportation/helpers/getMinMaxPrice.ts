import type { VehicleCapacityPrice } from "@/modules/masterData/transportation/types/transportation.type";

export const getMinMaxPrice = (items: VehicleCapacityPrice[]) => {
  const prices = items.map((i) => i.price);

  if (!prices.length) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};
