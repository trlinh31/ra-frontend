import type { TourItineraryItem } from "@/modules/tour/tour/types/tour.type";

export type ConfirmedTourStatus = "draft" | "pending_approval" | "confirmed" | "in_operation" | "completed" | "rejected" | "cancelled";

export type ConfirmedTour = {
  id: string;
  /** Tour mẫu gốc (nếu tạo trực tiếp không qua báo giá) */
  tourTemplateId?: string;
  tourTemplateName?: string;
  /** Báo giá gốc đã approved (nếu tạo từ báo giá) */
  quotationId?: string;
  code: string;
  customerName: string;
  numberOfPeople: number;
  departureDate: string;
  itinerary: TourItineraryItem[];
  totalCost: Record<string, number>;
  status: ConfirmedTourStatus;
  note: string;
  createdBy: string;
  approvedBy?: string;
  assignedTo?: string;
  assignedAt?: string;
  operationNote?: string;
  /** Người yêu cầu hủy */
  cancelledBy?: string;
  /** Thời điểm hủy */
  cancelledAt?: string;
  /** Lý do hủy */
  cancellationReason?: string;
  createdAt: string;
};
