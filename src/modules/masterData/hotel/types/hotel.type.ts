export type Hotel = {
  id: string;
  code: string;
  name: string;
  rate: number;
  country: string;
  city: string;
  address: string;
  note: string;
  roomCategories: RoomCategory[];
  rooms: Room[];
  supplier: string;
  isActive: boolean;
};

export type RoomCategory = {
  name: string;
  quantity: number;
  area: number;
  note: string;
};

export type Room = {
  roomCategory: RoomCategory;
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
};
