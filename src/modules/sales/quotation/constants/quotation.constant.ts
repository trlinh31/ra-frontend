import type { QuotationStatus } from "@/modules/sales/quotation/types/quotation.type";

export const QUOTATION_STATUS_LABEL: Record<QuotationStatus, string> = {
  draft: "Bản nháp",
  sent: "Đã gửi",
  approved: "Đã chấp thuận",
  rejected: "Bị từ chối",
  expired: "Hết hạn",
};

export const QUOTATION_STATUS_OPTIONS = (Object.entries(QUOTATION_STATUS_LABEL) as [QuotationStatus, string][]).map(([value, label]) => ({
  value,
  label,
}));

export const CANCELLATION_REASONS = [
  { value: "customer_cancel", label: "Khách hủy chủ động" },
  { value: "insufficient_pax", label: "Không đủ số lượng khách tối thiểu" },
  { value: "force_majeure", label: "Sự cố bất khả kháng (thiên tai, dịch bệnh...)" },
  { value: "internal", label: "Lý do nội bộ công ty" },
  { value: "other", label: "Khác" },
];
