export type TripRequestStatus = "new" | "assigned" | "in_progress" | "converted" | "lost" | "on_hold";
export type LeadSource = "email" | "phone" | "zalo" | "referral" | "walk_in" | "other";

export type TripRequest = {
  id: string;
  code: string;
  // Thông tin khách hàng
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  leadSource: LeadSource;
  // Nhu cầu chuyến đi
  destination?: string;
  departureDateEst?: string;
  durationDays?: number;
  numberOfAdults: number;
  numberOfChildren: number;
  specialRequirements?: string;
  budgetEstimate?: number;
  budgetCurrency?: string;
  // Tour mẫu gợi ý (optional)
  suggestedTourId?: string;
  suggestedTourName?: string;
  // Phân công
  assignedTo?: string;
  // Trạng thái
  status: TripRequestStatus;
  // Liên kết
  quotationIds: string[];
  confirmedTourId?: string;
  // Lý do đóng
  lostReason?: string;
  holdUntil?: string;
  // Ghi chú nội bộ
  internalNotes?: string;
  createdBy: string;
  createdAt: string;
};
