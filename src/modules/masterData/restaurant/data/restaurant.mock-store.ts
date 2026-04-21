import type { PricingPeriod, Restaurant } from "@/modules/masterData/restaurant/types/restaurant.type";

const makePricing = (price1: number, price2: number): PricingPeriod[] => [
  {
    currency: "VND",
    dateRanges: [
      {
        from: "2026-01-01",
        to: "2026-12-31",
        dayGroups: [
          { label: "T2–T6", days: [1, 2, 3, 4, 5], price: price1, comboPackageIndex: "0" },
          { label: "T7–CN", days: [6, 0], price: Math.round(price1 * 1.2), comboPackageIndex: "0" },
          { label: "T2–T6", days: [1, 2, 3, 4, 5], price: price2, comboPackageIndex: "1" },
          { label: "T7–CN", days: [6, 0], price: Math.round(price2 * 1.2), comboPackageIndex: "1" },
        ],
      },
    ],
  },
];

const initialRestaurants: Restaurant[] = [
  {
    id: "1",
    code: "RES101",
    name: "Nhà hàng Hương Việt",
    phone: "0123456789",
    email: "contact@huongviet.com",
    country: "Vietnam",
    city: "Hanoi",
    address: "15 Hàng Bông, Hoàn Kiếm",
    capacity: 120,
    comboPackages: [
      { name: "Combo tiêu chuẩn", maxGuests: 10 },
      { name: "Combo cao cấp", maxGuests: 8 },
    ],
    pricingPeriods: makePricing(150000, 250000),
    isActive: true,
  },
  {
    id: "2",
    code: "RES102",
    name: "Nhà hàng Phố Biển",
    phone: "0234567890",
    email: "info@phobien.com",
    country: "Vietnam",
    city: "Nha Trang",
    address: "32 Trần Phú, Lộc Thọ",
    capacity: 200,
    comboPackages: [
      { name: "Combo hải sản A", maxGuests: 10 },
      { name: "Combo hải sản B", maxGuests: 8 },
    ],
    pricingPeriods: makePricing(350000, 500000),
    isActive: true,
  },
  {
    id: "3",
    code: "RES103",
    name: "Nhà hàng Sài Gòn Garden",
    phone: "0345678901",
    email: "booking@saigongarden.vn",
    country: "Vietnam",
    city: "Ho Chi Minh City",
    address: "88 Nguyễn Huệ, Quận 1",
    capacity: 300,
    comboPackages: [
      { name: "Combo thường", maxGuests: 12 },
      { name: "Combo VIP", maxGuests: 6 },
    ],
    pricingPeriods: makePricing(120000, 220000),
    isActive: true,
  },
  {
    id: "4",
    code: "RES104",
    name: "Nhà hàng Cố Đô",
    phone: "0456789012",
    email: "codohue@restaurant.com",
    country: "Vietnam",
    city: "Hue",
    address: "24 Lê Lợi, Thành phố Huế",
    capacity: 150,
    comboPackages: [
      { name: "Combo ẩm thực Huế", maxGuests: 10 },
      { name: "Combo đặc sản Huế", maxGuests: 8 },
    ],
    pricingPeriods: makePricing(180000, 280000),
    isActive: true,
  },
  {
    id: "5",
    code: "RES105",
    name: "Nhà hàng Mekong Float",
    phone: "0567890123",
    email: "mekong@float.com",
    country: "Vietnam",
    city: "Can Tho",
    address: "5 Hai Bà Trưng, Ninh Kiều",
    capacity: 80,
    comboPackages: [
      { name: "Combo miền Tây", maxGuests: 10 },
      { name: "Combo đặc biệt", maxGuests: 6 },
    ],
    pricingPeriods: makePricing(200000, 320000),
    isActive: true,
  },
  {
    id: "6",
    code: "RES106",
    name: "Nhà hàng Đà Lạt View",
    phone: "0678901234",
    email: "dalatview@dining.com",
    country: "Vietnam",
    city: "Da Lat",
    address: "10 Trần Hưng Đạo, Phường 3",
    capacity: 100,
    comboPackages: [
      { name: "Combo Âu", maxGuests: 8 },
      { name: "Combo Á", maxGuests: 10 },
    ],
    pricingPeriods: makePricing(280000, 420000),
    isActive: false,
  },
  {
    id: "7",
    code: "RES107",
    name: "Nhà hàng Phố Hội",
    phone: "0789012345",
    email: "phohoi@hoian.com",
    country: "Vietnam",
    city: "Hoi An",
    address: "20 Phan Chu Trinh, Minh An",
    capacity: 90,
    comboPackages: [
      { name: "Combo Hội An cơ bản", maxGuests: 10 },
      { name: "Combo Hội An đặc sản", maxGuests: 8 },
    ],
    pricingPeriods: makePricing(130000, 220000),
    isActive: true,
  },
  {
    id: "8",
    code: "RES108",
    name: "Nhà hàng Sapa Mây",
    phone: "0890123456",
    email: "sapamay@highland.vn",
    country: "Vietnam",
    city: "Sapa",
    address: "3 Cầu Mây, Thị trấn Sa Pa",
    capacity: 60,
    comboPackages: [
      { name: "Combo núi rừng", maxGuests: 8 },
      { name: "Combo dân tộc", maxGuests: 10 },
    ],
    pricingPeriods: makePricing(160000, 250000),
    isActive: true,
  },
  {
    id: "9",
    code: "RES109",
    name: "Nhà hàng Đảo Ngọc",
    phone: "0901234567",
    email: "daongoc@phuquoc.vn",
    country: "Vietnam",
    city: "Phu Quoc",
    address: "7 Trần Hưng Đạo, Dương Đông",
    capacity: 180,
    comboPackages: [
      { name: "Combo biển A", maxGuests: 10 },
      { name: "Combo biển B", maxGuests: 8 },
    ],
    pricingPeriods: makePricing(400000, 600000),
    isActive: true,
  },
  {
    id: "10",
    code: "RES110",
    name: "Nhà hàng Bãi Cháy",
    phone: "0912345678",
    email: "baichay@halong.com",
    country: "Vietnam",
    city: "Ha Long",
    address: "45 Hạ Long, Bãi Cháy",
    capacity: 250,
    comboPackages: [
      { name: "Combo Hạ Long thường", maxGuests: 12 },
      { name: "Combo Hạ Long cao cấp", maxGuests: 8 },
    ],
    pricingPeriods: makePricing(220000, 380000),
    isActive: false,
  },
];

let _restaurants: Restaurant[] = [...initialRestaurants];

export const restaurantMockStore = {
  getAll: (): Restaurant[] => [..._restaurants],

  getById: (id: string): Restaurant | undefined => _restaurants.find((r) => r.id === id),

  create: (data: Omit<Restaurant, "id">) => {
    const restaurant: Restaurant = { ...data, id: String(Date.now()) };
    _restaurants = [..._restaurants, restaurant];
    return restaurant;
  },

  update: (id: string, data: Omit<Restaurant, "id">) => {
    const restaurant: Restaurant = { ...data, id };
    _restaurants = _restaurants.map((r) => (r.id === id ? restaurant : r));
    return restaurant;
  },

  delete: (id: string) => {
    _restaurants = _restaurants.filter((r) => r.id !== id);
  },
};
