import type { VisaServiceGroup, VisaServiceItem } from "../types/visa-fast-track.type";

let _groups: VisaServiceGroup[] = [
  { id: "g1", name: "ĐÓN" },
  { id: "g2", name: "TIỀN (khách tự lấy về)" },
  { id: "g3", name: "Dịch vụ thêm" },
];

let _items: VisaServiceItem[] = [
  {
    id: "i1",
    groupId: "g1",
    serviceName: "Đón FT",
    priceUsd: 20,
    priceUnit: "PAX",
    description: "Đón khách ở visa on arrival line ưu tiên dành cho các công ty đăn ký đón",
    pickupLocation: "Visa on arrival",
  },
  {
    id: "i2",
    groupId: "g1",
    serviceName: "ĐÓN VIP B",
    priceUsd: undefined,
    priceUnit: "",
    description: "Đón khách ở visa on arrival nhập cảnh ưu tiên qua bục, Hộ chiếu trả sau bục nhập cảnh",
    pickupLocation: "Visa on arrival",
  },
  {
    id: "i3",
    groupId: "g2",
    serviceName: "Tiền fastrack",
    priceUsd: undefined,
    priceUnit: "",
    description: "Qua Immigration nhanh sau khi check in hàng không xong",
    pickupLocation: "Đón khách quầy E-F",
  },
  {
    id: "i4",
    groupId: "g2",
    serviceName: "Tiền fastrack + SOI CHIỀU",
    priceUsd: undefined,
    priceUnit: "",
    description: "Qua Immigration + soi chiếu nhanh sau khi check in hàng không xong",
    pickupLocation: "Đón khách quầy E-F",
  },
  {
    id: "i5",
    groupId: "g2",
    serviceName: "TIỀN VIP B",
    priceUsd: undefined,
    priceUnit: "",
    description: "Qua Immigration VIP B khi check in hàng không xong",
    pickupLocation: "Đón khách quầy E-F",
  },
  {
    id: "i6",
    groupId: "g2",
    serviceName: "TIỀN VIP B + SOI CHIỀU",
    priceUsd: undefined,
    priceUnit: "",
    description: "Qua Immigration + Soi chiếu VIP B khi check in hàng không xong, HC trả sau bục nhập cảnh",
    pickupLocation: "Đón khách quầy E-F",
  },
  {
    id: "i7",
    groupId: "g3",
    serviceName: "Đón ổng lồng",
    priceUsd: undefined,
    priceUnit: "",
    description: "",
    pickupLocation: "",
  },
  {
    id: "i8",
    groupId: "g3",
    serviceName: "Lấy hành lý",
    priceUsd: undefined,
    priceUnit: "",
    description: "",
    pickupLocation: "",
  },
  {
    id: "i9",
    groupId: "g3",
    serviceName: "Hành lý + đưa ra ngoài",
    priceUsd: undefined,
    priceUnit: "",
    description: "",
    pickupLocation: "",
  },
  {
    id: "i10",
    groupId: "g3",
    serviceName: "Tiền đón sảnh",
    priceUsd: undefined,
    priceUnit: "",
    description: "",
    pickupLocation: "",
  },
];

export const visaFastTrackMockStore = {
  // Groups
  getAllGroups: (): VisaServiceGroup[] => [..._groups],
  getGroupById: (id: string) => _groups.find((g) => g.id === id),
  createGroup: (data: Omit<VisaServiceGroup, "id">): VisaServiceGroup => {
    const g: VisaServiceGroup = { ...data, id: `g${Date.now()}` };
    _groups = [..._groups, g];
    return g;
  },
  updateGroup: (id: string, data: Omit<VisaServiceGroup, "id">): VisaServiceGroup => {
    const g: VisaServiceGroup = { ...data, id };
    _groups = _groups.map((x) => (x.id === id ? g : x));
    return g;
  },
  deleteGroup: (id: string): void => {
    _groups = _groups.filter((g) => g.id !== id);
    _items = _items.filter((i) => i.groupId !== id);
  },

  // Items
  getAllItems: (): VisaServiceItem[] => [..._items],
  getItemById: (id: string) => _items.find((i) => i.id === id),
  createItem: (data: Omit<VisaServiceItem, "id">): VisaServiceItem => {
    const item: VisaServiceItem = { ...data, id: `i${Date.now()}` };
    _items = [..._items, item];
    return item;
  },
  updateItem: (id: string, data: Omit<VisaServiceItem, "id">): VisaServiceItem => {
    const item: VisaServiceItem = { ...data, id };
    _items = _items.map((x) => (x.id === id ? item : x));
    return item;
  },
  deleteItem: (id: string): void => {
    _items = _items.filter((i) => i.id !== id);
  },
};
