import type { NotificationType } from "@/modules/notification/types/notification.type";

export const NOTIFICATION_TYPE_LABEL: Record<NotificationType, string> = {
  info: "Thông tin",
  success: "Thành công",
  warning: "Cảnh báo",
  error: "Lỗi",
};

export const NOTIFICATION_TYPE_BADGE: Record<NotificationType, string> = {
  info: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
};

export const NOTIFICATION_TYPE_ICON_COLOR: Record<NotificationType, string> = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-amber-500",
  error: "text-red-500",
};

export const NOTIFICATION_TYPE_OPTIONS: { label: string; value: NotificationType }[] = [
  { value: "info", label: "Thông tin" },
  { value: "success", label: "Thành công" },
  { value: "warning", label: "Cảnh báo" },
  { value: "error", label: "Lỗi" },
];
