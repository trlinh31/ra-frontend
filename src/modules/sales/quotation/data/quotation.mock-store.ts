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
const _t3 = tourMockStore.getById("t3");
const _t4 = tourMockStore.getById("t4");
const _t5 = tourMockStore.getById("t5");
const _t6 = tourMockStore.getById("t6");
const _t7 = tourMockStore.getById("t7");
const _t8 = tourMockStore.getById("t8");
const _t9 = tourMockStore.getById("t9");
const _t10 = tourMockStore.getById("t10");

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
    sellingPrice: { VND: 78_000_000 },
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
    sellingPrice: { VND: 32_400_000 },
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
  {
    id: "q4",
    code: "BG-2026-004",
    tourTemplateId: "t6",
    tourTemplateName: _t6?.name ?? "",
    customerName: "Nhóm du lịch công ty FPT Software",
    customerEmail: "admin@fpt.com",
    customerPhone: "0938000111",
    numberOfPeople: 40,
    departureDateEst: "2026-09-20",
    itinerary: _t6?.itinerary ?? [],
    costTotal: computeCostTotal(_t6?.itinerary ?? []),
    sellingPrice: { VND: 320_000_000 },
    terms: "Bao gồm: vé máy bay, khách sạn 4 sao, visa Thái Lan, show Tiffany.",
    status: "sent",
    currentVersion: 1,
    versions: [
      {
        version: 1,
        sentAt: "2026-04-23",
        itinerary: _t6?.itinerary ?? [],
        costTotal: computeCostTotal(_t6?.itinerary ?? []),
        sellingPrice: { VND: 320_000_000 },
        note: "Báo giá lần đầu",
      },
    ],
    createdBy: "Seller A",
    sentAt: "2026-04-23",
    note: "Khách yêu cầu thêm hoạt động team building ngoài trời",
    createdAt: "2026-04-23",
  },
  {
    id: "q5",
    code: "BG-2026-005",
    tourTemplateId: "t7",
    tourTemplateName: _t7?.name ?? "",
    customerName: "Đoàn khách Công ty Vingroup",
    customerEmail: "travel@vingroup.net",
    customerPhone: "0912000999",
    numberOfPeople: 30,
    departureDateEst: "2026-10-05",
    itinerary: _t7?.itinerary ?? [],
    costTotal: computeCostTotal(_t7?.itinerary ?? []),
    sellingPrice: { VND: 480_000_000 },
    terms: "Bao gồm vé máy bay, visa Malaysia, khách sạn 5 sao, xe coach, vé Universal Studios.",
    status: "approved",
    currentVersion: 2,
    versions: [
      {
        version: 1,
        sentAt: "2026-04-19",
        itinerary: _t7?.itinerary ?? [],
        costTotal: computeCostTotal(_t7?.itinerary ?? []),
        sellingPrice: { VND: 500_000_000 },
        note: "Phiên bản đầu tiên",
      },
      {
        version: 2,
        sentAt: "2026-04-21",
        itinerary: _t7?.itinerary ?? [],
        costTotal: computeCostTotal(_t7?.itinerary ?? []),
        sellingPrice: { VND: 480_000_000 },
        note: "Đã điều chỉnh giá theo yêu cầu khách",
      },
    ],
    createdBy: "Seller B",
    sentAt: "2026-04-21",
    approvedAt: "2026-04-23",
    confirmedTourId: "ct4",
    note: "Khách đã xác nhận, đã tạo tour xác nhận CT-2026-004",
    createdAt: "2026-04-18",
  },
  {
    id: "q6",
    code: "BG-2026-006",
    tourTemplateId: "t8",
    tourTemplateName: _t8?.name ?? "",
    customerName: "Câu lạc bộ leo núi Hà Nội",
    customerPhone: "0989334455",
    numberOfPeople: 15,
    departureDateEst: "2026-06-15",
    itinerary: _t8?.itinerary ?? [],
    costTotal: computeCostTotal(_t8?.itinerary ?? []),
    sellingPrice: {},
    status: "draft",
    currentVersion: 0,
    versions: [],
    createdBy: "Seller B",
    note: "Đang hoàn thiện lịch trình trekking bản làng",
    createdAt: "2026-04-24",
  },
  {
    id: "q7",
    code: "BG-2026-007",
    tourTemplateId: "t3",
    tourTemplateName: _t3?.name ?? "",
    customerName: "Công ty Cổ phần Thiên Minh",
    customerEmail: "booking@thienminh.vn",
    customerPhone: "0913456789",
    numberOfPeople: 20,
    departureDateEst: "2026-08-01",
    itinerary: _t3?.itinerary ?? [],
    costTotal: computeCostTotal(_t3?.itinerary ?? []),
    sellingPrice: { VND: 145_000_000 },
    terms: "Bao gồm: vé máy bay, khách sạn 4 sao, Bà Nà Hills, hướng dẫn viên.",
    status: "rejected",
    currentVersion: 1,
    versions: [
      {
        version: 1,
        sentAt: "2026-04-10",
        itinerary: _t3?.itinerary ?? [],
        costTotal: computeCostTotal(_t3?.itinerary ?? []),
        sellingPrice: { VND: 145_000_000 },
      },
    ],
    createdBy: "Seller A",
    sentAt: "2026-04-10",
    note: "Khách từ chối vì giá cao hơn đối thủ",
    createdAt: "2026-04-08",
  },
  {
    id: "q8",
    code: "BG-2026-008",
    tourTemplateId: "t5",
    tourTemplateName: _t5?.name ?? "",
    customerName: "Nhóm khách lẻ Phú Quốc",
    customerPhone: "0977998877",
    numberOfPeople: 10,
    departureDateEst: "2026-05-01",
    itinerary: _t5?.itinerary ?? [],
    costTotal: computeCostTotal(_t5?.itinerary ?? []),
    sellingPrice: { VND: 68_000_000 },
    status: "expired",
    currentVersion: 1,
    versions: [
      {
        version: 1,
        sentAt: "2026-03-20",
        itinerary: _t5?.itinerary ?? [],
        costTotal: computeCostTotal(_t5?.itinerary ?? []),
        sellingPrice: { VND: 68_000_000 },
      },
    ],
    createdBy: "Seller B",
    sentAt: "2026-03-20",
    note: "Báo giá hết hạn, khách không phản hồi sau 30 ngày",
    createdAt: "2026-03-18",
  },
  {
    id: "q9",
    code: "BG-2026-009",
    tourTemplateId: "t4",
    tourTemplateName: _t4?.name ?? "",
    customerName: "Trường THPT Chu Văn An",
    customerEmail: "chuvan.travel@gmail.com",
    customerPhone: "0243456789",
    numberOfPeople: 125,
    departureDateEst: "2026-05-25",
    itinerary: _t4?.itinerary ?? [],
    costTotal: computeCostTotal(_t4?.itinerary ?? []),
    sellingPrice: { VND: 87_500_000 },
    terms: "Bao gồm: xe 45 chỗ, vé tham quan, ăn trưa. Không bao gồm: đồ ăn cá nhân.",
    status: "sent",
    currentVersion: 1,
    versions: [
      {
        version: 1,
        sentAt: "2026-04-25",
        itinerary: _t4?.itinerary ?? [],
        costTotal: computeCostTotal(_t4?.itinerary ?? []),
        sellingPrice: { VND: 87_500_000 },
        note: "Giá đã chiết khấu 10% cho đoàn học sinh",
      },
    ],
    createdBy: "Seller A",
    sentAt: "2026-04-25",
    note: "Đoàn học sinh, cần thêm xe phụ trợ",
    createdAt: "2026-04-24",
  },
  {
    id: "q10",
    code: "BG-2026-010",
    tourTemplateId: "t10",
    tourTemplateName: _t10?.name ?? "",
    customerName: "Gia đình anh Khôi",
    customerPhone: "0908765432",
    customerEmail: "khoi.family@gmail.com",
    numberOfPeople: 4,
    departureDateEst: "2026-11-10",
    itinerary: _t10?.itinerary ?? [],
    costTotal: computeCostTotal(_t10?.itinerary ?? []),
    sellingPrice: { VND: 120_000_000 },
    terms: "Bao gồm vé máy bay, khách sạn 4 sao, vé Shinkansen, onsen, hướng dẫn viên tiếng Việt.",
    status: "approved",
    currentVersion: 1,
    versions: [
      {
        version: 1,
        sentAt: "2026-04-22",
        itinerary: _t10?.itinerary ?? [],
        costTotal: computeCostTotal(_t10?.itinerary ?? []),
        sellingPrice: { VND: 120_000_000 },
        note: "Gói gia đình mùa lá đỏ",
      },
    ],
    createdBy: "Seller B",
    sentAt: "2026-04-22",
    approvedAt: "2026-04-25",
    confirmedTourId: "ct10",
    note: "Gia đình 2 vợ chồng + 2 con, yêu cầu phòng kết nối",
    createdAt: "2026-04-21",
  },
];

let _counter = 11;

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

  /** Cập nhật thông tin đoàn + lịch trình (chỉ khi draft/sent) */
  update: (
    id: string,
    data: Partial<
      Pick<Quotation, "customerName" | "customerEmail" | "customerPhone" | "numberOfPeople" | "departureDateEst" | "note" | "terms" | "itinerary">
    >
  ): void => {
    _quotations = _quotations.map((q) => {
      if (q.id !== id) return q;
      const itinerary = data.itinerary ?? q.itinerary;
      return {
        ...q,
        ...data,
        itinerary,
        costTotal: computeCostTotal(itinerary),
      };
    });
  },

  delete: (id: string): void => {
    _quotations = _quotations.filter((q) => q.id !== id);
  },
};
