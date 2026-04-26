import { dayMockStore } from "@/modules/tour/day/data/day.mock-store";
import type { Tour, TourDay } from "../types/tour.type";

const embedDay = (id: string): TourDay => {
  const d = dayMockStore.getById(id)!;
  return { kind: "day", code: d.code, title: d.title, country: d.country, city: d.city, description: d.description, services: d.services };
};

let _tours: Tour[] = [
  {
    id: "t1",
    code: "HN-HAL-3N2D",
    name: "Hà Nội - Hạ Long 3 Ngày 2 Đêm",
    description: "Hành trình khám phá Hà Nội và vịnh Hạ Long kỳ vĩ",
    content: "<p>Chào mừng quý khách đến với hành trình khám phá <strong>Hà Nội – Hạ Long</strong> tuyệt vời!</p>",
    numberOfPeople: 10,
    itinerary: [
      embedDay("day1"),
      embedDay("day2"),
      embedDay("day3"),
      {
        kind: "group_tour",
        groupTourId: "1",
        pricingPeriodId: "gt1-p1",
        dayGroupId: "gt1-dg1",
        name: "Tour Hà Nội - Hạ Long 3N2Đ",
        unitPrice: 4500000,
        currency: "VND",
      },
    ],
  },
  {
    id: "t2",
    code: "HN-2N1D",
    name: "Hà Nội City Tour 2 Ngày 1 Đêm",
    description: "Khám phá thủ đô Hà Nội trong 2 ngày",
    content: "<p>Trải nghiệm <strong>Hà Nội</strong> – thành phố ngàn năm văn hiến.</p>",
    numberOfPeople: 15,
    itinerary: [embedDay("day1"), embedDay("day2")],
  },
  {
    id: "t3",
    code: "DN-HOI-4N3D",
    name: "Đà Nẵng - Hội An 4 Ngày 3 Đêm",
    description: "Khám phá Đà Nẵng, Bà Nà Hills và phố cổ Hội An",
    content: "<p>Hành trình tuyệt vời qua <strong>Đà Nẵng – Bà Nà Hills – Hội An</strong> đầy màu sắc.</p>",
    numberOfPeople: 20,
    itinerary: [
      embedDay("day3"),
      embedDay("day5"),
      embedDay("day6"),
      {
        kind: "group_tour",
        groupTourId: "2",
        pricingPeriodId: "gt2-p1",
        dayGroupId: "gt2-dg1",
        name: "Tour Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ",
        unitPrice: 6800000,
        currency: "VND",
      },
    ],
  },
  {
    id: "t4",
    code: "HCM-CUCHI-2N1D",
    name: "TP.HCM - Củ Chi - Mỹ Tho 2 Ngày 1 Đêm",
    description: "Tham quan địa đạo Củ Chi và sông nước miền Tây",
    content: "<p>Hành trình lịch sử và thiên nhiên qua <strong>TP.HCM – Củ Chi – Mỹ Tho</strong>.</p>",
    numberOfPeople: 25,
    itinerary: [embedDay("day7"), embedDay("day8")],
  },
  {
    id: "t5",
    code: "PQ-3N2D",
    name: "Phú Quốc Đảo Ngọc 3 Ngày 2 Đêm",
    description: "Nghỉ dưỡng và khám phá đảo ngọc Phú Quốc",
    content: "<p>Tận hưởng biển xanh, cát trắng tại <strong>Phú Quốc</strong> – hòn đảo thiên đường.</p>",
    numberOfPeople: 12,
    itinerary: [
      embedDay("day9"),
      {
        kind: "group_tour",
        groupTourId: "3",
        pricingPeriodId: "",
        dayGroupId: "",
        name: "Tour Phú Quốc 3N2Đ",
        unitPrice: 0,
        currency: "VND",
      },
    ],
  },
  {
    id: "t6",
    code: "BKK-PAT-5N4D",
    name: "Bangkok - Pattaya 5 Ngày 4 Đêm",
    description: "Khám phá Thái Lan sôi động từ Bangkok tới Pattaya",
    content: "<p>Trải nghiệm văn hóa và giải trí tại <strong>Bangkok – Pattaya</strong> hấp dẫn.</p>",
    numberOfPeople: 18,
    itinerary: [
      embedDay("day4"),
      {
        kind: "group_tour",
        groupTourId: "5",
        pricingPeriodId: "",
        dayGroupId: "",
        name: "Tour Bangkok - Pattaya 5N4Đ",
        unitPrice: 0,
        currency: "VND",
      },
    ],
  },
  {
    id: "t7",
    code: "SGP-MY-6N5D",
    name: "Singapore - Malaysia 6 Ngày 5 Đêm",
    description: "Hành trình khám phá hai đất nước Đông Nam Á hiện đại",
    content: "<p>Trải nghiệm sự kết hợp độc đáo giữa <strong>Singapore</strong> và <strong>Malaysia</strong>.</p>",
    numberOfPeople: 22,
    itinerary: [
      embedDay("day10"),
      {
        kind: "group_tour",
        groupTourId: "6",
        pricingPeriodId: "",
        dayGroupId: "",
        name: "Tour Singapore - Malaysia 6N5Đ",
        unitPrice: 0,
        currency: "VND",
      },
    ],
  },
  {
    id: "t8",
    code: "SAPA-FAN-3N2D",
    name: "Sapa - Fansipan 3 Ngày 2 Đêm",
    description: "Chinh phục nóc nhà Đông Dương và khám phá bản làng dân tộc",
    content: "<p>Hành trình chinh phục <strong>Fansipan</strong> và trải nghiệm văn hóa vùng cao Tây Bắc.</p>",
    numberOfPeople: 16,
    itinerary: [
      embedDay("day1"),
      {
        kind: "group_tour",
        groupTourId: "4",
        pricingPeriodId: "",
        dayGroupId: "",
        name: "Tour Sapa - Fansipan 3N2Đ",
        unitPrice: 0,
        currency: "VND",
      },
    ],
  },
  {
    id: "t9",
    code: "NT-DL-5N4D",
    name: "Nha Trang - Đà Lạt 5 Ngày 4 Đêm",
    description: "Biển xanh Nha Trang kết hợp thành phố ngàn hoa Đà Lạt",
    content: "<p>Hành trình đặc sắc từ <strong>Nha Trang</strong> biển xanh đến <strong>Đà Lạt</strong> mộng mơ.</p>",
    numberOfPeople: 14,
    itinerary: [
      {
        kind: "group_tour",
        groupTourId: "10",
        pricingPeriodId: "",
        dayGroupId: "",
        name: "Tour Nha Trang - Đà Lạt 5N4Đ",
        unitPrice: 0,
        currency: "VND",
      },
    ],
  },
  {
    id: "t10",
    code: "JP-7N6D",
    name: "Nhật Bản Tokyo - Osaka - Kyoto 7 Ngày 6 Đêm",
    description: "Hành trình khám phá xứ sở hoa anh đào",
    content: "<p>Trải nghiệm văn hóa Nhật Bản qua <strong>Tokyo – Núi Phú Sĩ – Osaka – Kyoto</strong>.</p>",
    numberOfPeople: 20,
    itinerary: [
      embedDay("day10"),
      {
        kind: "group_tour",
        groupTourId: "7",
        pricingPeriodId: "",
        dayGroupId: "",
        name: "Tour Nhật Bản Tokyo - Osaka - Kyoto 7N6Đ",
        unitPrice: 0,
        currency: "VND",
      },
    ],
  },
];

export const tourMockStore = {
  getAll: (): Tour[] => [..._tours],
  getById: (id: string): Tour | undefined => _tours.find((t) => t.id === id),
  create: (data: Omit<Tour, "id">): Tour => {
    const tour: Tour = { ...data, id: `t${Date.now()}` };
    _tours = [..._tours, tour];
    return tour;
  },
  update: (id: string, data: Omit<Tour, "id">): Tour => {
    const tour: Tour = { ...data, id };
    _tours = _tours.map((t) => (t.id === id ? tour : t));
    return tour;
  },
  delete: (id: string): void => {
    _tours = _tours.filter((t) => t.id !== id);
  },
};
