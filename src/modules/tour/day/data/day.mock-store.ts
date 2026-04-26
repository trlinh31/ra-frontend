import { ServiceType, type Day } from "../types/day.type";

let _days: Day[] = [
  {
    id: "day1",
    code: "HN-01",
    title: "Day 1 - Hà Nội: Đón đoàn & Nhận phòng",
    country: "Vietnam",
    city: "Hanoi",
    description: "Đón đoàn tại sân bay Nội Bài, di chuyển về khách sạn trung tâm Hà Nội.",
    services: [
      {
        id: "service1",
        serviceType: ServiceType.TRANSPORT,
        name: "Đón / Tiễn sân bay Nội Bài – Hà Nội",
        unitPrice: 900000,
        currency: "VND",
        transportDetail: {
          transportId: "1",
          capacity: "7",
        },
      },
      {
        id: "service2",
        serviceType: ServiceType.HOTEL,
        name: "Khách sạn Ánh Dương",
        unitPrice: 850000,
        currency: "VND",
        hotelDetail: {
          hotelId: "1",
          pricingPeriodId: "1",
          dayGroupId: "2",
          roomTypeId: "1",
        },
      },
    ],
  },
  {
    id: "day2",
    code: "HN-02",
    title: "Day 2 - Hà Nội: Tham quan phố cổ",
    country: "Vietnam",
    city: "Hanoi",
    description: "Tham quan Hồ Gươm, Văn Miếu, phố cổ 36 phố phường.",
    services: [
      {
        id: "service3",
        serviceType: ServiceType.TRANSPORT,
        name: "Hà Nội – Hạ Long",
        unitPrice: 1800000,
        currency: "VND",
        transportDetail: {
          transportId: "2",
          capacity: "16",
        },
      },
      {
        id: "service4",
        serviceType: ServiceType.HOTEL,
        name: "Hoàng Gia Palace Hotel",
        unitPrice: 1100000,
        currency: "VND",
        hotelDetail: {
          hotelId: "4",
          pricingPeriodId: "1",
          dayGroupId: "1",
          roomTypeId: "1",
        },
      },
    ],
  },
  {
    id: "day3",
    code: "DN-01",
    title: "Day 1 - Đà Nẵng: Đón đoàn & Check-in resort",
    country: "Vietnam",
    city: "Da Nang",
    description: "Đón đoàn tại sân bay Đà Nẵng, nhận phòng resort Mỹ Khê.",
    services: [
      {
        id: "service5",
        serviceType: ServiceType.TRANSPORT,
        name: "Đón / Tiễn sân bay Đà Nẵng – Trung tâm",
        unitPrice: 380000,
        currency: "VND",
        transportDetail: {
          transportId: "3",
          capacity: "7",
        },
      },
      {
        id: "service6",
        serviceType: ServiceType.HOTEL,
        name: "Phương Nam Beach Resort",
        unitPrice: 2800000,
        currency: "VND",
        hotelDetail: {
          hotelId: "3",
          pricingPeriodId: "1",
          dayGroupId: "2",
          roomTypeId: "1",
        },
      },
    ],
  },
  {
    id: "day4",
    code: "BKK-01",
    title: "Day 1 - Bangkok: Đến Bangkok & Di chuyển Pattaya",
    country: "Thailand",
    city: "Bangkok",
    description: "Đáp sân bay Suvarnabhumi, xe đưa đón về Pattaya nghỉ ngơi.",
    services: [
      {
        id: "service7",
        serviceType: ServiceType.TRANSPORT,
        name: "Bangkok – Pattaya Transfer",
        unitPrice: 4500,
        currency: "THB",
        transportDetail: {
          transportId: "4",
          capacity: "9",
        },
      },
      {
        id: "service8",
        serviceType: ServiceType.HOTEL,
        name: "Pattaya Beach Hotel",
        unitPrice: 3200,
        currency: "THB",
        hotelDetail: { hotelId: "5", pricingPeriodId: "1", dayGroupId: "1", roomTypeId: "1" },
      },
    ],
  },
  // ── Đà Nẵng - Hội An ────────────────────────────────────────────────────
  {
    id: "day5",
    code: "DN-02",
    title: "Day 2 - Bà Nà Hills & Cầu Vàng",
    country: "Vietnam",
    city: "Da Nang",
    description: "Tham quan Bà Nà Hills, check-in Cầu Vàng, trải nghiệm cáp treo dài nhất Đông Nam Á.",
    services: [
      {
        id: "svc-d5-1",
        serviceType: ServiceType.ENTRANCE_FEE,
        name: "Vé cáp treo + tham quan Bà Nà Hills",
        unitPrice: 750000,
        currency: "VND",
        entranceFeeDetail: { entranceFeeId: "1", pricingPeriodId: "1", ticketTypeIndex: "0", dayGroupId: "1", count: 1 },
      },
      {
        id: "svc-d5-2",
        serviceType: ServiceType.RESTAURANT,
        name: "Buffet trưa tại Bà Nà Hills",
        unitPrice: 320000,
        currency: "VND",
        restaurantDetail: { restaurantId: "1", pricingPeriodIndex: "0", comboPackageIndex: "0", dayGroupKey: "1" },
      },
      {
        id: "svc-d5-3",
        serviceType: ServiceType.TRANSPORT,
        name: "Xe 16 chỗ phục vụ cả ngày Đà Nẵng",
        unitPrice: 1200000,
        currency: "VND",
        transportDetail: { transportId: "3", capacity: "16" },
      },
    ],
  },
  {
    id: "day6",
    code: "HOI-01",
    title: "Day 3 - Hội An: Phố cổ & Làng nghề",
    country: "Vietnam",
    city: "Hoi An",
    description: "Dạo phố cổ Hội An về đêm, tham quan làng gốm Thanh Hà, thả đèn hoa đăng trên sông Hoài.",
    services: [
      {
        id: "svc-d6-1",
        serviceType: ServiceType.TRANSPORT,
        name: "Đà Nẵng – Hội An (khứ hồi)",
        unitPrice: 600000,
        currency: "VND",
        transportDetail: { transportId: "3", capacity: "16" },
      },
      {
        id: "svc-d6-2",
        serviceType: ServiceType.TOUR_GUIDE,
        name: "Hướng dẫn viên địa phương Hội An",
        unitPrice: 500000,
        currency: "VND",
        tourGuideDetail: { tourGuideId: "3" },
      },
      {
        id: "svc-d6-3",
        serviceType: ServiceType.RESTAURANT,
        name: "Cơm gà Hội An & Cao Lầu",
        unitPrice: 180000,
        currency: "VND",
        restaurantDetail: { restaurantId: "2", pricingPeriodIndex: "0", comboPackageIndex: "0", dayGroupKey: "1" },
      },
    ],
  },
  // ── TP.HCM ──────────────────────────────────────────────────────────────
  {
    id: "day7",
    code: "HCM-01",
    title: "Day 1 - TP.HCM: Đón đoàn & Tham quan trung tâm",
    country: "Vietnam",
    city: "Ho Chi Minh City",
    description: "Đón đoàn tại sân bay Tân Sơn Nhất, tham quan Dinh Độc Lập, Nhà thờ Đức Bà, Bưu điện Trung tâm.",
    services: [
      {
        id: "svc-d7-1",
        serviceType: ServiceType.TRANSPORT,
        name: "Đón / Tiễn sân bay Tân Sơn Nhất",
        unitPrice: 800000,
        currency: "VND",
        transportDetail: { transportId: "1", capacity: "16" },
      },
      {
        id: "svc-d7-2",
        serviceType: ServiceType.HOTEL,
        name: "Khách sạn Liberty Central Saigon",
        unitPrice: 1350000,
        currency: "VND",
        hotelDetail: { hotelId: "2", pricingPeriodId: "1", dayGroupId: "1", roomTypeId: "1" },
      },
      {
        id: "svc-d7-3",
        serviceType: ServiceType.TOUR_GUIDE,
        name: "Hướng dẫn viên TP.HCM",
        unitPrice: 600000,
        currency: "VND",
        tourGuideDetail: { tourGuideId: "1" },
      },
    ],
  },
  {
    id: "day8",
    code: "HCM-02",
    title: "Day 2 - Địa đạo Củ Chi & Sông nước Mỹ Tho",
    country: "Vietnam",
    city: "Ho Chi Minh City",
    description: "Tham quan địa đạo Củ Chi buổi sáng, buổi chiều du thuyền sông nước Tiền Giang – Mỹ Tho.",
    services: [
      {
        id: "svc-d8-1",
        serviceType: ServiceType.TRANSPORT,
        name: "Xe 29 chỗ cả ngày HCM – Củ Chi – Mỹ Tho",
        unitPrice: 2200000,
        currency: "VND",
        transportDetail: { transportId: "2", capacity: "29" },
      },
      {
        id: "svc-d8-2",
        serviceType: ServiceType.ENTRANCE_FEE,
        name: "Vé tham quan Địa đạo Củ Chi",
        unitPrice: 110000,
        currency: "VND",
        entranceFeeDetail: { entranceFeeId: "2", pricingPeriodId: "1", ticketTypeIndex: "0", dayGroupId: "1", count: 1 },
      },
      {
        id: "svc-d8-3",
        serviceType: ServiceType.RESTAURANT,
        name: "Cơm trưa đặc sản Mỹ Tho",
        unitPrice: 200000,
        currency: "VND",
        restaurantDetail: { restaurantId: "3", pricingPeriodIndex: "0", comboPackageIndex: "0", dayGroupKey: "1" },
      },
    ],
  },
  // ── Phú Quốc ────────────────────────────────────────────────────────────
  {
    id: "day9",
    code: "PQ-01",
    title: "Day 1 - Phú Quốc: Đón đoàn & Tắm biển Bãi Sao",
    country: "Vietnam",
    city: "Phu Quoc",
    description: "Bay thẳng Phú Quốc, nhận phòng resort, tắm biển Bãi Sao – bãi biển đẹp nhất Phú Quốc.",
    services: [
      {
        id: "svc-d9-1",
        serviceType: ServiceType.TRANSPORT,
        name: "Đón sân bay Phú Quốc – Resort",
        unitPrice: 350000,
        currency: "VND",
        transportDetail: { transportId: "1", capacity: "7" },
      },
      {
        id: "svc-d9-2",
        serviceType: ServiceType.HOTEL,
        name: "Vinpearl Resort & Spa Phú Quốc",
        unitPrice: 3500000,
        currency: "VND",
        hotelDetail: { hotelId: "3", pricingPeriodId: "1", dayGroupId: "1", roomTypeId: "2" },
      },
      {
        id: "svc-d9-3",
        serviceType: ServiceType.RESTAURANT,
        name: "Tối: Hải sản tươi tại chợ đêm Phú Quốc",
        unitPrice: 450000,
        currency: "VND",
        restaurantDetail: { restaurantId: "4", pricingPeriodIndex: "0", comboPackageIndex: "0", dayGroupKey: "1" },
      },
    ],
  },
  // ── Singapore ────────────────────────────────────────────────────────────
  {
    id: "day10",
    code: "SGP-01",
    title: "Day 1 - Singapore: Đến & Khám phá Marina Bay",
    country: "Singapore",
    city: "Singapore",
    description: "Đáp sân bay Changi, nhận phòng khách sạn, buổi tối dạo Marina Bay Sands & Gardens by the Bay.",
    services: [
      {
        id: "svc-d10-1",
        serviceType: ServiceType.TRANSPORT,
        name: "Sân bay Changi – Khách sạn (xe riêng)",
        unitPrice: 80,
        currency: "SGD",
        transportDetail: { transportId: "4", capacity: "9" },
      },
      {
        id: "svc-d10-2",
        serviceType: ServiceType.HOTEL,
        name: "Hotel Jen Orchardgateway Singapore",
        unitPrice: 220,
        currency: "SGD",
        hotelDetail: { hotelId: "1", pricingPeriodId: "1", dayGroupId: "1", roomTypeId: "1" },
      },
      {
        id: "svc-d10-3",
        serviceType: ServiceType.ENTRANCE_FEE,
        name: "Vé Gardens by the Bay (Flower Dome + Cloud Forest)",
        unitPrice: 53,
        currency: "SGD",
        entranceFeeDetail: { entranceFeeId: "3", pricingPeriodId: "1", ticketTypeIndex: "0", dayGroupId: "1", count: 1 },
      },
      {
        id: "svc-d10-4",
        serviceType: ServiceType.TOUR_GUIDE,
        name: "Hướng dẫn viên tiếng Việt – Singapore",
        unitPrice: 150,
        currency: "SGD",
        tourGuideDetail: { tourGuideId: "2" },
      },
    ],
  },
];

export const dayMockStore = {
  getAll: (): Day[] => [..._days],
  getById: (id: string): Day | undefined => _days.find((d) => d.id === id),
  create: (data: Omit<Day, "id">): Day => {
    const day: Day = { ...data, id: `day${Date.now()}` };
    _days = [..._days, day];
    return day;
  },
  update: (id: string, data: Omit<Day, "id">): Day => {
    const day: Day = { ...data, id };
    _days = _days.map((d) => (d.id === id ? day : d));
    return day;
  },
  delete: (id: string): void => {
    _days = _days.filter((d) => d.id !== id);
  },
};
