import type { TripRequest, TripRequestStatus } from "../types/trip-request.type";

let _requests: TripRequest[] = [
  {
    id: "tr1",
    code: "TR-2026-001",
    customerName: "Gia đình anh Hoàng",
    customerPhone: "0901234567",
    leadSource: "phone",
    destination: "Đà Lạt",
    departureDateEst: "2026-07-15",
    durationDays: 3,
    numberOfAdults: 4,
    numberOfChildren: 2,
    serviceLevel: "standard",
    specialRequirements: "Cần phòng riêng cho trẻ em, ưu tiên resort gần trung tâm",
    status: "new",
    quotationIds: [],
    createdBy: "Seller A",
    createdAt: "2026-04-20",
  },
  {
    id: "tr2",
    code: "TR-2026-002",
    customerName: "Công ty TNHH Minh Phát",
    customerEmail: "hr@minhphat.com",
    customerPhone: "0912345678",
    leadSource: "email",
    destination: "Phú Quốc",
    departureDateEst: "2026-08-10",
    durationDays: 4,
    numberOfAdults: 30,
    numberOfChildren: 0,
    serviceLevel: "luxury",
    specialRequirements: "Team building, cần hoạt động ngoài trời và phòng hội nghị",
    budgetEstimate: 150_000_000,
    budgetCurrency: "VND",
    assignedTo: "u4",
    status: "assigned",
    quotationIds: [],
    createdBy: "Seller A",
    createdAt: "2026-04-21",
  },
  {
    id: "tr3",
    code: "TR-2026-003",
    customerName: "Nhóm bạn cựu sinh viên K38",
    customerPhone: "0987654321",
    leadSource: "referral",
    destination: "Hội An – Đà Nẵng",
    departureDateEst: "2026-06-20",
    durationDays: 5,
    numberOfAdults: 12,
    numberOfChildren: 0,
    serviceLevel: "standard",
    assignedTo: "u3",
    internalNotes: "Khách đã xem báo giá v1, yêu cầu giảm giá và thay khách sạn. Đang chờ phản hồi.",
    status: "in_progress",
    quotationIds: ["q2"],
    createdBy: "Seller A",
    createdAt: "2026-04-19",
  },
  {
    id: "tr4",
    code: "TR-2026-004",
    customerName: "Chị Lan – Hội phụ nữ phường",
    customerPhone: "0978123456",
    leadSource: "walk_in",
    destination: "Hà Nội – Hạ Long",
    departureDateEst: "2026-09-01",
    durationDays: 3,
    numberOfAdults: 20,
    numberOfChildren: 5,
    serviceLevel: "budget",
    holdUntil: "2026-05-15",
    internalNotes: "Khách nói chờ xin kinh phí từ hội, hẹn liên hệ lại vào giữa tháng 5.",
    status: "on_hold",
    quotationIds: [],
    createdBy: "Seller B",
    createdAt: "2026-04-22",
  },
];

let _counter = 5;

export const tripRequestMockStore = {
  getAll: (): TripRequest[] => [..._requests],

  getById: (id: string): TripRequest | undefined => _requests.find((r) => r.id === id),

  create: (data: Omit<TripRequest, "id" | "code" | "createdAt" | "quotationIds">): TripRequest => {
    const req: TripRequest = {
      ...data,
      id: `tr${Date.now()}`,
      code: `TR-2026-${String(_counter++).padStart(3, "0")}`,
      quotationIds: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    _requests = [..._requests, req];
    return req;
  },

  updateStatus: (id: string, status: TripRequestStatus, extra?: Partial<TripRequest>): void => {
    _requests = _requests.map((r) => (r.id === id ? { ...r, status, ...extra } : r));
  },

  assign: (id: string, assignedTo: string): void => {
    _requests = _requests.map((r) =>
      r.id === id ? { ...r, assignedTo, status: r.status === "new" ? ("assigned" as TripRequestStatus) : r.status } : r
    );
  },

  startProgress: (id: string): void => {
    _requests = _requests.map((r) => (r.id === id ? { ...r, status: "in_progress" as TripRequestStatus } : r));
  },

  linkQuotation: (id: string, quotationId: string): void => {
    _requests = _requests.map((r) => {
      if (r.id !== id) return r;
      if (r.quotationIds.includes(quotationId)) return r;
      return {
        ...r,
        quotationIds: [...r.quotationIds, quotationId],
        status: "in_progress" as TripRequestStatus,
      };
    });
  },

  markConverted: (id: string, confirmedTourId: string): void => {
    _requests = _requests.map((r) => (r.id === id ? { ...r, status: "converted" as TripRequestStatus, confirmedTourId } : r));
  },

  markLost: (id: string, lostReason: string): void => {
    _requests = _requests.map((r) => (r.id === id ? { ...r, status: "lost" as TripRequestStatus, lostReason } : r));
  },

  markOnHold: (id: string, holdUntil: string, note?: string): void => {
    _requests = _requests.map((r) => {
      if (r.id !== id) return r;
      const notes = note ? `${r.internalNotes ? r.internalNotes + "\n" : ""}${note}` : r.internalNotes;
      return { ...r, status: "on_hold" as TripRequestStatus, holdUntil, internalNotes: notes };
    });
  },

  updateNotes: (id: string, internalNotes: string): void => {
    _requests = _requests.map((r) => (r.id === id ? { ...r, internalNotes } : r));
  },

  delete: (id: string): void => {
    _requests = _requests.filter((r) => r.id !== id);
  },
};
