import type { Hotel } from "../types/hotel.type";

const initialHotels: Hotel[] = [
  {
    id: "1",
    code: "HO101",
    name: "Khách sạn Ánh Dương",
    rate: 5,
    country: "Vietnam",
    city: "Hanoi",
    address: "19 Lĩnh Nam, Hoàng Mai",
    roomCategories: [
      { name: "Deluxe Room", quantity: 20, note: "2 người" },
      { name: "Suite", quantity: 5, note: "Gia đình" },
    ],
    rooms: [
      {
        roomCategory: { name: "Deluxe Room", quantity: 20, note: "2 người" },
        startDate: "2026-04-01",
        endDate: "2026-04-01",
        price: 1200000,
        currency: "VND",
      },
      {
        roomCategory: { name: "Deluxe Room", quantity: 20, note: "2 người" },
        startDate: "2026-05-01",
        endDate: "2026-05-31",
        price: 1200000,
        currency: "VND",
      },
    ],
    note: "",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    isActive: true,
  },

  {
    id: "2",
    code: "HO102",
    name: "Sunrise Hotel",
    rate: 4,
    country: "Vietnam",
    city: "Da Nang",
    address: "12 Võ Nguyên Giáp",
    roomCategories: [{ name: "Standard", quantity: 30, note: "" }],
    rooms: [
      {
        roomCategory: { name: "Standard", quantity: 30, note: "" },
        startDate: "2026-05-01",
        endDate: "2026-05-31",
        price: 800000,
        currency: "VND",
      },
    ],
    note: "Gần biển",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    isActive: true,
  },

  {
    id: "3",
    code: "HO103",
    name: "Ocean View Resort",
    rate: 5,
    country: "Vietnam",
    city: "Nha Trang",
    address: "88 Trần Phú",
    roomCategories: [{ name: "Ocean View", quantity: 15, note: "View biển" }],
    rooms: [
      {
        roomCategory: { name: "Ocean View", quantity: 15, note: "View biển" },
        startDate: "2026-06-01",
        endDate: "2026-06-15",
        price: 2500000,
        currency: "VND",
      },
    ],
    note: "",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    isActive: true,
  },

  {
    id: "4",
    code: "HO104",
    name: "Mountain Retreat",
    rate: 3,
    country: "Vietnam",
    city: "Sapa",
    address: "Fansipan Road",
    roomCategories: [{ name: "Bungalow", quantity: 10, note: "View núi" }],
    rooms: [
      {
        roomCategory: { name: "Bungalow", quantity: 10, note: "View núi" },
        startDate: "2026-09-01",
        endDate: "2026-09-30",
        price: 1500000,
        currency: "VND",
      },
    ],
    note: "",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    isActive: true,
  },

  {
    id: "5",
    code: "HO105",
    name: "City Central Hotel",
    rate: 4,
    country: "Vietnam",
    city: "Ho Chi Minh",
    address: "Nguyễn Huệ, Quận 1",
    roomCategories: [{ name: "Business", quantity: 25, note: "Khách công tác" }],
    rooms: [
      {
        roomCategory: { name: "Business", quantity: 25, note: "Khách công tác" },
        startDate: "2026-03-15",
        endDate: "2026-04-15",
        price: 1100000,
        currency: "VND",
      },
    ],
    note: "",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    isActive: true,
  },

  {
    id: "6",
    code: "HO106",
    name: "Bangkok Palace",
    rate: 5,
    country: "Thailand",
    city: "Bangkok",
    address: "สุขุมวิท 11",
    roomCategories: [{ name: "Luxury", quantity: 40, note: "" }],
    rooms: [
      {
        roomCategory: { name: "Luxury", quantity: 40, note: "" },
        startDate: "2026-07-01",
        endDate: "2026-07-31",
        price: 120,
        currency: "USD",
      },
    ],
    note: "",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    isActive: true,
  },

  {
    id: "7",
    code: "HO107",
    name: "Tokyo Inn",
    rate: 3,
    country: "Japan",
    city: "Tokyo",
    address: "Shinjuku",
    roomCategories: [{ name: "Capsule", quantity: 100, note: "1 người" }],
    rooms: [
      {
        roomCategory: { name: "Capsule", quantity: 100, note: "1 người" },
        startDate: "2026-04-01",
        endDate: "2026-04-10",
        price: 50,
        currency: "USD",
      },
    ],
    note: "",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    isActive: true,
  },

  {
    id: "8",
    code: "HO108",
    name: "Seoul Stay",
    rate: 4,
    country: "South Korea",
    city: "Seoul",
    address: "Gangnam",
    roomCategories: [{ name: "Standard", quantity: 40, note: "" }],
    rooms: [
      {
        roomCategory: { name: "Standard", quantity: 40, note: "" },
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        price: 90,
        currency: "USD",
      },
    ],
    note: "",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    isActive: false,
  },

  {
    id: "9",
    code: "HO109",
    name: "Paris Boutique Hotel",
    rate: 5,
    country: "France",
    city: "Paris",
    address: "Champs-Élysées",
    roomCategories: [{ name: "Boutique", quantity: 12, note: "" }],
    rooms: [
      {
        roomCategory: { name: "Boutique", quantity: 12, note: "" },
        startDate: "2026-06-01",
        endDate: "2026-06-30",
        price: 220,
        currency: "EUR",
      },
      {
        roomCategory: { name: "Boutique", quantity: 12, note: "" },
        startDate: "2026-07-01",
        endDate: "2026-07-31",
        price: 220,
        currency: "EUR",
      },
    ],
    note: "",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    isActive: true,
  },

  {
    id: "10",
    code: "HO110",
    name: "New York Grand",
    rate: 5,
    country: "USA",
    city: "New York",
    address: "5th Avenue",
    roomCategories: [{ name: "Suite", quantity: 20, note: "Luxury" }],
    rooms: [
      {
        roomCategory: { name: "Suite", quantity: 20, note: "Luxury" },
        startDate: "2026-12-01",
        endDate: "2026-12-31",
        price: 500,
        currency: "USD",
      },
    ],
    note: "Peak season",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
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
