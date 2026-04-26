import { NOTIFICATION_TYPE_BADGE, NOTIFICATION_TYPE_ICON_COLOR, NOTIFICATION_TYPE_LABEL, NOTIFICATION_TYPE_OPTIONS } from "@/modules/notification/constants/notification.constant";
import { notificationMockStore } from "@/modules/notification/data/notification.mock-store";
import type { Notification, NotificationType } from "@/modules/notification/types/notification.type";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { AlertCircle, Bell, CheckCheck, CheckCircle, Info, Trash2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const TYPE_ICON: Record<NotificationType, React.ReactNode> = {
  info: <Info className='w-4 h-4' />,
  success: <CheckCircle className='w-4 h-4' />,
  warning: <AlertCircle className='w-4 h-4' />,
  error: <XCircle className='w-4 h-4' />,
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const DEFAULT_FILTERS = {
  search: "",
  type: "" as NotificationType | "",
  isRead: "" as "read" | "unread" | "",
};

export default function NotificationListPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(() => notificationMockStore.getAll());
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const refresh = () => setNotifications(notificationMockStore.getAll());

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const q = filters.search.toLowerCase();
      if (q && !n.title.toLowerCase().includes(q) && !n.message.toLowerCase().includes(q)) return false;
      if (filters.type && n.type !== filters.type) return false;
      if (filters.isRead === "read" && !n.isRead) return false;
      if (filters.isRead === "unread" && n.isRead) return false;
      return true;
    });
  }, [notifications, filters]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = (n: Notification) => {
    notificationMockStore.markAsRead(n.id);
    refresh();
    if (n.link) navigate(n.link);
  };

  const handleMarkAllRead = () => {
    notificationMockStore.markAllAsRead();
    refresh();
  };

  const handleDelete = (id: string) => {
    notificationMockStore.delete(id);
    refresh();
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex justify-center items-center bg-primary/10 rounded-lg w-10 h-10'>
            <Bell className='w-5 h-5 text-primary' />
          </div>
          <div>
            <h1 className='font-semibold text-lg'>Thông báo hệ thống</h1>
            <p className='text-muted-foreground text-sm'>
              {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : "Tất cả đã được đọc"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant='outline' size='sm' onClick={handleMarkAllRead} className='gap-1.5'>
            <CheckCheck className='w-4 h-4' />
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {/* Bộ lọc */}
      <div className='flex flex-wrap gap-3'>
        <Input
          className='w-72'
          placeholder='Tìm theo tiêu đề, nội dung...'
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
        <Select value={filters.type || "all"} onValueChange={(v) => setFilters((f) => ({ ...f, type: v === "all" ? "" : (v as NotificationType) }))}>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='Tất cả loại' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả loại</SelectItem>
            {NOTIFICATION_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.isRead || "all"} onValueChange={(v) => setFilters((f) => ({ ...f, isRead: v === "all" ? "" : (v as "read" | "unread") }))}>
          <SelectTrigger className='w-44'>
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả</SelectItem>
            <SelectItem value='unread'>Chưa đọc</SelectItem>
            <SelectItem value='read'>Đã đọc</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Danh sách thông báo */}
      <div className='space-y-2'>
        {filtered.length === 0 ? (
          <div className='flex flex-col items-center gap-3 py-16 text-muted-foreground'>
            <Bell className='w-10 h-10 opacity-30' />
            <p className='text-sm'>Không có thông báo nào</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={cn(
                "group flex items-start gap-4 rounded-lg border p-4 transition-colors",
                n.isRead ? "bg-background" : "bg-primary/5 border-primary/20",
              )}
            >
              {/* Icon type */}
              <div className={cn("mt-0.5 shrink-0", NOTIFICATION_TYPE_ICON_COLOR[n.type])}>
                {TYPE_ICON[n.type]}
              </div>

              {/* Content */}
              <div className='flex-1 min-w-0 space-y-1'>
                <div className='flex flex-wrap items-center gap-2'>
                  <span className={cn("font-medium text-sm", !n.isRead && "text-foreground")}>{n.title}</span>
                  <Badge className={cn("text-xs px-1.5 py-0 h-5", NOTIFICATION_TYPE_BADGE[n.type])}>
                    {NOTIFICATION_TYPE_LABEL[n.type]}
                  </Badge>
                  {!n.isRead && (
                    <span className='inline-block w-2 h-2 rounded-full bg-primary' />
                  )}
                </div>
                <p className='text-muted-foreground text-sm line-clamp-2'>{n.message}</p>
                <p className='text-muted-foreground text-xs'>{formatDate(n.createdAt)}</p>
              </div>

              {/* Actions */}
              <div className='flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'>
                {!n.isRead && (
                  <Button
                    variant='ghost'
                    size='icon'
                    className='w-8 h-8 text-primary hover:text-primary'
                    title='Đánh dấu đã đọc'
                    onClick={() => handleMarkRead(n)}
                  >
                    <CheckCircle className='w-4 h-4' />
                  </Button>
                )}
                {n.link && n.isRead && (
                  <Button
                    variant='ghost'
                    size='icon'
                    className='w-8 h-8'
                    title='Xem chi tiết'
                    onClick={() => navigate(n.link!)}
                  >
                    <Info className='w-4 h-4' />
                  </Button>
                )}
                <Button
                  variant='ghost'
                  size='icon'
                  className='w-8 h-8 text-destructive hover:text-destructive'
                  title='Xóa thông báo'
                  onClick={() => handleDelete(n.id)}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
