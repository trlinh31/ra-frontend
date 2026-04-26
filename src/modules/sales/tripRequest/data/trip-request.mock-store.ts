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
    holdUntil: "2026-05-15",
    internalNotes: "Khách nói chờ xin kinh phí từ hội, hẹn liên hệ lại vào giữa tháng 5.",
    status: "on_hold",
    quotationIds: [],
    createdBy: "Seller B",
    createdAt: "2026-04-22",
  },
  {
    id: "tr5",
    code: "TR-2026-005",
    customerName: "Nhóm du lịch công ty FPT Software",
    customerEmail: "admin@fpt.com",
    customerPhone: "0938000111",
    leadSource: "email",
    destination: "Bangkok - Pattaya",
    departureDateEst: "2026-09-20",
    durationDays: 5,
    numberOfAdults: 40,
    numberOfChildren: 0,
    specialRequirements: "Team building ngoài trời, show Tiffany, buffet hải sản",
    budgetEstimate: 280_000_000,
    budgetCurrency: "VND",
    assignedTo: "u3",
    status: "in_progress",
    quotationIds: ["q4"],
    createdBy: "Seller A",
    createdAt: "2026-04-23",
  },
  {
    id: "tr6",
    code: "TR-2026-006",
    customerName: "Đoàn khách Công ty Vingroup",
    customerEmail: "travel@vingroup.net",
    customerPhone: "0912000999",
    leadSource: "referral",
    destination: "Singapore - Malaysia",
    departureDateEst: "2026-10-05",
    durationDays: 6,
    numberOfAdults: 25,
    numberOfChildren: 5,
    budgetEstimate: 500_000_000,
    budgetCurrency: "VND",
    assignedTo: "u4",
    status: "converted",
    quotationIds: ["q5"],
    confirmedTourId: "ct4",
    createdBy: "Seller B",
    createdAt: "2026-04-18",
  },
  {
    id: "tr7",
    code: "TR-2026-007",
    customerName: "Anh Tuấn - Nhóm bạn thân",
    customerPhone: "0977001122",
    leadSource: "zalo",
    destination: "Nhật Bản - Tokyo - Osaka",
    departureDateEst: "2026-11-01",
    durationDays: 7,
    numberOfAdults: 6,
    numberOfChildren: 0,
    specialRequirements: "Đi mùa lá đỏ, cần khách sạn gần ga Shinjuku",
    status: "lost",
    quotationIds: [],
    lostReason: "Khách hủy do vấn đề visa, sẽ xem xét lại năm sau",
    createdBy: "Seller A",
    createdAt: "2026-04-15",
  },
  {
    id: "tr8",
    code: "TR-2026-008",
    customerName: "Chị Hoa - Hội bà mẹ trẻ",
    customerPhone: "0965112233",
    leadSource: "walk_in",
    destination: "Nha Trang - Đà Lạt",
    departureDateEst: "2026-07-20",
    durationDays: 5,
    numberOfAdults: 10,
    numberOfChildren: 8,
    specialRequirements: "Phòng gia đình, có dịch vụ trông trẻ",
    status: "new",
    quotationIds: [],
    createdBy: "Seller B",
    createdAt: "2026-04-25",
  },
  {
    id: "tr9",
    code: "TR-2026-009",
    customerName: "Trường THPT Chu Văn An",
    customerEmail: "chuvan.travel@gmail.com",
    customerPhone: "0243456789",
    leadSource: "phone",
    destination: "TP.HCM - Củ Chi - Mỹ Tho",
    departureDateEst: "2026-05-25",
    durationDays: 2,
    numberOfAdults: 5,
    numberOfChildren: 120,
    specialRequirements: "Tham quan lịch sử, phù hợp học sinh THPT",
    budgetEstimate: 90_000_000,
    budgetCurrency: "VND",
    assignedTo: "u3",
    status: "assigned",
    quotationIds: [],
    createdBy: "Seller A",
    createdAt: "2026-04-24",
  },
  {
    id: "tr10",
    code: "TR-2026-010",
    customerName: "Câu lạc bộ leo núi Hà Nội",
    customerPhone: "0989334455",
    leadSource: "other",
    destination: "Sapa - Fansipan",
    departureDateEst: "2026-06-15",
    durationDays: 3,
    numberOfAdults: 15,
    numberOfChildren: 0,
    specialRequirements: "Trekking bản làng, cắm trại qua đêm, hướng dẫn viên địa phương",
    assignedTo: "u4",
    internalNotes: "Đã trao đổi lịch trình, đang hoàn thiện báo giá",
    status: "in_progress",
    quotationIds: ["q6"],
    createdBy: "Seller B",
    createdAt: "2026-04-24",
  },
];

let _counter = 11;

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
