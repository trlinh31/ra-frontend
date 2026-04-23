import { userMockStore } from "@/modules/userManagement/data/user.mock-store";
import type { TripRequestStatus } from "../types/trip-request.type";

export const TRIP_REQUEST_STATUS_LABEL: Record<TripRequestStatus, string> = {
  new: "Mới",
  assigned: "Đã phân công",
  in_progress: "Đang xử lý",
  converted: "Đã chốt",
  lost: "Mất lead",
  on_hold: "Tạm hoãn",
};

export const TRIP_REQUEST_STATUS_OPTIONS = (Object.keys(TRIP_REQUEST_STATUS_LABEL) as TripRequestStatus[]).map((s) => ({
  value: s,
  label: TRIP_REQUEST_STATUS_LABEL[s],
}));

export const LEAD_SOURCE_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Điện thoại" },
  { value: "zalo", label: "Zalo" },
  { value: "referral", label: "Giới thiệu" },
  { value: "walk_in", label: "Walk-in" },
  { value: "other", label: "Khác" },
];

export const LEAD_SOURCE_LABEL: Record<string, string> = {
  email: "Email",
  phone: "Điện thoại",
  zalo: "Zalo",
  referral: "Giới thiệu",
  walk_in: "Walk-in",
  other: "Khác",
};

export const SERVICE_LEVEL_OPTIONS = [
  { value: "budget", label: "Budget" },
  { value: "standard", label: "Standard" },
  { value: "luxury", label: "Luxury" },
];

export const SERVICE_LEVEL_LABEL: Record<string, string> = {
  budget: "Budget",
  standard: "Standard",
  luxury: "Luxury",
};

export const SERVICE_LEVEL_BADGE: Record<string, string> = {
  budget: "bg-gray-100 text-gray-700",
  standard: "bg-blue-100 text-blue-700",
  luxury: "bg-amber-100 text-amber-800",
};

export const LOST_REASON_OPTIONS = [
  { value: "no_response", label: "Khách không phản hồi" },
  { value: "price_too_high", label: "Giá quá cao" },
  { value: "chose_competitor", label: "Chọn công ty khác" },
  { value: "cancelled_trip", label: "Hủy kế hoạch đi" },
  { value: "other", label: "Lý do khác" },
];

export const LOST_REASON_LABEL: Record<string, string> = {
  no_response: "Khách không phản hồi",
  price_too_high: "Giá quá cao",
  chose_competitor: "Chọn công ty khác",
  cancelled_trip: "Hủy kế hoạch đi",
  other: "Lý do khác",
};

export const SELLER_OPTIONS = userMockStore
  .getAll()
  .filter((u) => (u.role === "SELLER" || u.role === "SALE_MANAGER") && u.isActive)
  .map((u) => ({ value: u.id, label: u.fullName }));
