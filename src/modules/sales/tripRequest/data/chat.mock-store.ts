import type { ChatMessage } from "@/modules/sales/tripRequest/types/chat.type";

let _messages: ChatMessage[] = [
  // ── TR-2026-003 — đang in_progress, có hội thoại thực tế ──────────────────
  {
    id: "cm1",
    tripRequestId: "tr3",
    sender: "staff",
    senderName: "Seller A",
    content: "Chào anh/chị! Em là Lan từ RA Travel. Em đã nhận được yêu cầu tour Hội An – Đà Nẵng 5 ngày của mình rồi ạ. Để em tư vấn thêm cho anh/chị nhé!",
    sentAt: "2026-04-19T09:15:00",
    isRead: true,
  },
  {
    id: "cm2",
    tripRequestId: "tr3",
    sender: "customer",
    senderName: "Nhóm cựu sinh viên K38",
    content: "Chào em Lan! Nhóm mình có 12 người, đi cuối tháng 6. Mình muốn hỏi có tour nào phù hợp với ngân sách khoảng 5-6 triệu/người không?",
    sentAt: "2026-04-19T09:32:00",
    isRead: true,
  },
  {
    id: "cm3",
    tripRequestId: "tr3",
    sender: "staff",
    senderName: "Seller A",
    content: "Dạ với ngân sách đó mình hoàn toàn có thể thiết kế tour 5 ngày 4 đêm chất lượng ạ. Bao gồm khách sạn 3 sao, xe riêng, hướng dẫn viên và các điểm tham quan chính. Em sẽ gửi báo giá chi tiết trong hôm nay nhé!",
    sentAt: "2026-04-19T09:45:00",
    isRead: true,
  },
  {
    id: "cm4",
    tripRequestId: "tr3",
    sender: "customer",
    senderName: "Nhóm cựu sinh viên K38",
    content: "Cảm ơn em! Nhóm mình có 2 bạn ăn chay, em lưu ý giúp nhé. Ngoài ra mình muốn có thêm buổi tối tự do để đi phố cổ.",
    sentAt: "2026-04-20T08:10:00",
    isRead: true,
  },
  {
    id: "cm5",
    tripRequestId: "tr3",
    sender: "staff",
    senderName: "Seller A",
    content: "Dạ em ghi chú rồi ạ! Em đã gửi báo giá v1 qua email của nhóm. Anh/chị xem và cho em biết ý kiến nhé. Lịch trình có sắp xếp 1 buổi tối tự do tại phố cổ Hội An và nhà hàng có menu chay riêng.",
    sentAt: "2026-04-21T10:00:00",
    isRead: true,
  },
  {
    id: "cm6",
    tripRequestId: "tr3",
    sender: "customer",
    senderName: "Nhóm cựu sinh viên K38",
    content: "Em ơi nhóm mình xem rồi, báo giá hơi cao so với dự kiến. Khách sạn có thể xuống 2 sao được không? Và bỏ bớt 1 điểm tham quan để giảm giá.",
    sentAt: "2026-04-22T14:30:00",
    isRead: true,
  },
  {
    id: "cm7",
    tripRequestId: "tr3",
    sender: "staff",
    senderName: "Seller A",
    content: "Dạ em hiểu ạ! Em sẽ điều chỉnh lại và gửi báo giá v2 trong ngày mai. Mình sẽ thay khách sạn Hội An sang option 2 sao tốt và cắt điểm Bà Nà Hills để tiết kiệm chi phí nhé.",
    sentAt: "2026-04-22T15:05:00",
    isRead: true,
  },
  {
    id: "cm8",
    tripRequestId: "tr3",
    sender: "customer",
    senderName: "Nhóm cựu sinh viên K38",
    content: "OK em, mình chờ báo giá mới nhé!",
    sentAt: "2026-04-22T15:10:00",
    isRead: false,
  },

  // ── TR-2026-001 — khách mới, staff vừa chào ────────────────────────────────
  {
    id: "cm9",
    tripRequestId: "tr1",
    sender: "staff",
    senderName: "Seller A",
    content: "Chào gia đình anh Hoàng! Em là nhân viên tư vấn của RA Travel. Em đã nhận thông tin gia đình muốn tour Đà Lạt 3 ngày vào tháng 7 ạ. Gia đình cần em tư vấn thêm điều gì không?",
    sentAt: "2026-04-20T11:00:00",
    isRead: true,
  },

  // ── TR-2026-002 — đang assigned, chưa có hội thoại nhiều ──────────────────
  {
    id: "cm10",
    tripRequestId: "tr2",
    sender: "staff",
    senderName: "Seller B",
    content: "Xin chào đại diện Công ty Minh Phát! Em là Seller B phụ trách yêu cầu tour team building Phú Quốc của công ty. Em sẽ liên hệ trong vòng 24h để trao đổi chi tiết ạ.",
    sentAt: "2026-04-21T14:00:00",
    isRead: true,
  },
  {
    id: "cm11",
    tripRequestId: "tr2",
    sender: "customer",
    senderName: "Công ty TNHH Minh Phát",
    content: "Chào em! Bên mình cần tour cho 30 người, có phòng họp và hoạt động team building ngoài trời. Ngân sách khoảng 5 triệu/người. Em có thể gửi các options không?",
    sentAt: "2026-04-21T16:45:00",
    isRead: false,
  },
];

let _counter = 12;

export const chatMockStore = {
  getByTripRequestId: (tripRequestId: string): ChatMessage[] =>
    _messages
      .filter((m) => m.tripRequestId === tripRequestId)
      .sort((a, b) => a.sentAt.localeCompare(b.sentAt)),

  getUnreadCount: (tripRequestId: string): number =>
    _messages.filter((m) => m.tripRequestId === tripRequestId && !m.isRead && m.sender === "customer").length,

  addMessage: (
    tripRequestId: string,
    data: Pick<ChatMessage, "sender" | "senderName" | "content">,
  ): ChatMessage => {
    const msg: ChatMessage = {
      id: `cm${_counter++}`,
      tripRequestId,
      ...data,
      sentAt: new Date().toISOString(),
      isRead: data.sender === "staff", // tin của staff thì tự đọc
    };
    _messages = [..._messages, msg];
    return msg;
  },

  markAllRead: (tripRequestId: string): void => {
    _messages = _messages.map((m) =>
      m.tripRequestId === tripRequestId && !m.isRead ? { ...m, isRead: true } : m,
    );
  },
};
