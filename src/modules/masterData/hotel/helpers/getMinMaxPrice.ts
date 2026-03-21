import type { Room } from "@/modules/masterData/hotel/types/hotel.type";

export const getMinMaxPrice = (rooms: Room[]) => {
  const prices = rooms.flatMap((room) => room.priceRange.price);

  if (!prices.length) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};
