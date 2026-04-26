import { chatMockStore } from "@/modules/sales/tripRequest/data/chat.mock-store";
import type { ChatMessage } from "@/modules/sales/tripRequest/types/chat.type";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useAuth } from "@/shared/contexts/AuthContext";
import { cn } from "@/shared/lib/utils";
import { CheckCheck, ChevronDown, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Quick reply templates ────────────────────────────────────────────────────
const QUICK_REPLIES = [
  "Cảm ơn anh/chị đã liên hệ! Em sẽ phản hồi sớm nhất có thể.",
  "Em đã ghi nhận yêu cầu, sẽ gửi báo giá trong hôm nay ạ.",
  "Anh/chị có thể cho em biết thêm về số lượng người và ngân sách không?",
  "Em sẽ điều chỉnh lại lịch trình và gửi phiên bản cập nhật nhé!",
  "Mọi thay đổi đã được ghi nhận. Anh/chị xem lại và phản hồi giúp em nhé.",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);

  const time = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 0) return time;
  if (diffDays === 1) return `Hôm qua ${time}`;
  if (diffDays < 7) return `${d.toLocaleDateString("vi-VN", { weekday: "short" })} ${time}`;
  return `${d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })} ${time}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Bubble ───────────────────────────────────────────────────────────────────
function MessageBubble({
  msg,
  showName,
}: {
  msg: ChatMessage;
  showName: boolean;
}) {
  const isStaff = msg.sender === "staff";
  const initials = getInitials(msg.senderName);

  return (
    <div className={cn("flex items-end gap-2 max-w-[82%]", isStaff ? "ml-auto flex-row-reverse" : "mr-auto")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-semibold shrink-0 mb-0.5",
          isStaff
            ? "bg-primary text-primary-foreground"
            : "bg-muted-foreground/20 text-muted-foreground",
        )}
      >
        {initials}
      </div>

      <div className={cn("flex flex-col gap-0.5", isStaff ? "items-end" : "items-start")}>
        {showName && (
          <span className='text-muted-foreground text-[11px] px-1'>{msg.senderName}</span>
        )}
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap",
            isStaff
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm bg-muted text-foreground",
          )}
        >
          {msg.content}
        </div>
        <div className={cn("flex items-center gap-1 text-[10px] text-muted-foreground px-1", isStaff && "flex-row-reverse")}>
          <span>{formatTime(msg.sentAt)}</span>
          {isStaff && msg.isRead && <CheckCheck className='w-3 h-3 text-blue-400' />}
        </div>
      </div>
    </div>
  );
}

// ─── Ngăn cách ngày ───────────────────────────────────────────────────────────
function DateSeparator({ date }: { date: string }) {
  const d = new Date(date);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - d.getTime()) / 86400000);
  const label =
    diffDays === 0
      ? "Hôm nay"
      : diffDays === 1
        ? "Hôm qua"
        : d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div className='flex items-center gap-2 py-1'>
      <div className='flex-1 h-px bg-border' />
      <span className='text-[11px] text-muted-foreground shrink-0'>{label}</span>
      <div className='flex-1 h-px bg-border' />
    </div>
  );
}

// ─── ChatPanel ────────────────────────────────────────────────────────────────
interface ChatPanelProps {
  tripRequestId: string;
  customerName: string;
}

export default function ChatPanel({ tripRequestId, customerName }: ChatPanelProps) {
  const { session } = useAuth();
  const staffName = session?.user?.name ?? "Nhân viên";

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    chatMockStore.markAllRead(tripRequestId);
    return chatMockStore.getByTripRequestId(tripRequestId);
  });
  const [draft, setDraft] = useState("");
  const [quickOpen, setQuickOpen] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll xuống cuối khi load lần đầu
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  // Theo dõi scroll để hiện nút cuộn xuống
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 120);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const refresh = () => setMessages(chatMockStore.getByTripRequestId(tripRequestId));

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    chatMockStore.addMessage(tripRequestId, {
      sender: "staff",
      senderName: staffName,
      content: text,
    });
    setDraft("");
    refresh();
    // Đợi render xong rồi scroll
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (text: string) => {
    setDraft(text);
    setQuickOpen(false);
    textareaRef.current?.focus();
  };

  // Nhóm messages theo ngày và tên liên tiếp
  const grouped = messages.reduce<{ msg: ChatMessage; showDate: boolean; showName: boolean }[]>(
    (acc, msg, i) => {
      const prev = messages[i - 1];

      const showDate =
        !prev ||
        new Date(msg.sentAt).toDateString() !== new Date(prev.sentAt).toDateString();

      const showName =
        showDate ||
        !prev ||
        prev.sender !== msg.sender ||
        new Date(msg.sentAt).getTime() - new Date(prev.sentAt).getTime() > 5 * 60 * 1000;

      acc.push({ msg, showDate, showName });
      return acc;
    },
    [],
  );

  return (
    <div className='flex flex-col h-[500px]'>
      {/* ── Vùng tin nhắn ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className='relative flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-muted/20'
      >
        {messages.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full gap-2 text-muted-foreground'>
            <p className='text-sm'>Chưa có tin nhắn nào.</p>
            <p className='text-xs'>Gửi lời chào để bắt đầu hội thoại với khách!</p>
          </div>
        ) : (
          grouped.map(({ msg, showDate, showName }) => (
            <div key={msg.id}>
              {showDate && <DateSeparator date={msg.sentAt} />}
              <MessageBubble msg={msg} showName={showName} />
            </div>
          ))
        )}
        <div ref={bottomRef} />

        {/* Nút scroll xuống */}
        {showScrollBtn && (
          <button
            type='button'
            onClick={scrollToBottom}
            className='sticky bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background border shadow-md rounded-full px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors'
          >
            <ChevronDown className='w-3.5 h-3.5' />
            Tin mới nhất
          </button>
        )}
      </div>

      {/* ── Input area ── */}
      <div className='border-t bg-background'>
        {/* Quick replies */}
        {quickOpen && (
          <div className='border-b px-3 py-2 flex flex-wrap gap-1.5'>
            {QUICK_REPLIES.map((text) => (
              <button
                key={text}
                type='button'
                onClick={() => handleQuickReply(text)}
                className='text-left text-xs bg-muted hover:bg-muted/70 rounded-full px-3 py-1.5 line-clamp-1 max-w-xs transition-colors'
              >
                {text}
              </button>
            ))}
          </div>
        )}

        <div className='flex items-end gap-2 px-3 py-2.5'>
          {/* Quick reply toggle */}
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground'
            title='Trả lời nhanh'
            onClick={() => setQuickOpen((o) => !o)}
          >
            <span className='text-base leading-none'>⚡</span>
          </Button>

          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Nhắn tin tới ${customerName}… (Enter để gửi, Shift+Enter xuống dòng)`}
            className='flex-1 min-h-[38px] max-h-32 resize-none text-sm py-2 leading-snug'
            rows={1}
          />

          {/* Gửi */}
          <Button
            type='button'
            size='icon'
            className='h-8 w-8 shrink-0'
            disabled={!draft.trim()}
            onClick={handleSend}
          >
            <Send className='w-4 h-4' />
          </Button>
        </div>

        <p className='pb-2 text-center text-muted-foreground/50 text-[10px]'>
          Tin nhắn nội bộ — chỉ nhân viên RA Travel gửi, chưa tích hợp gửi thật
        </p>
      </div>
    </div>
  );
}
