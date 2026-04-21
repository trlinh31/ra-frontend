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
