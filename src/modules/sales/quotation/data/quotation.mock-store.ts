import { tourMockStore } from "@/modules/tour/tour/data/tour.mock-store";
import type { Quotation, QuotationStatus, QuotationVersion } from "../types/quotation.type";

function computeCostTotal(itinerary: Quotation["itinerary"]): Record<string, number> {
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

// Seed mock data
const _t1 = tourMockStore.getById("t1");
const _t2 = tourMockStore.getById("t2");

let _quotations: Quotation[] = [
  {
    id: "q1",
    code: "BG-2026-001",
    tourTemplateId: "t1",
    tourTemplateName: _t1?.name ?? "",
    customerName: "Công ty TNHH Ánh Sáng",
    customerEmail: "contact@anhsang.com",
    customerPhone: "0901234567",
    numberOfPeople: 15,
    departureDateEst: "2026-06-10",
    itinerary: _t1?.itinerary ?? [],
    costTotal: computeCostTotal(_t1?.itinerary ?? []),
    sellingPrice: {},
    terms: "Đã bao gồm: vé máy bay, khách sạn 4 sao, hướng dẫn viên. Không bao gồm: chi tiêu cá nhân.",
    status: "approved",
    currentVersion: 2,
    versions: [
      {
        version: 1,
        sentAt: "2026-04-15",
        itinerary: _t1?.itinerary ?? [],
        costTotal: computeCostTotal(_t1?.itinerary ?? []),
        sellingPrice: {},
        note: "Phiên bản đầu tiên",
      },
      {
        version: 2,
        sentAt: "2026-04-18",
        itinerary: _t1?.itinerary ?? [],
        costTotal: computeCostTotal(_t1?.itinerary ?? []),
        sellingPrice: {},
        note: "Đã điều chỉnh giá theo yêu cầu khách",
      },
    ],
    createdBy: "Seller A",
    sentAt: "2026-04-18",
    approvedAt: "2026-04-20",
    note: "Khách yêu cầu phòng hướng biển, 3 suất ăn chay.",
    createdAt: "2026-04-14",
  },
  {
    id: "q2",
    code: "BG-2026-002",
    tourTemplateId: "t2",
    tourTemplateName: _t2?.name ?? "",
    customerName: "Gia đình anh Tuấn",
    customerPhone: "0912345678",
    numberOfPeople: 6,
    departureDateEst: "2026-07-05",
    itinerary: _t2?.itinerary ?? [],
    costTotal: computeCostTotal(_t2?.itinerary ?? []),
    sellingPrice: {},
    status: "sent",
    currentVersion: 1,
    versions: [
      {
        version: 1,
        sentAt: "2026-04-21",
        itinerary: _t2?.itinerary ?? [],
        costTotal: computeCostTotal(_t2?.itinerary ?? []),
        sellingPrice: {},
      },
    ],
    createdBy: "Seller B",
    sentAt: "2026-04-21",
    note: "",
    createdAt: "2026-04-20",
  },
  {
    id: "q3",
    code: "BG-2026-003",
    customerName: "Hội cựu sinh viên K40",
    customerPhone: "0987654321",
    numberOfPeople: 30,
    itinerary: [],
    costTotal: {},
    sellingPrice: {},
    status: "draft",
    currentVersion: 0,
    versions: [],
    createdBy: "Seller A",
    note: "Đang trao đổi lịch trình",
    createdAt: "2026-04-22",
  },
];

let _counter = 4;

export const quotationMockStore = {
  getAll: (): Quotation[] => [..._quotations],

  getById: (id: string): Quotation | undefined => _quotations.find((q) => q.id === id),

  create: (data: Omit<Quotation, "id" | "code" | "costTotal" | "currentVersion" | "versions" | "createdAt">): Quotation => {
    const template = data.tourTemplateId ? tourMockStore.getById(data.tourTemplateId) : undefined;
    const itinerary = template?.itinerary ?? data.itinerary ?? [];
    const costTotal = computeCostTotal(itinerary);

    const q: Quotation = {
      ...data,
      id: `q${Date.now()}`,
      code: `BG-2026-${String(_counter++).padStart(3, "0")}`,
      itinerary,
      costTotal,
      currentVersion: 0,
      versions: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    _quotations = [..._quotations, q];
    return q;
  },

  /** Gửi báo giá cho khách — tạo snapshot version mới */
  send: (id: string, sellingPrice: Record<string, number>, terms?: string, versionNote?: string): void => {
    _quotations = _quotations.map((q) => {
      if (q.id !== id) return q;
      const newVersion = q.currentVersion + 1;
      const snapshot: QuotationVersion = {
        version: newVersion,
        sentAt: new Date().toISOString().slice(0, 10),
        itinerary: q.itinerary,
        costTotal: q.costTotal,
        sellingPrice,
        note: versionNote,
      };
      return {
        ...q,
        status: "sent" as QuotationStatus,
        currentVersion: newVersion,
        sellingPrice,
        terms: terms ?? q.terms,
        versions: [...q.versions, snapshot],
        sentAt: new Date().toISOString().slice(0, 10),
      };
    });
  },

  /** Khách chấp thuận báo giá */
  approve: (id: string): void => {
    _quotations = _quotations.map((q) =>
      q.id === id ? { ...q, status: "approved" as QuotationStatus, approvedAt: new Date().toISOString().slice(0, 10) } : q
    );
  },

  /** Khách từ chối hoặc hết hạn */
  close: (id: string, status: "rejected" | "expired"): void => {
    _quotations = _quotations.map((q) => (q.id === id ? { ...q, status } : q));
  },

  /** Lưu ID của ConfirmedTour đã được tạo từ báo giá này */
  linkConfirmedTour: (id: string, confirmedTourId: string): void => {
    _quotations = _quotations.map((q) => (q.id === id ? { ...q, confirmedTourId } : q));
  },

  delete: (id: string): void => {
    _quotations = _quotations.filter((q) => q.id !== id);
  },
};
