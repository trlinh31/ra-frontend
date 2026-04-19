import type { TourGuide } from "@/modules/masterData/tourGuide/types/tourGuide.type";

const initialTourGuides: TourGuide[] = [
  {
    id: "1",
    code: "TG101",
    name: "Nguyễn Văn An",
    phone: "0123456789",
    email: "an.nguyen@travel.com",
    nationalId: "001099012345",
    country: "Vietnam",
    city: "Hanoi",
    address: "12 Hàng Bông, Hoàn Kiếm",
    language: "Tiếng Anh",
    pricePerDay: 800000,
    isActive: true,
  },
  {
    id: "2",
    code: "TG102",
    name: "Trần Thị Bích",
    phone: "0234567890",
    email: "bich.tran@travel.com",
    nationalId: "001099023456",
    country: "Vietnam",
    city: "Ho Chi Minh City",
    address: "88 Lê Lợi, Quận 1",
    language: "Tiếng Pháp",
    pricePerDay: 1000000,
    isActive: true,
  },
  {
    id: "3",
    code: "TG103",
    name: "Lê Hoàng Nam",
    phone: "0345678901",
    email: "nam.le@travel.com",
    nationalId: "001099034567",
    country: "Vietnam",
    city: "Da Nang",
    address: "55 Nguyễn Văn Linh, Hải Châu",
    language: "Tiếng Trung",
    pricePerDay: 900000,
    isActive: true,
  },
  {
    id: "4",
    code: "TG104",
    name: "Phạm Thị Lan",
    phone: "0456789012",
    email: "lan.pham@travel.com",
    nationalId: "001099045678",
    country: "Vietnam",
    city: "Hue",
    address: "22 Lê Duẩn, Thành phố Huế",
    language: "Tiếng Nhật",
    pricePerDay: 1200000,
    isActive: true,
  },
  {
    id: "5",
    code: "TG105",
    name: "Võ Minh Tuấn",
    phone: "0567890123",
    email: "tuan.vo@travel.com",
    nationalId: "001099056789",
    country: "Vietnam",
    city: "Nha Trang",
    address: "7 Trần Phú, Lộc Thọ",
    language: "Tiếng Hàn",
    pricePerDay: 1100000,
    isActive: true,
  },
  {
    id: "6",
    code: "TG106",
    name: "Đặng Thị Hoa",
    phone: "0678901234",
    email: "hoa.dang@travel.com",
    nationalId: "001099067890",
    country: "Vietnam",
    city: "Ho Chi Minh City",
    address: "135 Nguyễn Huệ, Quận 1",
    language: "Tiếng Anh",
    pricePerDay: 800000,
    isActive: false,
  },
  {
    id: "7",
    code: "TG107",
    name: "Bùi Quang Hưng",
    phone: "0789012345",
    email: "hung.bui@travel.com",
    nationalId: "001099078901",
    country: "Vietnam",
    city: "Can Tho",
    address: "45 Hòa Bình, Ninh Kiều",
    language: "Tiếng Anh",
    pricePerDay: 750000,
    isActive: true,
  },
  {
    id: "8",
    code: "TG108",
    name: "Ngô Thị Minh",
    phone: "0890123456",
    email: "minh.ngo@travel.com",
    nationalId: "001099089012",
    country: "Vietnam",
    city: "Hanoi",
    address: "30 Bà Triệu, Hoàn Kiếm",
    language: "Tiếng Đức",
    pricePerDay: 1050000,
    isActive: true,
  },
  {
    id: "9",
    code: "TG109",
    name: "Hoàng Văn Đức",
    phone: "0901234567",
    email: "duc.hoang@travel.com",
    nationalId: "001099090123",
    country: "Vietnam",
    city: "Phu Quoc",
    address: "10 Đường Trần Hưng Đạo, Dương Đông",
    language: "Tiếng Tây Ban Nha",
    pricePerDay: 950000,
    isActive: true,
  },
  {
    id: "10",
    code: "TG110",
    name: "Lý Thị Thu",
    phone: "0912345678",
    email: "thu.ly@travel.com",
    nationalId: "001099101234",
    country: "Vietnam",
    city: "Da Nang",
    address: "60 Lý Tự Trọng, Hải Châu",
    language: "Tiếng Ý",
    pricePerDay: 1000000,
    isActive: false,
  },
];

let _tourGuides: TourGuide[] = [...initialTourGuides];

export const tourGuideMockStore = {
  getAll: (): TourGuide[] => [..._tourGuides],

  getById: (id: string): TourGuide | undefined => _tourGuides.find((tourGuide) => tourGuide.id === id),

  create: (data: Omit<TourGuide, "id">) => {
    const tourGuide: TourGuide = { ...data, id: String(Date.now()) };
    _tourGuides = [..._tourGuides, tourGuide];
    return tourGuide;
  },

  update: (id: string, data: Omit<TourGuide, "id">) => {
    const tourGuide: TourGuide = { ...data, id };
    _tourGuides = _tourGuides.map((t) => (t.id === id ? tourGuide : t));
    return tourGuide;
  },

  delete: (id: string) => {
    _tourGuides = _tourGuides.filter((t) => t.id !== id);
  },
};
