import type { AddonEntityType } from "@/modules/masterData/addon/types/addon.type";

export const ADDON_ENTITY_LABELS: Record<AddonEntityType, string> = {
  hotel: "Khách sạn",
  restaurant: "Nhà hàng",
  transport: "Vận chuyển",
  flight: "Chuyến bay",
  tour_guide: "Hướng dẫn viên",
  visa: "Visa / Fast Track",
  entrance_fee: "Phí vào cổng",
  group_tour: "Nhóm Tour",
};
