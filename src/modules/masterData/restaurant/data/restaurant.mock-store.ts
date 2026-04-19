import type { Restaurant } from "@/modules/masterData/restaurant/types/restaurant.type";

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
    menuItems: [
      { name: "Phở bò", price: 65000 },
      { name: "Cơm tấm sườn", price: 55000 },
      { name: "Bún chả", price: 50000 },
    ],
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
    menuItems: [
      { name: "Tôm hùm nướng", price: 350000 },
      { name: "Cá mú hấp", price: 280000 },
      { name: "Ghẻ rang muối", price: 150000 },
    ],
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
    menuItems: [
      { name: "Cơm văn phòng", price: 45000 },
      { name: "Lẩu thập cẩm", price: 120000 },
      { name: "Gà chiên mắm", price: 85000 },
    ],
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
    menuItems: [
      { name: "Bánh khoái", price: 60000 },
      { name: "Cơm Huế", price: 75000 },
      { name: "Bún bò Huế", price: 55000 },
      { name: "Chè Huế", price: 30000 },
    ],
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
    menuItems: [
      { name: "Lẩu mắm", price: 95000 },
      { name: "Cá lóc nướng trụi", price: 110000 },
      { name: "Tôm càng xanh hấp", price: 180000 },
    ],
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
    menuItems: [
      { name: "Steak bò Uc", price: 320000 },
      { name: "Pasta carbonara", price: 145000 },
      { name: "Salad cá hồi", price: 120000 },
    ],
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
    menuItems: [
      { name: "Câu lầu", price: 35000 },
      { name: "Hoành thánh", price: 40000 },
      { name: "Cơm gà Hội An", price: 55000 },
    ],
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
    menuItems: [
      { name: "Cơm lam", price: 45000 },
      { name: "Thắt lợn nướng", price: 85000 },
      { name: "Rượu táo mèo", price: 60000 },
    ],
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
    menuItems: [
      { name: "Tôm hùm", price: 420000 },
      { name: "Mực nướng", price: 130000 },
      { name: "Ghẻ", price: 160000 },
      { name: "Nước dừa", price: 30000 },
    ],
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
    menuItems: [
      { name: "Cá chép nướng", price: 200000 },
      { name: "Mực xào", price: 110000 },
      { name: "Lẩu hải sản", price: 250000 },
    ],
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
