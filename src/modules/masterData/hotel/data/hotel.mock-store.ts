import type { Hotel } from "../types/hotel.type";

const initialHotels: Hotel[] = [
  {
    id: "1",
    roomType: "standard",
    roomCount: 15,
    priceRanges: [
      {
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-03-31"),
        price: 500000,
      },
      {
        startDate: new Date("2025-07-01"),
        endDate: new Date("2025-08-31"),
        price: 700000,
      },
    ],
    notes: "Phòng tiêu chuẩn, view thành phố",
    isActive: true,
  },
  {
    id: "2",
    roomType: "deluxe",
    roomCount: 8,
    priceRanges: [
      {
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        price: 1200000,
      },
    ],
    notes: "Phòng deluxe, view biển",
    isActive: true,
  },
  {
    id: "3",
    roomType: "suite",
    roomCount: 3,
    priceRanges: [
      {
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-06-30"),
        price: 3000000,
      },
    ],
    notes: "",
    isActive: false,
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
