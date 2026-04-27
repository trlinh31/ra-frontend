import type { FollowUp } from "../types/follow-up.type";

let _followUps: FollowUp[] = [
  {
    id: "fu1",
    tripRequestId: "tr3",
    scheduledAt: "2026-04-28T09:00",
    note: "Gọi lại cho khách xác nhận có giảm giá thêm không, và thay khách sạn theo yêu cầu.",
    status: "pending",
    createdBy: "Seller A",
    createdAt: "2026-04-26T10:00:00",
  },
  {
    id: "fu2",
    tripRequestId: "tr3",
    scheduledAt: "2026-04-25T15:00",
    note: "Gửi báo giá v1 cho nhóm K38 qua Zalo.",
    status: "done",
    createdBy: "Seller A",
    createdAt: "2026-04-24T08:30:00",
    doneAt: "2026-04-25T15:10:00",
  },
  {
    id: "fu3",
    tripRequestId: "tr4",
    scheduledAt: "2026-05-15T08:30",
    note: "Liên hệ chị Lan xem Hội Phụ nữ đã duyệt kinh phí chưa.",
    status: "pending",
    createdBy: "Seller B",
    createdAt: "2026-04-22T14:00:00",
  },
];

let _nextId = 4;

export const followUpMockStore = {
  getByTripRequest: (tripRequestId: string): FollowUp[] =>
    _followUps
      .filter((f) => f.tripRequestId === tripRequestId)
      .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),

  add: (data: Omit<FollowUp, "id" | "createdAt">): FollowUp => {
    const newItem: FollowUp = {
      ...data,
      id: `fu${_nextId++}`,
      createdAt: new Date().toISOString(),
    };
    _followUps.push(newItem);
    return newItem;
  },

  markDone: (id: string): void => {
    _followUps = _followUps.map((f) =>
      f.id === id ? { ...f, status: "done", doneAt: new Date().toISOString() } : f
    );
  },

  markPending: (id: string): void => {
    _followUps = _followUps.map((f) =>
      f.id === id ? { ...f, status: "pending", doneAt: undefined } : f
    );
  },

  delete: (id: string): void => {
    _followUps = _followUps.filter((f) => f.id !== id);
  },
};
