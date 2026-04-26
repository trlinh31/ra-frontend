import { PATHS } from "@/app/routes/route.constant";
import { NOTIFICATION_TYPE_ICON_COLOR } from "@/modules/notification/constants/notification.constant";
import { notificationMockStore } from "@/modules/notification/data/notification.mock-store";
import type { Notification, NotificationType } from "@/modules/notification/types/notification.type";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar";
import { APP_NAME } from "@/shared/constants/app.constant";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useCurrentRoute } from "@/shared/hooks/useCurrentRoute";
import { AppSidebar } from "@/shared/layouts/components/Sidebar";
import { cn } from "@/shared/lib/utils";
import { AlertCircle, Bell, CheckCheck, CheckCircle, Info, LogOut, UserPen, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// ─── Icon theo loại thông báo ─────────────────────────────────────────────────
const TYPE_ICON: Record<NotificationType, React.ReactNode> = {
  info: <Info className='w-4 h-4' />,
  success: <CheckCircle className='w-4 h-4' />,
  warning: <AlertCircle className='w-4 h-4' />,
  error: <XCircle className='w-4 h-4' />,
};

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

// ─── Notification Bell ─────────────────────────────────────────────────────────
function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);

  const refresh = () => {
    setRecent(notificationMockStore.getRecent(5));
    setUnread(notificationMockStore.getUnreadCount());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleItemClick = (n: Notification) => {
    notificationMockStore.markAsRead(n.id);
    refresh();
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const handleMarkAllRead = () => {
    notificationMockStore.markAllAsRead();
    refresh();
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate(PATHS.NOTIFICATIONS.ROOT);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) refresh();
      }}>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='icon' className='relative w-9 h-9'>
          <Bell className='w-5 h-5' />
          {unread > 0 && (
            <span className='-top-0.5 -right-0.5 absolute flex justify-center items-center bg-red-500 rounded-full w-4 h-4 font-bold text-[10px] text-white leading-none'>
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align='end' sideOffset={8} className='gap-0 p-0 w-96'>
        {/* Header popover */}
        <div className='flex justify-between items-center px-4 py-3 border-b'>
          <div className='flex items-center gap-2'>
            <span className='font-semibold text-sm'>Thông báo</span>
            {unread > 0 && (
              <span className='flex justify-center items-center bg-primary px-1.5 rounded-full min-w-5 h-5 font-bold text-[11px] text-primary-foreground'>
                {unread}
              </span>
            )}
          </div>
          {unread > 0 && (
            <Button variant='ghost' size='sm' className='gap-1 h-7 text-muted-foreground hover:text-foreground text-xs' onClick={handleMarkAllRead}>
              <CheckCheck className='w-3.5 h-3.5' />
              Đọc tất cả
            </Button>
          )}
        </div>

        {/* Danh sách */}
        <div className='divide-y max-h-[360px] overflow-y-auto'>
          {recent.length === 0 ? (
            <div className='flex flex-col items-center gap-2 py-10 text-muted-foreground'>
              <Bell className='opacity-30 w-8 h-8' />
              <p className='text-xs'>Không có thông báo mới</p>
            </div>
          ) : (
            recent.map((n) => (
              <button
                key={n.id}
                type='button'
                className={cn("flex items-start gap-3 hover:bg-accent px-4 py-3 w-full text-left transition-colors", !n.isRead && "bg-primary/5")}
                onClick={() => handleItemClick(n)}>
                <div className={cn("mt-0.5 shrink-0", NOTIFICATION_TYPE_ICON_COLOR[n.type])}>{TYPE_ICON[n.type]}</div>
                <div className='flex-1 space-y-0.5 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <p className={cn("flex-1 font-medium text-sm truncate", !n.isRead ? "text-foreground" : "text-muted-foreground")}>{n.title}</p>
                    {!n.isRead && <span className='bg-primary rounded-full w-2 h-2 shrink-0' />}
                  </div>
                  <p className='text-muted-foreground text-xs line-clamp-2'>{n.message}</p>
                  <p className='text-[11px] text-muted-foreground/70'>{formatTimeAgo(n.createdAt)}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className='px-4 py-2.5 border-t'>
          <Button variant='ghost' className='w-full h-8 text-primary hover:text-primary text-sm' onClick={handleViewAll}>
            Xem tất cả thông báo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── User Dropdown ─────────────────────────────────────────────────────────────
function UserDropdown() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const user = session?.user;

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .slice(-2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : (user.username?.slice(0, 2).toUpperCase() ?? "?");

  const handleEditProfile = () => {
    // Điều hướng sang trang edit của user hiện tại nếu có id
    if (user.id) {
      navigate(PATHS.USER_MANAGEMENT.USER_EDIT.replace(":id", user.id));
    }
  };

  const handleLogout = () => {
    logout();
    navigate(PATHS.AUTH.LOGIN, { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex items-center gap-2 hover:bg-accent px-2 h-9'>
          {/* Avatar */}
          <div className='flex justify-center items-center bg-primary rounded-full w-7 h-7 font-semibold text-primary-foreground text-xs shrink-0'>
            {user.avatar ? <img src={user.avatar} alt={user.name} className='rounded-full w-full h-full object-cover' /> : initials}
          </div>
          <div className='hidden sm:flex flex-col items-start leading-tight'>
            <span className='max-w-[120px] font-medium text-sm truncate'>{user.name || user.username}</span>
            <span className='max-w-[120px] text-muted-foreground text-xs truncate'>{user.role}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel className='pb-2 font-normal'>
          <div className='flex flex-col gap-0.5'>
            <p className='font-medium text-foreground text-sm'>{user.name || user.username}</p>
            <p className='text-muted-foreground text-xs truncate'>{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEditProfile} className='gap-2 cursor-pointer'>
          <UserPen className='w-4 h-4' />
          Chỉnh sửa thông tin
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} variant='destructive' className='gap-2 cursor-pointer'>
          <LogOut className='w-4 h-4' />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Layout chính ──────────────────────────────────────────────────────────────
export default function DashboardLayout() {
  const currentRoute = useCurrentRoute();

  useEffect(() => {
    document.title = currentRoute?.pageTitle ? `${currentRoute.pageTitle} | ${APP_NAME}` : APP_NAME;
  }, [currentRoute]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='min-w-0 overflow-x-hidden'>
        <header className='top-0 z-10 sticky flex justify-between items-center gap-2 bg-background px-4 border-b h-16 shrink-0'>
          <SidebarTrigger className='-ml-1' />

          {/* Right side actions */}
          <div className='flex items-center gap-1'>
            <NotificationBell />
            <UserDropdown />
          </div>
        </header>

        <div className='flex flex-col flex-1 gap-4 p-4'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
