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

export const MOCK_OPERATORS = [
  { id: "op1", name: "Nguyễn Thị Mai" },
  { id: "op2", name: "Trần Văn Bình" },
  { id: "op3", name: "Lê Hoàng Nam" },
  { id: "op4", name: "Phạm Thu Hà" },
];
