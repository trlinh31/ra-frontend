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
      { id: 1, name: "Phòng đơn", maxGuests: 1, note: "Phòng tiêu chuẩn 18m2" },
      { id: 2, name: "Phòng đôi", maxGuests: 2, note: "Phòng tiêu chuẩn 24m2" },
      { id: 3, name: "Phòng VIP", maxGuests: 4, note: "Phòng cao cấp 45m2, view hồ Tây" },
    ],
    pricingPeriods: [
      {
        id: "1",
        label: "2026-01-01 - 2026-03-31",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-01-01",
            to: "2026-03-31",
            dayGroups: [
              { id: "1", label: "T2-T6", days: [1, 2, 3, 4, 5], price: 700000, roomTypeId: 1 },
              { id: "2", label: "T7-CN", days: [6, 0], price: 850000, roomTypeId: 1 },
            ],
          },
        ],
      },
      {
        id: "2",
        label: "2026-04-01 - 2026-06-30",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-04-01",
            to: "2026-06-30",
            dayGroups: [
              { id: "1", label: "T2-T6", days: [1, 2, 3, 4, 5], price: 800000, roomTypeId: 1 },
              { id: "2", label: "T7-CN", days: [6, 0], price: 950000, roomTypeId: 1 },
            ],
          },
        ],
      },
      {
        id: "3",
        label: "2026-07-01 - 2026-09-30",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-07-01",
            to: "2026-09-30",
            dayGroups: [
              { id: "1", label: "T2-T6", days: [1, 2, 3, 4, 5], price: 850000, roomTypeId: 1 },
              { id: "2", label: "T7-CN", days: [6, 0], price: 1000000, roomTypeId: 1 },
            ],
          },
        ],
      },
      {
        id: "4",
        label: "2026-10-01 - 2026-12-31",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-10-01",
            to: "2026-12-31",
            dayGroups: [
              { id: "1", label: "T2-T6", days: [1, 2, 3, 4, 5], price: 820000, roomTypeId: 1 },
              { id: "2", label: "T7-CN", days: [6, 0], price: 980000, roomTypeId: 1 },
            ],
          },
        ],
      },
    ],
    note: "Khách sạn 5 sao trung tâm Hà Nội, đầy đủ tiện nghi cao cấp.",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    isActive: true,
  },
  {
    id: "2",
    code: "HO102",
    name: "Sao Việt Grand Hotel",
    rate: "4",
    country: "Vietnam",
    city: "Ho Chi Minh City",
    address: "45 Nguyễn Huệ, Quận 1",
    roomTypes: [
      { id: 1, name: "Phòng đơn", maxGuests: 1, note: "Phòng tiêu chuẩn 20m2" },
      { id: 2, name: "Phòng đôi", maxGuests: 2, note: "Phòng deluxe 30m2" },
    ],
    pricingPeriods: [
      {
        id: "1",
        label: "2026-04-01 - 2026-09-30",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-04-01",
            to: "2026-09-30",
            dayGroups: [
              { id: "1", label: "T2-T6", days: [1, 2, 3, 4, 5], price: 950000, roomTypeId: 1 },
              { id: "2", label: "T7-CN", days: [6, 0], price: 1100000, roomTypeId: 1 },
            ],
          },
        ],
      },
    ],
    note: "Khách sạn 4 sao tại trung tâm TP.HCM, gần phố đi bộ Nguyễn Huệ.",
    supplier: "Công ty CP Du Lịch Sao Việt",
    isActive: true,
  },
  {
    id: "3",
    code: "HO103",
    name: "Phương Nam Beach Resort",
    rate: "5",
    country: "Vietnam",
    city: "Da Nang",
    address: "Bãi biển Mỹ Khê, Ngũ Hành Sơn",
    roomTypes: [
      { id: 1, name: "Phòng hướng biển", maxGuests: 2, note: "View biển trực tiếp 35m2" },
      { id: 2, name: "Phòng garden view", maxGuests: 2, note: "Hướng vườn 30m2" },
      { id: 3, name: "Bungalow", maxGuests: 4, note: "Bungalow riêng biệt 60m2" },
    ],
    pricingPeriods: [
      {
        id: "1",
        label: "2026-04-01 - 2026-08-31 (Mùa cao điểm)",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-04-01",
            to: "2026-08-31",
            dayGroups: [
              { id: "1", label: "T2-T5", days: [1, 2, 3, 4], price: 2200000, roomTypeId: 1 },
              { id: "2", label: "T6-CN", days: [5, 6, 0], price: 2800000, roomTypeId: 1 },
            ],
          },
        ],
      },
      {
        id: "2",
        label: "2026-09-01 - 2026-12-31 (Mùa thấp điểm)",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-09-01",
            to: "2026-12-31",
            dayGroups: [
              { id: "1", label: "T2-T5", days: [1, 2, 3, 4], price: 1600000, roomTypeId: 1 },
              { id: "2", label: "T6-CN", days: [5, 6, 0], price: 2000000, roomTypeId: 1 },
            ],
          },
        ],
      },
      {
        id: "3",
        label: "2026-12-24 - 2026-12-26, 2026-12-31 - 2027-01-02 (Lễ Giáng sinh & Tết Dương lịch)",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-12-24",
            to: "2026-12-26",
            dayGroups: [{ id: "1", label: "Tất cả ngày lễ", days: [0, 1, 2, 3, 4, 5, 6], price: 3500000, roomTypeId: 1 }],
          },
          {
            from: "2026-12-31",
            to: "2027-01-02",
            dayGroups: [{ id: "1", label: "Tất cả ngày lễ", days: [0, 1, 2, 3, 4, 5, 6], price: 3500000, roomTypeId: 1 }],
          },
        ],
      },
    ],
    note: "Resort 5 sao ven biển Mỹ Khê, hồ bơi vô cực, spa cao cấp.",
    supplier: "Công ty TNHH Dịch Vụ Lữ Hành Phương Nam",
    isActive: true,
  },
  {
    id: "4",
    code: "HO104",
    name: "Hoàng Gia Palace Hotel",
    rate: "4",
    country: "Vietnam",
    city: "Hanoi",
    address: "56 Trần Duy Hưng, Cầu Giấy",
    roomTypes: [
      { id: 1, name: "Phòng tiêu chuẩn", maxGuests: 2, note: "25m2, đầy đủ tiện nghi" },
      { id: 2, name: "Phòng suite", maxGuests: 3, note: "50m2, phòng khách riêng" },
    ],
    pricingPeriods: [
      {
        id: "1",
        label: "2026-04-01 - 2026-12-31",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-04-01",
            to: "2026-12-31",
            dayGroups: [{ id: "1", label: "Tất cả ngày", days: [0, 1, 2, 3, 4, 5, 6], price: 1100000, roomTypeId: 1 }],
          },
        ],
      },
    ],
    note: "Khách sạn 4 sao khu vực Cầu Giấy, gần các trung tâm thương mại lớn.",
    supplier: "Công ty CP Vận Chuyển Du Lịch Hoàng Gia",
    isActive: true,
  },
  {
    id: "5",
    code: "HO105",
    name: "Biển Xanh Nha Trang Hotel",
    rate: "4",
    country: "Vietnam",
    city: "Nha Trang",
    address: "12 Trần Phú, Lộc Thọ",
    roomTypes: [
      { id: 1, name: "Phòng standard", maxGuests: 2, note: "View thành phố 22m2" },
      { id: 2, name: "Phòng deluxe biển", maxGuests: 2, note: "View biển trực tiếp 28m2" },
      { id: 3, name: "Phòng junior suite", maxGuests: 3, note: "View biển 45m2" },
    ],
    pricingPeriods: [
      {
        id: "1",
        label: "2026-04-01 - 2026-07-31",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-04-01",
            to: "2026-07-31",
            dayGroups: [
              { id: "1", label: "T2-T6", days: [1, 2, 3, 4, 5], price: 900000, roomTypeId: 1 },
              { id: "2", label: "T7-CN", days: [6, 0], price: 1100000, roomTypeId: 1 },
            ],
          },
        ],
      },
      {
        id: "2",
        label: "2026-08-01 - 2026-10-31",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-08-01",
            to: "2026-10-31",
            dayGroups: [
              { id: "1", label: "T2-T6", days: [1, 2, 3, 4, 5], price: 750000, roomTypeId: 1 },
              { id: "2", label: "T7-CN", days: [6, 0], price: 900000, roomTypeId: 1 },
            ],
          },
        ],
      },
      {
        id: "3",
        label: "2026-11-01 - 2027-03-31",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-11-01",
            to: "2027-03-31",
            dayGroups: [
              { id: "1", label: "T2-T6", days: [1, 2, 3, 4, 5], price: 820000, roomTypeId: 1 },
              { id: "2", label: "T7-CN", days: [6, 0], price: 980000, roomTypeId: 1 },
            ],
          },
        ],
      },
    ],
    note: "Khách sạn 4 sao ngay trên bãi biển Trần Phú nổi tiếng.",
    supplier: "Công ty TNHH Khách Sạn Và Resort Biển Xanh",
    isActive: true,
  },
  {
    id: "6",
    code: "HO106",
    name: "Mekong Explorer Lodge",
    rate: "3",
    country: "Vietnam",
    city: "Can Tho",
    address: "34 Hòa Bình, Ninh Kiều",
    roomTypes: [
      { id: 1, name: "Phòng standard", maxGuests: 2, note: "Phòng tiêu chuẩn 20m2" },
      { id: 2, name: "Phòng deluxe sông", maxGuests: 2, note: "View sông Cần Thơ 26m2" },
    ],
    pricingPeriods: [
      {
        id: "1",
        label: "2026-04-01 - 2026-12-31",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-04-01",
            to: "2026-12-31",
            dayGroups: [{ id: "1", label: "Tất cả ngày", days: [0, 1, 2, 3, 4, 5, 6], price: 650000, roomTypeId: 1 }],
          },
        ],
      },
    ],
    note: "Khách sạn 3 sao tại bến Ninh Kiều, gần chợ nổi Cái Răng.",
    supplier: "Công ty TNHH Du Lịch Mekong Explorer",
    isActive: true,
  },
  {
    id: "7",
    code: "HO107",
    name: "Đông Dương Heritage Hotel",
    rate: "4",
    country: "Vietnam",
    city: "Hue",
    address: "99 Lê Lợi, Vĩnh Ninh",
    roomTypes: [
      { id: 1, name: "Phòng superior", maxGuests: 2, note: "Phong cách cổ điển Huế 28m2" },
      { id: 2, name: "Phòng deluxe", maxGuests: 2, note: "View sông Hương 35m2" },
      { id: 3, name: "Phòng suite hoàng gia", maxGuests: 3, note: "Nội thất phong cách cung đình 65m2" },
    ],
    pricingPeriods: [
      {
        id: "1",
        label: "2026-04-01 - 2026-12-31",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-04-01",
            to: "2026-12-31",
            dayGroups: [
              { id: "1", label: "T2-T5", days: [1, 2, 3, 4], price: 1100000, roomTypeId: 1 },
              { id: "2", label: "T6-CN", days: [5, 6, 0], price: 1350000, roomTypeId: 1 },
            ],
          },
        ],
      },
    ],
    note: "Khách sạn cổ kính mang kiến trúc cung đình Huế, gần kinh thành.",
    supplier: "Công ty CP Dịch Vụ Du Lịch Đông Dương",
    isActive: true,
  },
  {
    id: "8",
    code: "HO108",
    name: "Mặt Trời Phú Quốc Resort",
    rate: "5",
    country: "Vietnam",
    city: "Phu Quoc",
    address: "5 Đường Trần Hưng Đạo, Dương Đông",
    roomTypes: [
      { id: 1, name: "Phòng garden view", maxGuests: 2, note: "Hướng vườn nhiệt đới 32m2" },
      { id: 2, name: "Phòng ocean view", maxGuests: 2, note: "View biển hoàng hôn 40m2" },
      { id: 3, name: "Pool villa", maxGuests: 4, note: "Villa hồ bơi riêng 120m2" },
    ],
    pricingPeriods: [
      {
        id: "1",
        label: "2026-11-01 - 2027-04-30 (Mùa khô)",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-11-01",
            to: "2027-04-30",
            dayGroups: [
              { id: "1", label: "T2-T5", days: [1, 2, 3, 4], price: 2500000, roomTypeId: 1 },
              { id: "2", label: "T6-CN", days: [5, 6, 0], price: 3200000, roomTypeId: 1 },
            ],
          },
        ],
      },
    ],
    note: "Resort 5 sao đẳng cấp quốc tế, bãi Sao - một trong những bãi biển đẹp nhất thế giới.",
    supplier: "Công ty CP Giải Trí Và Du Lịch Mặt Trời",
    isActive: true,
  },
  {
    id: "9",
    code: "HO109",
    name: "Thiên Long Airport Hotel",
    rate: "3",
    country: "Vietnam",
    city: "Ho Chi Minh City",
    address: "200 Hoàng Văn Thụ, Phú Nhuận",
    roomTypes: [
      { id: 1, name: "Phòng đơn", maxGuests: 1, note: "Phòng đơn tiêu chuẩn 18m2" },
      { id: 2, name: "Phòng đôi", maxGuests: 2, note: "Phòng đôi tiêu chuẩn 22m2" },
    ],
    pricingPeriods: [
      {
        id: "1",
        label: "2026-04-01 - 2026-12-31",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-04-01",
            to: "2026-12-31",
            dayGroups: [{ id: "1", label: "Tất cả ngày", days: [0, 1, 2, 3, 4, 5, 6], price: 550000, roomTypeId: 1 }],
          },
        ],
      },
    ],
    note: "Khách sạn 3 sao gần sân bay Tân Sơn Nhất, thuận tiện transit.",
    supplier: "Công ty CP Hàng Không Dịch Vụ Thiên Long",
    isActive: false,
  },
  {
    id: "10",
    code: "HO110",
    name: "Toàn Cầu Boutique Hotel",
    rate: "4",
    country: "Vietnam",
    city: "Hanoi",
    address: "18 Lý Thường Kiệt, Hoàn Kiếm",
    roomTypes: [
      { id: 1, name: "Phòng classic", maxGuests: 2, note: "Phong cách boutique 26m2" },
      { id: 2, name: "Phòng premium", maxGuests: 2, note: "View phố cổ 32m2" },
      { id: 3, name: "Phòng penthouse", maxGuests: 2, note: "Tầng thượng, view toàn thành phố 55m2" },
    ],
    pricingPeriods: [
      {
        id: "1",
        label: "2026-04-01 - 2026-12-31",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-04-01",
            to: "2026-12-31",
            dayGroups: [
              { id: "1", label: "T2-T6", days: [1, 2, 3, 4, 5], price: 1300000, roomTypeId: 1 },
              { id: "2", label: "T7-CN", days: [6, 0], price: 1600000, roomTypeId: 1 },
            ],
          },
        ],
      },
    ],
    note: "Khách sạn boutique 4 sao tại phố cổ Hà Nội, kiến trúc Đông Dương độc đáo.",
    supplier: "Công ty TNHH Dịch Vụ Visa Và Hộ Chiếu Toàn Cầu",
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
