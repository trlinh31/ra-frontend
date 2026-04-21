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
    return {
      id: "ct3",
      tourTemplateId: "t1",
      tourTemplateName: template.name,
      code: "CT-2026-003",
      customerName: "Nhóm bạn Hội đồng hương",
      numberOfPeople: 20,
      departureDate: "2026-07-10",
      itinerary: template.itinerary,
      totalCost: computeTotalCost(template.itinerary),
      status: "in_operation" as ConfirmedTourStatus,
      note: "",
      createdBy: "Seller A",
      assignedTo: "op1",
      assignedAt: "2026-04-20",
      createdAt: "2026-04-15",
    };
  })(),
];

let _counter = 4;

export const confirmedTourMockStore = {
  getAll: (): ConfirmedTour[] => [..._confirmedTours],

  getById: (id: string): ConfirmedTour | undefined => _confirmedTours.find((ct) => ct.id === id),

  create: (data: Omit<ConfirmedTour, "id" | "code" | "totalCost" | "createdAt">): ConfirmedTour => {
    const template = tourMockStore.getById(data.tourTemplateId);
    const itinerary = template?.itinerary ?? [];
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

  updateStatus: (id: string, status: ConfirmedTourStatus, extra?: Partial<ConfirmedTour>): void => {
    _confirmedTours = _confirmedTours.map((ct) => (ct.id === id ? { ...ct, status, ...extra } : ct));
  },

  assign: (id: string, operatorId: string, operationNote: string): void => {
    _confirmedTours = _confirmedTours.map((ct) =>
      ct.id === id
        ? {
            ...ct,
            status: "in_operation" as ConfirmedTourStatus,
            assignedTo: operatorId,
            assignedAt: new Date().toISOString().slice(0, 10),
            operationNote,
          }
        : ct
    );
  },

  delete: (id: string): void => {
    _confirmedTours = _confirmedTours.filter((ct) => ct.id !== id);
  },
};
