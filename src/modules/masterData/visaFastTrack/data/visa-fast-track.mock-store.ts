import type { VisaService } from "@/modules/masterData/visaFastTrack/types/visa-fast-track.type";

let _items: VisaService[] = [
  {
    id: "i1",
    code: "FT01",
    group: "Đón FT",
    serviceName: "Đón FT",
    price: 20,
    priceUnit: "PAX",
    description: "Đón khách ở visa on arrival line ưu tiên dành cho các công ty đăn ký đón",
    pickupLocation: "Visa on arrival",
  },
  {
    id: "i2",
    code: "VIPB",
    group: "Đón FT",
    serviceName: "ĐÓN VIP B",
    price: 100,
    priceUnit: "GROUP",
    description: "Đón khách ở visa on arrival nhập cảnh ưu tiên qua bục, Hộ chiếu trả sau bục nhập cảnh",
    pickupLocation: "Visa on arrival",
  },
  {
    id: "i3",
    code: "FT02",
    group: "Đón FT",
    serviceName: "Tiền fastrack",
    price: 10,
    priceUnit: "PAX",
    description: "Qua Immigration nhanh sau khi check in hàng không xong",
    pickupLocation: "Đón khách quầy E-F",
  },
  {
    id: "i4",
    code: "FT03",
    group: "Đón FT",
    serviceName: "Tiền fastrack + SOI CHIỀU",
    price: 15,
    priceUnit: "GROUP",
    description: "Qua Immigration + soi chiếu nhanh sau khi check in hàng không xong",
    pickupLocation: "Đón khách quầy E-F",
  },
];

export const visaFastTrackMockStore = {
  getAll: (): VisaService[] => [..._items],
  getItemById: (id: string) => _items.find((i) => i.id === id),
  create: (data: Omit<VisaService, "id">): VisaService => {
    const item: VisaService = { ...data, id: `i${Date.now()}` };
    _items = [..._items, item];
    return item;
  },
  update: (id: string, data: Omit<VisaService, "id">): VisaService => {
    const item: VisaService = { ...data, id };
    _items = _items.map((x) => (x.id === id ? item : x));
    return item;
  },
  delete: (id: string): void => {
    _items = _items.filter((i) => i.id !== id);
  },
};
