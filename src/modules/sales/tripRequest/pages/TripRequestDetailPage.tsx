import { PATHS } from "@/app/routes/route.constant";
import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
import ChatPanel from "@/modules/sales/tripRequest/components/ChatPanel";
import TripRequestStatusBadge from "@/modules/sales/tripRequest/components/TripRequestStatusBadge";
import { LEAD_SOURCE_LABEL, LOST_REASON_OPTIONS, SELLER_OPTIONS } from "@/modules/sales/tripRequest/constants/trip-request.constant";
import { chatMockStore } from "@/modules/sales/tripRequest/data/chat.mock-store";
import { tripRequestMockStore } from "@/modules/sales/tripRequest/data/trip-request.mock-store";
import type { TripRequest } from "@/modules/sales/tripRequest/types/trip-request.type";
import { userMockStore } from "@/modules/userManagement/data/user.mock-store";
import PageHeader from "@/shared/components/common/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  HandHelping,
  Info,
  MapPin,
  MessageSquare,
  MessagesSquare,
  PauseCircle,
  PhoneCall,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function formatDate(iso?: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-0.5'>
      <span className='text-muted-foreground text-xs'>{label}</span>
      <span className='font-medium text-sm'>{value ?? <span className='text-muted-foreground italic'>—</span>}</span>
    </div>
  );
}

export default function TripRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [tr, setTr] = useState<TripRequest | undefined>(() => (id ? tripRequestMockStore.getById(id) : undefined));

  // Dialog states
  const [assignDialog, setAssignDialog] = useState(false);
  const [assignSeller, setAssignSeller] = useState("");
  const [lostDialog, setLostDialog] = useState(false);
  const [lostReason, setLostReason] = useState("");
  const [holdDialog, setHoldDialog] = useState(false);
  const [holdUntil, setHoldUntil] = useState("");
  const [holdNote, setHoldNote] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(tr?.internalNotes ?? "");

  const refresh = () => {
    const updated = id ? tripRequestMockStore.getById(id) : undefined;
    setTr(updated);
    setNotesValue(updated?.internalNotes ?? "");
  };

  if (!tr) {
    return (
      <div className='space-y-4'>
        <p className='text-muted-foreground'>Không tìm thấy Trip Request.</p>
        <Button variant='outline' onClick={() => navigate(PATHS.SALES.TRIP_REQUESTS)}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const linkedQuotations = tr.quotationIds.map((qid) => quotationMockStore.getById(qid)).filter(Boolean);

  // ── Action handlers ──
  const handleAssign = () => {
    if (!assignSeller) return;
    tripRequestMockStore.assign(tr.id, assignSeller);
    setAssignDialog(false);
    setAssignSeller("");
    refresh();
  };

  const handleStartProgress = async () => {
    const ok = await confirm({ description: `Chuyển "${tr.code}" sang trạng thái Đang xử lý?` });
    if (!ok) return;
    tripRequestMockStore.startProgress(tr.id);
    refresh();
  };

  const handleLost = () => {
    if (!lostReason) return;
    tripRequestMockStore.markLost(tr.id, lostReason);
    setLostDialog(false);
    setLostReason("");
    refresh();
  };

  const handleOnHold = () => {
    if (!holdUntil) return;
    tripRequestMockStore.markOnHold(tr.id, holdUntil, holdNote || undefined);
    setHoldDialog(false);
    setHoldUntil("");
    setHoldNote("");
    refresh();
  };

  const handleResume = async () => {
    const ok = await confirm({ description: `Tiếp tục xử lý Trip Request "${tr.code}"?` });
    if (!ok) return;
    tripRequestMockStore.startProgress(tr.id);
    refresh();
  };

  const handleSaveNotes = () => {
    tripRequestMockStore.updateNotes(tr.id, notesValue);
    setEditingNotes(false);
    refresh();
  };

  const handleCreateQuotation = () => {
    navigate(`${PATHS.SALES.QUOTATION_CREATE}?tripRequestId=${tr.id}`);
  };

  const isClosed = tr.status === "converted" || tr.status === "lost";
  const canCreateQuotation = tr.status === "in_progress";
  const canMarkLost = ["assigned", "in_progress", "on_hold"].includes(tr.status);
  const canMarkOnHold = ["assigned", "in_progress"].includes(tr.status);

  return (
    <div className='space-y-6'>
      <PageHeader title={`Trip Request ${tr.code}`} description={`Tạo bởi ${tr.createdBy} — ${formatDate(tr.createdAt)}`} />

      {/* ── Trạng thái + hành động ── */}
      <Card>
        <CardHeader>
          <div className='flex flex-wrap justify-between items-center gap-3'>
            <div className='flex items-center gap-3'>
              <CardTitle className='text-base'>Trạng thái</CardTitle>
              <TripRequestStatusBadge status={tr.status} />
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              {/* Assign */}
              {tr.status === "new" && (
                <Button size='sm' variant='outline' onClick={() => setAssignDialog(true)}>
                  <HandHelping className='mr-2 w-4 h-4' />
                  Phân công Seller
                </Button>
              )}

              {/* Bắt đầu xử lý */}
              {tr.status === "assigned" && (
                <Button size='sm' variant='outline' onClick={handleStartProgress}>
                  <ArrowRight className='mr-2 w-4 h-4' />
                  Bắt đầu xử lý
                </Button>
              )}

              {/* Tạo Báo giá */}
              {canCreateQuotation && (
                <Button size='sm' onClick={handleCreateQuotation}>
                  <FileText className='mr-2 w-4 h-4' />
                  Tạo Báo giá
                </Button>
              )}

              {/* Tiếp tục (từ on_hold) */}
              {tr.status === "on_hold" && (
                <Button size='sm' variant='outline' onClick={handleResume}>
                  <ArrowRight className='mr-2 w-4 h-4' />
                  Tiếp tục xử lý
                </Button>
              )}

              {/* Tạm hoãn */}
              {canMarkOnHold && (
                <Button size='sm' variant='outline' onClick={() => setHoldDialog(true)}>
                  <PauseCircle className='mr-2 w-4 h-4' />
                  Tạm hoãn
                </Button>
              )}

              {/* Mất lead */}
              {canMarkLost && (
                <Button size='sm' variant='outline' className='hover:bg-red-50 border-red-300 text-red-600' onClick={() => setLostDialog(true)}>
                  <XCircle className='mr-2 w-4 h-4' />
                  Mất lead
                </Button>
              )}

              {/* Xem ConfirmedTour khi converted */}
              {tr.status === "converted" && tr.confirmedTourId && (
                <Button
                  size='sm'
                  variant='outline'
                  className='border-green-300 text-green-700'
                  onClick={() => navigate(PATHS.SALES.CONFIRMED_TOUR_DETAIL.replace(":id", tr.confirmedTourId!))}>
                  <CheckCircle2 className='mr-2 w-4 h-4' />
                  Xem Tour Xác Nhận
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ── On Hold info ── */}
      {tr.status === "on_hold" && tr.holdUntil && (
        <div className='flex items-center gap-2 bg-purple-50 p-3 border border-purple-200 rounded-md text-purple-800 text-sm'>
          <PauseCircle className='w-4 h-4 shrink-0' />
          <span>
            Tạm hoãn — Hẹn liên hệ lại vào ngày <strong>{formatDate(tr.holdUntil)}</strong>
          </span>
        </div>
      )}

      {/* ── Main grid ── */}
      <div className='gap-6 grid grid-cols-1 md:grid-cols-2'>
        {/* Thông tin khách hàng */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <PhoneCall className='w-4 h-4 text-blue-500' />
              Thông tin khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <InfoRow label='Tên khách / Đoàn' value={tr.customerName} />
            <InfoRow label='Số điện thoại' value={tr.customerPhone} />
            <InfoRow label='Email' value={tr.customerEmail} />
            <InfoRow label='Nguồn lead' value={LEAD_SOURCE_LABEL[tr.leadSource]} />
            <InfoRow
              label='Phụ trách'
              value={
                tr.assignedTo ? (
                  (userMockStore.getById(tr.assignedTo)?.fullName ?? tr.assignedTo)
                ) : (
                  <span className='text-amber-600 text-xs italic'>Chưa phân công</span>
                )
              }
            />
          </CardContent>
        </Card>

        {/* Nhu cầu chuyến đi */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <MapPin className='w-4 h-4 text-indigo-500' />
              Nhu cầu chuyến đi
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <InfoRow label='Điểm đến' value={tr.destination} />
            <InfoRow label='Ngày đi dự kiến' value={formatDate(tr.departureDateEst)} />
            <InfoRow label='Số ngày dự kiến' value={tr.durationDays ? `${tr.durationDays} ngày` : undefined} />
            <InfoRow
              label='Số khách'
              value={
                <div className='flex items-center gap-1'>
                  <Users className='w-3.5 h-3.5 text-muted-foreground' />
                  {tr.numberOfAdults} người lớn
                  {tr.numberOfChildren > 0 && ` + ${tr.numberOfChildren} trẻ em`}
                </div>
              }
            />
            {tr.budgetEstimate && (
              <InfoRow label='Ngân sách tham khảo' value={`${formatNumberVN(tr.budgetEstimate)} ${tr.budgetCurrency ?? "VND"}`} />
            )}
            {tr.suggestedTourName && (
              <>
                <Separator />
                <InfoRow label='Tour mẫu gợi ý' value={tr.suggestedTourName} />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Yêu cầu đặc biệt */}
      {tr.specialRequirements && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Info className='w-4 h-4 text-amber-500' />
              Yêu cầu đặc biệt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm whitespace-pre-wrap'>{tr.specialRequirements}</p>
          </CardContent>
        </Card>
      )}

      {/* Báo giá liên kết */}
      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle className='flex items-center gap-2 text-base'>
              <FileText className='w-4 h-4 text-blue-500' />
              Báo giá liên kết
            </CardTitle>
            {canCreateQuotation && (
              <Button size='sm' variant='outline' onClick={handleCreateQuotation}>
                + Tạo Báo giá mới
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {linkedQuotations.length === 0 ? (
            <p className='text-muted-foreground text-sm italic'>Chưa có báo giá nào được tạo từ trip request này.</p>
          ) : (
            <div className='space-y-2'>
              {linkedQuotations.map((q) => {
                if (!q) return null;
                return (
                  <div
                    key={q.id}
                    className='flex justify-between items-center hover:bg-muted/40 p-2.5 border rounded-md transition-colors cursor-pointer'
                    onClick={() => navigate(PATHS.SALES.QUOTATION_DETAIL.replace(":id", q.id))}>
                    <div>
                      <p className='font-medium text-sm'>{q.code}</p>
                      <p className='text-muted-foreground text-xs'>
                        v{q.currentVersion} · {q.status}
                      </p>
                    </div>
                    <ArrowRight className='w-4 h-4 text-muted-foreground' />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ghi chú nội bộ */}
      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle className='flex items-center gap-2 text-base'>
              <MessageSquare className='w-4 h-4 text-gray-500' />
              Ghi chú nội bộ
            </CardTitle>
            {!isClosed && (
              <Button
                size='sm'
                variant='ghost'
                onClick={() => {
                  if (editingNotes) handleSaveNotes();
                  else setEditingNotes(true);
                }}>
                {editingNotes ? "Lưu ghi chú" : "Chỉnh sửa"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editingNotes ? (
            <Textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              rows={4}
              placeholder='Ghi chú tiến độ, thông tin thêm...'
              autoFocus
            />
          ) : tr.internalNotes ? (
            <p className='text-sm whitespace-pre-wrap'>{tr.internalNotes}</p>
          ) : (
            <p className='text-muted-foreground text-sm italic'>Chưa có ghi chú.</p>
          )}
        </CardContent>
      </Card>

      {/* ── Chat với khách hàng ── */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <MessagesSquare className='w-4 h-4 text-primary' />
            <CardTitle className='text-base'>Chat với khách hàng</CardTitle>
            {(() => {
              const unread = chatMockStore.getUnreadCount(tr.id);
              return unread > 0 ? (
                <span className='flex justify-center items-center bg-red-500 px-1.5 rounded-full min-w-5 h-5 font-bold text-[11px] text-white'>
                  {unread}
                </span>
              ) : null;
            })()}
          </div>
        </CardHeader>
        <CardContent className='p-0 rounded-b-lg overflow-hidden'>
          <ChatPanel tripRequestId={tr.id} customerName={tr.customerName} />
        </CardContent>
      </Card>

      {/* Lost reason */}
      {tr.status === "lost" && tr.lostReason && (
        <div className='flex items-start gap-2 bg-red-50 p-3 border border-red-200 rounded-md text-red-800 text-sm'>
          <XCircle className='mt-0.5 w-4 h-4 shrink-0' />
          <span>
            Lý do mất lead: <strong>{tr.lostReason}</strong>
          </span>
        </div>
      )}

      {/* ── Dialogs ── */}

      {/* Assign dialog */}
      <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>Phân công Seller phụ trách</DialogTitle>
          </DialogHeader>
          <Field>
            <FieldLabel>
              Seller phụ trách <span className='text-red-500'>*</span>
            </FieldLabel>
            <Select value={assignSeller} onValueChange={setAssignSeller}>
              <SelectTrigger>
                <SelectValue placeholder='Chọn Seller' />
              </SelectTrigger>
              <SelectContent>
                {SELLER_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <DialogFooter>
            <Button variant='outline' onClick={() => setAssignDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleAssign} disabled={!assignSeller}>
              Xác nhận phân công
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lost dialog */}
      <Dialog open={lostDialog} onOpenChange={setLostDialog}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>Đánh dấu Mất lead</DialogTitle>
          </DialogHeader>
          <Field>
            <FieldLabel>
              Lý do mất lead <span className='text-red-500'>*</span>
            </FieldLabel>
            <Select value={lostReason} onValueChange={setLostReason}>
              <SelectTrigger>
                <SelectValue placeholder='Chọn lý do' />
              </SelectTrigger>
              <SelectContent>
                {LOST_REASON_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.label}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <DialogFooter>
            <Button variant='outline' onClick={() => setLostDialog(false)}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleLost} disabled={!lostReason}>
              Xác nhận mất lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* On Hold dialog */}
      <Dialog open={holdDialog} onOpenChange={setHoldDialog}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>Tạm hoãn — hẹn liên hệ lại</DialogTitle>
          </DialogHeader>
          <div className='space-y-3'>
            <Field>
              <FieldLabel>
                Hẹn liên hệ lại vào ngày <span className='text-red-500'>*</span>
              </FieldLabel>
              <Input type='date' value={holdUntil} onChange={(e) => setHoldUntil(e.target.value)} min={new Date().toISOString().slice(0, 10)} />
            </Field>
            <Field>
              <FieldLabel>Ghi chú (lý do tạm hoãn)</FieldLabel>
              <Textarea value={holdNote} onChange={(e) => setHoldNote(e.target.value)} placeholder='VD: Khách đang chờ kinh phí duyệt...' rows={2} />
            </Field>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setHoldDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleOnHold} disabled={!holdUntil}>
              <PauseCircle className='mr-2 w-4 h-4' />
              Xác nhận tạm hoãn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
