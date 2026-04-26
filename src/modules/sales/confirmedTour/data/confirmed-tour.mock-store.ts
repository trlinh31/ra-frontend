import type { ServiceExecutionStatus } from "@/modules/operations/types/operation.type";
import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
import { tourMockStore } from "@/modules/tour/tour/data/tour.mock-store";
import type { ConfirmedTour, ConfirmedTourStatus } from "../types/confirmed-tour.type";

function computeTotalCost(itinerary: ConfirmedTour["itinerary"]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const entry of itinerary) {
    if (entry.kind === "day") {
      for (const svc of entry.services) {
        if (!svc.unitPrice || !svc.currency) continue;
        totals[svc.currency] = (totals[svc.currency] ?? 0) + svc.unitPrice;
      }
    } else {
      if (!entry.unitPrice || !entry.currency) continue;
      totals[entry.currency] = (totals[entry.currency] ?? 0) + entry.unitPrice;
    }
  }
  return totals;
}

let _confirmedTours: ConfirmedTour[] = [
  (() => {
    const template = tourMockStore.getById("t1")!;
    return {
      id: "ct1",
      tourTemplateId: "t1",
      tourTemplateName: template.name,
      code: "CT-2026-001",
      customerName: "Đoàn khách Công ty ABC",
      numberOfPeople: 12,
      departureDate: "2026-05-15",
      itinerary: template.itinerary,
      totalCost: computeTotalCost(template.itinerary),
      status: "confirmed" as ConfirmedTourStatus,
      note: "Khách yêu cầu phòng hướng biển, ăn chay cho 3 người.",
      createdBy: "Seller A",
      createdAt: "2026-04-10",
    };
  })(),
  (() => {
    const template = tourMockStore.getById("t2")!;
    return {
      id: "ct2",
      tourTemplateId: "t2",
      tourTemplateName: template.name,
      code: "CT-2026-002",
      customerName: "Gia đình anh Minh",
      numberOfPeople: 5,
      departureDate: "2026-06-01",
      itinerary: template.itinerary,
      totalCost: computeTotalCost(template.itinerary),
      status: "pending_approval" as ConfirmedTourStatus,
      note: "",
      createdBy: "Seller B",
      createdAt: "2026-04-18",
    };
  })(),
  (() => {
    const template = tourMockStore.getById("t1")!;
    // Seed checklist: mark a few services as done/confirmed to simulate in-progress tour
    const checklist: Record<string, ServiceExecutionStatus> = {};
    template.itinerary.forEach((item, itemIdx) => {
      if (item.kind === "day") {
        item.services.forEach((svc, svcIdx) => {
          if (itemIdx === 0) checklist[svc.id] = "done";
          else if (itemIdx === 1 && svcIdx === 0) checklist[svc.id] = "confirmed";
          else checklist[svc.id] = "pending";
        });
      }
    });
    return {
      id: "ct3",
      tourTemplateId: "t1",
      tourTemplateName: template.name,
      // ct3 được tạo từ báo giá q1 đã approved
      quotationId: "q1",
      code: "CT-2026-003",
      customerName: "Công ty TNHH Ánh Sáng",
      customerPhone: "0901234567",
      customerEmail: "contact@anhsang.com",
      numberOfPeople: 15,
      departureDate: "2026-06-10",
      itinerary: template.itinerary,
      totalCost: computeTotalCost(template.itinerary),
      status: "in_operation" as ConfirmedTourStatus,
      note: "Khách yêu cầu phòng hướng biển, 3 suất ăn chay.",
      createdBy: "Seller A",
      assignedTo: "u6",
      assignedAt: "2026-04-20",
      serviceChecklist: checklist,
      createdAt: "2026-04-20",
    };
  })(),
];

let _counter = 4;

export const confirmedTourMockStore = {
  getAll: (): ConfirmedTour[] => [..._confirmedTours],

  getById: (id: string): ConfirmedTour | undefined => _confirmedTours.find((ct) => ct.id === id),

  /**
   * Tạo ConfirmedTour trực tiếp từ tour mẫu
   */
  create: (data: Omit<ConfirmedTour, "id" | "code" | "totalCost" | "createdAt">): ConfirmedTour => {
    const template = data.tourTemplateId ? tourMockStore.getById(data.tourTemplateId) : undefined;
    const itinerary = template?.itinerary ?? data.itinerary ?? [];
    const ct: ConfirmedTour = {
      ...data,
      id: `ct${Date.now()}`,
      code: `CT-2026-${String(_counter++).padStart(3, "0")}`,
      itinerary,
      totalCost: computeTotalCost(itinerary),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    _confirmedTours = [..._confirmedTours, ct];
    return ct;
  },

  /**
   * Tạo ConfirmedTour từ Quotation đã approved — sao chép snapshot lịch trình
   */
  createFromQuotation: (
    quotationId: string,
    extra: {
      customerName: string;
      numberOfPeople: number;
      departureDate: string;
      note: string;
      createdBy: string;
    }
  ): ConfirmedTour | null => {
    const quotation = quotationMockStore.getById(quotationId);
    if (!quotation || quotation.status !== "approved") return null;
    if (quotation.confirmedTourId) return null; // Đã tạo trước đó

    const itinerary = quotation.itinerary;
    const ct: ConfirmedTour = {
      id: `ct${Date.now()}`,
      code: `CT-2026-${String(_counter++).padStart(3, "0")}`,
      quotationId,
      tourTemplateId: quotation.tourTemplateId,
      tourTemplateName: quotation.tourTemplateName,
      customerName: extra.customerName,
      customerPhone: quotation.customerPhone,
      customerEmail: quotation.customerEmail,
      numberOfPeople: extra.numberOfPeople,
      departureDate: extra.departureDate,
      itinerary,
      totalCost: computeTotalCost(itinerary),
      status: "draft",
      note: extra.note,
      createdBy: extra.createdBy,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    _confirmedTours = [..._confirmedTours, ct];
    // Liên kết ngược lại Quotation → ConfirmedTour
    quotationMockStore.linkConfirmedTour(quotationId, ct.id);
    return ct;
  },

  updateStatus: (id: string, status: ConfirmedTourStatus, extra?: Partial<ConfirmedTour>): void => {
    _confirmedTours = _confirmedTours.map((ct) => (ct.id === id ? { ...ct, status, ...extra } : ct));
  },

  /**
   * Cập nhật trạng thái thực thi một dịch vụ trong checklist
   */
  updateServiceStatus: (tourId: string, serviceId: string, status: ServiceExecutionStatus): void => {
    _confirmedTours = _confirmedTours.map((ct) => {
      if (ct.id !== tourId) return ct;
      return {
        ...ct,
        serviceChecklist: { ...ct.serviceChecklist, [serviceId]: status },
      };
    });
  },

  /**
   * Khởi tạo checklist cho tour (lần đầu assign/vận hành)
   */
  initChecklist: (tourId: string): void => {
    _confirmedTours = _confirmedTours.map((ct) => {
      if (ct.id !== tourId || ct.serviceChecklist) return ct;
      const checklist: Record<string, ServiceExecutionStatus> = {};
      ct.itinerary.forEach((item) => {
        if (item.kind === "day") {
          item.services.forEach((svc) => {
            checklist[svc.id] = "pending";
          });
        }
      });
      return { ...ct, serviceChecklist: checklist };
    });
  },

  assign: (id: string, operatorId: string, operationNote: string): void => {
    _confirmedTours = _confirmedTours.map((ct) => {
      if (ct.id !== id) return ct;
      return {
        ...ct,
        // Nếu đang reassign từ in_operation thì giữ nguyên status
        status: ct.status === "in_operation" ? "in_operation" : ("in_operation" as ConfirmedTourStatus),
        assignedTo: operatorId,
        assignedAt: new Date().toISOString().slice(0, 10),
        operationNote: operationNote || ct.operationNote,
      };
    });
  },

  /**
   * Hủy tour:
   * - draft / pending_approval / confirmed → huỷ ngay
   * - in_operation → cần duyệt đặc biệt (mock: huỷ ngay nếu có force=true)
   * - completed → không thể huỷ
   */
  cancel: (id: string, reason: string, cancelledBy: string, force = false): { success: boolean; message?: string } => {
    const tour = _confirmedTours.find((ct) => ct.id === id);
    if (!tour) return { success: false, message: "Không tìm thấy tour." };
    if (tour.status === "completed") return { success: false, message: "Không thể hủy tour đã hoàn thành." };
    if (tour.status === "cancelled") return { success: false, message: "Tour đã bị hủy trước đó." };
    if (tour.status === "in_operation" && !force) {
      return {
        success: false,
        message: "Tour đang vận hành. Cần xác nhận từ Sale Manager VÀ Operation Manager để hủy.",
      };
    }
    _confirmedTours = _confirmedTours.map((ct) =>
      ct.id === id
        ? {
            ...ct,
            status: "cancelled" as ConfirmedTourStatus,
            cancelledBy,
            cancelledAt: new Date().toISOString().slice(0, 10),
            cancellationReason: reason,
          }
        : ct
    );
    return { success: true };
  },

  delete: (id: string): void => {
    _confirmedTours = _confirmedTours.filter((ct) => ct.id !== id);
  },
};
