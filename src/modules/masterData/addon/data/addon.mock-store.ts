import type { AddonEntityType, AddonService } from "@/modules/masterData/addon/types/addon.type";

const initialAddons: AddonService[] = [
  {
    id: "addon-001",
    entityType: "hotel",
    entityId: "1",
    name: "Giường phụ",
    price: 200000,
    currency: "VND",
    description: "Thêm giường phụ cho phòng đôi",
  },
  {
    id: "addon-002",
    entityType: "hotel",
    entityId: "1",
    name: "Bữa sáng buffet",
    price: 150000,
    currency: "VND",
    description: "Bữa sáng buffet tại nhà hàng tầng 1",
  },
  {
    id: "addon-003",
    entityType: "hotel",
    entityId: "1",
    name: "Đưa đón sân bay",
    price: 300000,
    currency: "VND",
    description: "Xe đưa đón từ sân bay Nội Bài",
  },
  {
    id: "addon-004",
    entityType: "hotel",
    entityId: "2",
    name: "Phòng xông hơi",
    price: 250000,
    currency: "VND",
    description: "Sử dụng phòng xông hơi và spa",
  },
  {
    id: "addon-005",
    entityType: "restaurant",
    entityId: "1",
    name: "Tiệc ngoài trời",
    price: 500000,
    currency: "VND",
    description: "Tổ chức tiệc ngoài trời tại khu vườn nhà hàng",
  },
  {
    id: "addon-006",
    entityType: "transport",
    entityId: "1",
    name: "Ghế em bé",
    price: 100000,
    currency: "VND",
    description: "Ghế ngồi an toàn dành cho trẻ em dưới 5 tuổi",
  },
  {
    id: "addon-007",
    entityType: "flight",
    entityId: "1",
    name: "Hành lý thêm 20kg",
    price: 350000,
    currency: "VND",
    description: "Thêm 20kg hành lý ký gửi cho chuyến bay",
  },
  {
    id: "addon-008",
    entityType: "tour_guide",
    entityId: "1",
    name: "Hướng dẫn viên riêng",
    price: 800000,
    currency: "VND",
    description: "Hướng dẫn viên riêng phục vụ theo yêu cầu",
  },
  {
    id: "addon-009",
    entityType: "entrance_fee",
    entityId: "1",
    name: "Vé ưu tiên",
    price: 120000,
    currency: "VND",
    description: "Vé vào cửa ưu tiên không cần xếp hàng",
  },
  {
    id: "addon-010",
    entityType: "group_tour",
    entityId: "1",
    name: "Bảo hiểm du lịch",
    price: 180000,
    currency: "VND",
    description: "Gói bảo hiểm du lịch toàn diện trong suốt chuyến đi",
  },
];

let _addons: AddonService[] = [...initialAddons];

export const addonMockStore = {
  getByEntity: (entityType: AddonEntityType, entityId: string): AddonService[] =>
    _addons.filter((a) => a.entityType === entityType && a.entityId === entityId),

  getById: (id: string): AddonService | undefined => _addons.find((a) => a.id === id),

  create: (data: Omit<AddonService, "id">): AddonService => {
    const addon: AddonService = { ...data, id: `addon-${Date.now()}` };
    _addons = [..._addons, addon];
    return addon;
  },

  update: (id: string, data: Omit<AddonService, "id">): AddonService => {
    const addon: AddonService = { ...data, id };
    _addons = _addons.map((a) => (a.id === id ? addon : a));
    return addon;
  },

  delete: (id: string): void => {
    _addons = _addons.filter((a) => a.id !== id);
  },
};
