export const ROOM_TYPES = ["standard", "deluxe", "suite", "family"] as const;
export type RoomType = (typeof ROOM_TYPES)[number];

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  standard: "Standard",
  deluxe: "Deluxe",
  suite: "Suite",
  family: "Family",
};

export type PriceRange = {
  startDate: string;
  endDate: string;
  price: number;
};

export type Hotel = {
  id: string;
  name: string;
  rate: number;
  country: string;
  city: string;
  notes: string;
  rooms: Room[];
  isActive: boolean;
};

export type Room = {
  roomType: RoomType;
  priceRange: PriceRange;
};
