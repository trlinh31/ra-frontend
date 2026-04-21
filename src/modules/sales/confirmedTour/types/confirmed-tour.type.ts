import type { TourItineraryItem } from "@/modules/tour/tour/types/tour.type";

export type ConfirmedTourStatus = "draft" | "pending_approval" | "confirmed" | "in_operation" | "completed" | "rejected" | "cancelled";

export type ConfirmedTour = {
  id: string;
  tourTemplateId: string;
  tourTemplateName: string;
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
  createdAt: string;
};
