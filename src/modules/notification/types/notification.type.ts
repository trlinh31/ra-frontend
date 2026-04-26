export type NotificationType = "info" | "success" | "warning" | "error";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  /** Route để navigate khi click vào thông báo (tùy chọn) */
  link?: string;
};
