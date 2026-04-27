import { notificationMockStore } from "@/modules/notification/data/notification.mock-store";
import { followUpMockStore } from "@/modules/sales/tripRequest/data/follow-up.mock-store";
import type { FollowUp } from "@/modules/sales/tripRequest/types/follow-up.type";
import ActionButton from "@/shared/components/table/ActionButton/ActionButton";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { AlarmClock, CheckCircle2, Circle, Clock } from "lucide-react";
import { useState } from "react";

interface Props {
  tripRequestId: string;
  tripRequestCode: string;
  /** Không cho phép thêm mới khi trip request đã đóng */
  readonly?: boolean;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isOverdue(scheduledAt: string, status: FollowUp["status"]) {
  return status === "pending" && new Date(scheduledAt) < new Date();
}

function isDueSoon(scheduledAt: string, status: FollowUp["status"]) {
  if (status !== "pending") return false;
  const diff = new Date(scheduledAt).getTime() - Date.now();
  return diff > 0 && diff < 24 * 60 * 60 * 1000; // trong 24h tới
}

export default function FollowUpSection({ tripRequestId, tripRequestCode, readonly }: Props) {
  const { confirm } = useConfirm();

  const [items, setItems] = useState<FollowUp[]>(() => followUpMockStore.getByTripRequest(tripRequestId));
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [scheduledAt, setScheduledAt] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState("");

  const refresh = () => setItems(followUpMockStore.getByTripRequest(tripRequestId));

  // ── Thêm reminder ──
  const handleAdd = () => {
    if (!scheduledAt) {
      setFormError("Vui lòng chọn ngày & giờ nhắc.");
      return;
    }
    if (!note.trim()) {
      setFormError("Vui lòng nhập nội dung cần follow-up.");
      return;
    }

    const isNowOrPast = new Date(scheduledAt) <= new Date();

    followUpMockStore.add({
      tripRequestId,
      scheduledAt,
      note: note.trim(),
      status: "pending",
      createdBy: "Seller A", // TODO: lấy từ auth context
    });

    // Nếu thời điểm đã qua hoặc ngay bây giờ → push notification ngay
    if (isNowOrPast) {
      notificationMockStore.pushFollowUpReminder({
        tripRequestCode,
        tripRequestId,
        note: note.trim(),
      });
    }

    setScheduledAt("");
    setNote("");
    setFormError("");
    setDialogOpen(false);
    refresh();
  };

  // ── Đánh dấu done / undo ──
  const handleToggleDone = (item: FollowUp) => {
    if (item.status === "done") {
      followUpMockStore.markPending(item.id);
    } else {
      followUpMockStore.markDone(item.id);
    }
    refresh();
  };

  // ── Xóa reminder ──
  const handleDelete = async (item: FollowUp) => {
    const ok = await confirm({
      description: `Xóa nhắc nhở "${item.note.slice(0, 40)}${item.note.length > 40 ? "…" : ""}"?`,
    });
    if (!ok) return;
    followUpMockStore.delete(item.id);
    refresh();
  };

  // ── Trigger notification thủ công (giả lập "đến giờ nhắc") ──
  const handleTriggerNow = (item: FollowUp) => {
    notificationMockStore.pushFollowUpReminder({
      tripRequestCode,
      tripRequestId,
      note: item.note,
    });
  };

  const pending = items.filter((i) => i.status === "pending");
  const done = items.filter((i) => i.status === "done");

  return (
    <div className='space-y-3'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <AlarmClock className='w-4 h-4 text-orange-500' />
          <span className='font-semibold text-sm'>
            Nhắc nhở Follow-up
            {pending.length > 0 && (
              <span className='inline-flex justify-center items-center bg-orange-100 ml-2 px-1.5 rounded-full font-bold text-[11px] text-orange-600'>
                {pending.length}
              </span>
            )}
          </span>
        </div>
        {!readonly && <ActionButton action='add' text='Thêm lịch nhắc' size='sm' variant='outline' onClick={() => setDialogOpen(true)} />}
      </div>

      {/* Empty state */}
      {items.length === 0 && <p className='text-muted-foreground text-sm italic'>Chưa có lịch follow-up nào được đặt.</p>}

      {/* Pending reminders */}
      {pending.length > 0 && (
        <div className='space-y-2'>
          {pending.map((item) => {
            const overdue = isOverdue(item.scheduledAt, item.status);
            const soon = isDueSoon(item.scheduledAt, item.status);
            return (
              <div
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  overdue ? "border-red-200 bg-red-50" : soon ? "border-amber-200 bg-amber-50" : "border-border bg-muted/30"
                }`}>
                {/* Toggle done */}
                <button
                  className='mt-0.5 text-muted-foreground hover:text-primary transition-colors shrink-0'
                  onClick={() => handleToggleDone(item)}
                  title='Đánh dấu hoàn thành'>
                  <Circle className='w-4 h-4' />
                </button>

                {/* Content */}
                <div className='flex-1 min-w-0'>
                  <p className='text-sm leading-snug'>{item.note}</p>
                  <div className='flex items-center gap-1 mt-1'>
                    <Clock className={`w-3 h-3 ${overdue ? "text-red-500" : soon ? "text-amber-500" : "text-muted-foreground"}`} />
                    <span
                      className={`text-xs ${overdue ? "text-red-600 font-medium" : soon ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                      {overdue ? "Quá hạn — " : soon ? "Sắp đến — " : ""}
                      {formatDateTime(item.scheduledAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-1 shrink-0'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='w-7 h-7 text-orange-500 hover:text-orange-700'
                    title='Gửi thông báo ngay'
                    onClick={() => handleTriggerNow(item)}>
                    <AlarmClock className='w-3.5 h-3.5' />
                  </Button>
                  {!readonly && <ActionButton action='delete' size='icon-xs' variant='ghost' onClick={() => handleDelete(item)} />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Done reminders — collapsed style */}
      {done.length > 0 && (
        <div className='space-y-1.5 opacity-60'>
          <p className='text-muted-foreground text-xs'>Đã hoàn thành ({done.length})</p>
          {done.map((item) => (
            <div key={item.id} className='flex items-start gap-3 bg-muted/20 p-2.5 border border-border rounded-lg'>
              <button
                className='mt-0.5 text-green-500 hover:text-muted-foreground transition-colors shrink-0'
                onClick={() => handleToggleDone(item)}
                title='Bỏ đánh dấu hoàn thành'>
                <CheckCircle2 className='w-4 h-4' />
              </button>
              <div className='flex-1 min-w-0'>
                <p className='text-muted-foreground text-sm line-through leading-snug'>{item.note}</p>
                <span className='text-muted-foreground text-xs'>{formatDateTime(item.scheduledAt)}</span>
              </div>
              {!readonly && <ActionButton action='delete' size='icon-xs' variant='ghost' onClick={() => handleDelete(item)} />}
            </div>
          ))}
        </div>
      )}

      {/* ── Dialog thêm lịch nhắc ── */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) {
            setScheduledAt("");
            setNote("");
            setFormError("");
          }
        }}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <AlarmClock className='w-4 h-4 text-orange-500' />
              Đặt lịch Follow-up
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <Field>
              <FieldLabel>
                Ngày & giờ nhắc <span className='text-red-500'>*</span>
              </FieldLabel>
              <Input
                type='datetime-local'
                value={scheduledAt}
                onChange={(e) => {
                  setScheduledAt(e.target.value);
                  setFormError("");
                }}
              />
            </Field>

            <Field>
              <FieldLabel>
                Nội dung / Việc cần làm <span className='text-red-500'>*</span>
              </FieldLabel>
              <Textarea
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setFormError("");
                }}
                placeholder='VD: Gọi lại xác nhận báo giá, gửi itinerary qua Zalo...'
                rows={3}
              />
            </Field>

            {formError && <p className='text-red-500 text-xs'>{formError}</p>}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAdd} disabled={!scheduledAt || !note.trim()}>
              <AlarmClock className='mr-2 w-4 h-4' />
              Lưu lịch nhắc
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
