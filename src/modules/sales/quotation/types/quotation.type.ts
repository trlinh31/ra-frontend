import type { TourItineraryItem } from "@/modules/tour/tour/types/tour.type";

export type QuotationStatus = "draft" | "sent" | "approved" | "rejected" | "expired";

export type QuotationVersion = {
  version: number;
  sentAt: string;
  itinerary: TourItineraryItem[];
  costTotal: Record<string, number>;
  sellingPrice: Record<string, number>;
  note?: string;
};

export type Quotation = {
  id: string;
  code: string;
  tourTemplateId?: string;
  tourTemplateName?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  numberOfPeople: number;
  departureDateEst?: string;
  itinerary: TourItineraryItem[];
  costTotal: Record<string, number>;
  sellingPrice: Record<string, number>;
  terms?: string;
  status: QuotationStatus;
  currentVersion: number;
  versions: QuotationVersion[];
  createdBy: string;
  sentAt?: string;
  approvedAt?: string;
  note?: string;
  createdAt: string;
  /** ID của ConfirmedTour được tạo từ báo giá này (nếu đã tạo) */
  confirmedTourId?: string;
};
