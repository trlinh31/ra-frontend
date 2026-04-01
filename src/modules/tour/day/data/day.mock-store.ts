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
        name: "Biển Xanh Nha Trang Hotel",
        unitPrice: 900000,
        currency: "VND",
        hotelDetail: {
          hotelId: "5",
          pricingPeriodId: "1",
          dayGroupId: "1",
          roomTypeId: "1",
        },
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
