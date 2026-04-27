import type { Notification } from "@/modules/notification/types/notification.type";

let _notifications: Notification[] = [
  {
    id: "n1",
    title: "Báo giá mới được tạo",
    message: "Báo giá BG-2026-0042 cho khách hàng Nguyễn Văn A vừa được tạo và chờ phê duyệt.",
    type: "info",
    isRead: false,
    createdAt: "2026-04-26T08:30:00",
    link: "/sales/quotations",
  },
  {
    id: "n2",
    title: "Trip Request được xác nhận",
    message: "Trip Request TR-2026-0018 đã được phê duyệt và chuyển sang giai đoạn báo giá.",
    type: "success",
    isRead: false,
    createdAt: "2026-04-26T07:15:00",
    link: "/sales/trip-requests",
  },
  {
    id: "n3",
    title: "Thanh toán sắp đến hạn",
    message: "Phiếu thu khách hàng PT-2026-0031 sẽ đến hạn thanh toán trong 2 ngày tới.",
    type: "warning",
    isRead: false,
    createdAt: "2026-04-25T16:45:00",
    link: "/accounting/customer-payments",
  },
  {
    id: "n4",
    title: "Tour xác nhận thành công",
    message: "Tour TC-2026-0007 (Đà Nẵng – Hội An 4N3Đ) đã được xác nhận đầy đủ thông tin.",
    type: "success",
    isRead: true,
    createdAt: "2026-04-25T14:00:00",
    link: "/sales/confirmed-tours",
  },
  {
    id: "n5",
    title: "Lỗi đồng bộ dữ liệu chuyến bay",
    message: "Không thể đồng bộ thông tin chuyến bay VN-234 ngày 28/04/2026. Vui lòng kiểm tra lại.",
    type: "error",
    isRead: false,
    createdAt: "2026-04-25T11:20:00",
    link: "/master-data/flights",
  },
  {
    id: "n6",
    title: "Người dùng mới được thêm vào hệ thống",
    message: "Tài khoản seller-d@ratravel.vn vừa được tạo với vai trò Nhân viên kinh doanh.",
    type: "info",
    isRead: true,
    createdAt: "2026-04-24T09:00:00",
    link: "/users",
  },
  {
    id: "n7",
    title: "Cập nhật giá khách sạn",
    message: "Bảng giá Khách sạn Vinpearl Nha Trang đã được cập nhật cho kỳ hè 2026.",
    type: "info",
    isRead: true,
    createdAt: "2026-04-23T15:30:00",
    link: "/master-data/hotel",
  },
  {
    id: "n8",
    title: "Phiếu chi được duyệt",
    message: "Phiếu chi nhà cung cấp PC-2026-0015 đã được kế toán trưởng phê duyệt.",
    type: "success",
    isRead: true,
    createdAt: "2026-04-23T10:15:00",
    link: "/accounting/vendor-payments",
  },
  {
    id: "n9",
    title: "Cảnh báo: Tài khoản đăng nhập bất thường",
    message: "Phát hiện đăng nhập từ địa chỉ IP lạ vào tài khoản admin@ratravel.vn lúc 02:30.",
    type: "warning",
    isRead: false,
    createdAt: "2026-04-22T08:00:00",
  },
  {
    id: "n10",
    title: "Nhà cung cấp hết hợp đồng",
    message: "Hợp đồng với nhà cung cấp 'Xe Hùng Mạnh' sẽ hết hạn vào ngày 01/05/2026.",
    type: "warning",
    isRead: true,
    createdAt: "2026-04-21T13:00:00",
    link: "/master-data/supplier",
  },
  {
    id: "n11",
    title: "Hướng dẫn viên nghỉ phép",
    message: "HDV Trần Minh Tuấn xin nghỉ phép từ 01/05 đến 07/05/2026. Cần sắp xếp người thay thế.",
    type: "warning",
    isRead: true,
    createdAt: "2026-04-20T09:30:00",
    link: "/master-data/tour-guide",
  },
  {
    id: "n12",
    title: "Lỗi xuất báo cáo",
    message: "Không thể xuất báo cáo doanh thu tháng 3/2026. Vui lòng thử lại sau.",
    type: "error",
    isRead: true,
    createdAt: "2026-04-19T17:00:00",
  },
];

let _nextId = 13;

export const notificationMockStore = {
  getAll: (): Notification[] => [..._notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  getRecent: (limit = 5): Notification[] =>
    [..._notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit),

  getUnreadCount: (): number => _notifications.filter((n) => !n.isRead).length,

  markAsRead: (id: string): void => {
    _notifications = _notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  },

  markAllAsRead: (): void => {
    _notifications = _notifications.map((n) => ({ ...n, isRead: true }));
  },

  delete: (id: string): void => {
    _notifications = _notifications.filter((n) => n.id !== id);
  },

  /** Tạo thông báo nhắc follow-up cho một Trip Request */
  pushFollowUpReminder: (params: { tripRequestCode: string; tripRequestId: string; note: string }): void => {
    const newNotif: Notification = {
      id: `n${_nextId++}`,
      title: `Nhắc follow-up: ${params.tripRequestCode}`,
      message: params.note || `Đã đến giờ follow-up Trip Request ${params.tripRequestCode}.`,
      type: "warning",
      isRead: false,
      createdAt: new Date().toISOString(),
      link: `/sales/trip-requests/${params.tripRequestId}`,
    };
    _notifications = [newNotif, ..._notifications];
  },
};
