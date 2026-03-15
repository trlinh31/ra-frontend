export const ROOM_TYPES = ["standard", "deluxe", "suite", "family"] as const;
export type RoomType = (typeof ROOM_TYPES)[number];

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  standard: "Standard",
  deluxe: "Deluxe",
  suite: "Suite",
  family: "Family",
};

export type PriceRange = {
  startDate: Date;
  endDate: Date;
  price: number;
};

export type Hotel = {
  id: string;
  roomType: RoomType;
  roomCount: number;
  priceRanges: PriceRange[];
  notes: string;
  isActive: boolean;
};
