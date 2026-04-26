export type ChatSender = "staff" | "customer";

export type ChatMessage = {
  id: string;
  tripRequestId: string;
  /** "staff" = nhân viên nội bộ, "customer" = khách hàng */
  sender: ChatSender;
  senderName: string;
  content: string;
  sentAt: string; // ISO datetime
  isRead: boolean;
};
