import type { Hotel } from "../types/hotel.type";

const initialHotels: Hotel[] = [
  {
    id: "1",
    code: "HO101",
    name: "Khách sạn Ánh Dương",
    rate: "5",
    country: "Vietnam",
    city: "Hanoi",
    address: "19 Lĩnh Nam, Hoàng Mai",
    roomTypes: [
      {
        id: 1,
        name: "Phòng VIP",
        maxGuests: 12,
        note: "Phòng 12 m2",
      },
    ],
    pricingPeriods: [
      {
        id: "1",
        label: "2026-03-29-2026-03-30, 2026-03-01-2026-03-03",
        dateRanges: [
          {
            from: "2026-03-29",
            to: "2026-03-30",
          },
          {
            from: "2026-03-01",
            to: "2026-03-03",
          },
        ],
        dayGroups: [
          {
            id: "1",
            label: "T2-CN",
            days: [1, 0],
          },
        ],
        prices: [
          {
            roomTypeId: 1,
            dayGroupPrices: [
              {
                dayGroupId: "1",
                price: 12000000,
              },
            ],
          },
        ],
      },
      {
        id: "2",
        label: "2026-03-01-2026-03-02",
        dateRanges: [
          {
            from: "2026-03-01",
            to: "2026-03-02",
          },
        ],
        dayGroups: [
          {
            id: "1",
            label: "abc",
            days: [1, 0],
          },
        ],
        prices: [
          {
            roomTypeId: 1,
            dayGroupPrices: [
              {
                dayGroupId: "1",
                price: 123123123213,
              },
            ],
          },
        ],
      },
    ],
    note: "abc",
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
