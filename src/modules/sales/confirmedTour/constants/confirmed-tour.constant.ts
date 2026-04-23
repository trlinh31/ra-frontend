import type { ConfirmedTourStatus } from "@/modules/sales/confirmedTour/types/confirmed-tour.type";

export const CONFIRMED_TOUR_STATUS_LABEL: Record<ConfirmedTourStatus, string> = {
  draft: "Bản nháp",
  pending_approval: "Chờ duyệt",
  confirmed: "Đã xác nhận",
  in_operation: "Đang vận hành",
  completed: "Hoàn thành",
  rejected: "Bị từ chối",
  cancelled: "Đã hủy",
};

export const CONFIRMED_TOUR_STATUS_OPTIONS = (Object.entries(CONFIRMED_TOUR_STATUS_LABEL) as [ConfirmedTourStatus, string][]).map(
  ([value, label]) => ({ value, label })
);
