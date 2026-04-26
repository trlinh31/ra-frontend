import type { ConfirmedTourStatus } from "@/modules/sales/confirmedTour/types/confirmed-tour.type";
import type { QuotationStatus } from "@/modules/sales/quotation/types/quotation.type";

export const QUOTATION_STATUS_CONFIG: Record<QuotationStatus, { label: string; color: string }> = {
  draft: { label: "Nháp", color: "#9ca3af" },
  sent: { label: "Đã gửi", color: "#0EA5E9" },
  approved: { label: "Chấp thuận", color: "#22c55e" },
  rejected: { label: "Từ chối", color: "#ef4444" },
  expired: { label: "Hết hạn", color: "#f59e0b" },
};

export const TOUR_STATUS_CONFIG: Record<ConfirmedTourStatus, { label: string; color: string; badgeCls: string }> = {
  draft: { label: "Nháp", color: "#d1d5db", badgeCls: "bg-gray-100 text-gray-600" },
  pending_approval: { label: "Chờ duyệt", color: "#f59e0b", badgeCls: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Đã xác nhận", color: "#0EA5E9", badgeCls: "bg-sky-100 text-sky-700" },
  in_operation: { label: "Đang vận hành", color: "#0D9488", badgeCls: "bg-teal-100 text-teal-700" },
  completed: { label: "Hoàn thành", color: "#22c55e", badgeCls: "bg-green-100 text-green-700" },
  rejected: { label: "Từ chối", color: "#ef4444", badgeCls: "bg-red-100 text-red-700" },
  cancelled: { label: "Đã hủy", color: "#f43f5e", badgeCls: "bg-rose-100 text-rose-700" },
};

export const MONTHLY_TREND = [
  { label: "T11/25", thu: 45_600_000, chi: 31_200_000 },
  { label: "T12/25", thu: 62_400_000, chi: 48_500_000 },
  { label: "T1/26", thu: 38_100_000, chi: 27_800_000 },
  { label: "T2/26", thu: 55_900_000, chi: 40_200_000 },
  { label: "T3/26", thu: 71_300_000, chi: 53_000_000 },
  { label: "T4/26", thu: 78_000_000, chi: 57_600_000 },
];

export const AREA_SERIES = [
  { key: "thu", label: "Doanh thu", color: "#22c55e", fill: "#dcfce7" },
  { key: "chi", label: "Chi phí", color: "#f43f5e", fill: "#ffe4e6" },
];

export const BAR_SERIES = [
  { key: "thu", label: "Doanh thu", color: "#0EA5E9" },
  { key: "chi", label: "Chi phí", color: "#f43f5e" },
];
