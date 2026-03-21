import type { Hotel } from "../types/hotel.type";

const initialHotels: Hotel[] = [
  {
    id: "1",
    name: "Khách sạn Ánh Dương",
    rate: 4,
    country: "Vietnam",
    city: "Hanoi",
    rooms: [
      {
        id: "1",
        roomType: "standard",
        priceRange: {
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-03-31"),
          price: 500000,
        },
      },
      {
        id: "2",
        roomType: "standard",
        priceRange: {
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-03-31"),
          price: 900000,
        },
      },
    ],
    notes: "Phòng tiêu chuẩn, view thành phố",
    isActive: true,
  },
];

let _hotels: Hotel[] = [...initialHotels];

export const hotelMockStore = {
  getAll: (): Hotel[] => [..._hotels],

  getById: (id: string): Hotel | undefined => _hotels.find((h) => h.id === id),

  create: (data: Omit<Hotel, "id">): Hotel => {
    const hotel: Hotel = { ...data, id: String(Date.now()) };
    _hotels = [..._hotels, hotel];
    return hotel;
  },

  update: (id: string, data: Omit<Hotel, "id">): Hotel => {
    const hotel: Hotel = { ...data, id };
    _hotels = _hotels.map((h) => (h.id === id ? hotel : h));
    return hotel;
  },

  delete: (id: string): void => {
    _hotels = _hotels.filter((h) => h.id !== id);
  },
};
