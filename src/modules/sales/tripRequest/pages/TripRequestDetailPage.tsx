import { PATHS } from "@/app/routes/route.constant";
import TripRequestStatusBadge from "@/modules/sales/tripRequest/components/TripRequestStatusBadge";
import {
  LEAD_SOURCE_LABEL,
  LOST_REASON_OPTIONS,
  SELLER_OPTIONS,
  SERVICE_LEVEL_BADGE,
  SERVICE_LEVEL_LABEL,
} from "@/modules/sales/tripRequest/constants/trip-request.constant";
import { tripRequestMockStore } from "@/modules/sales/tripRequest/data/trip-request.mock-store";
import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
import type { TripRequest } from "@/modules/sales/tripRequest/types/trip-request.type";
import PageHeader from "@/shared/components/common/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  HandHelping,
  Info,
  MapPin,
  MessageSquare,
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
      <span className='text-xs text-muted-foreground'>{label}</span>
      <span className='font-medium text-sm'>{value ?? <span className='text-muted-foreground italic'>—</span>}</span>
    </div>
  );
}

export default function TripRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [tr, setTr] = useState<TripRequest | undefined>(() =>
    id ? tripRequestMockStore.getById(id) : undefined
  );

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

  const linkedQuotations = tr.quotationIds
    .map((qid) => quotationMockStore.getById(qid))
    .filter(Boolean);

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
  const canCreateQuotation = ["assigned", "in_progress"].includes(tr.status);
  const canMarkLost = ["assigned", "in_progress", "on_hold"].includes(tr.status);
  const canMarkOnHold = ["assigned", "in_progress"].includes(tr.status);

  return (
    <div className='space-y-6'>
      <PageHeader
        title={`Trip Request ${tr.code}`}
        description={`Tạo bởi ${tr.createdBy} — ${formatDate(tr.createdAt)}`}
      />

      {/* ── Trạng thái + hành động ── */}
      <Card>
        <CardHeader>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <CardTitle className='text-base'>Trạng thái</CardTitle>
              <TripRequestStatusBadge status={tr.status} />
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              {/* Assign */}
              {tr.status === "new" && (
                <Button size='sm' variant='outline' onClick={() => setAssignDialog(true)}>
                  <HandHelping className='w-4 h-4 mr-2' />
                  Phân công Seller
                </Button>
              )}

              {/* Bắt đầu xử lý */}
              {tr.status === "assigned" && (
                <Button size='sm' variant='outline' onClick={handleStartProgress}>
                  <ArrowRight className='w-4 h-4 mr-2' />
                  Bắt đầu xử lý
                </Button>
              )}

              {/* Tạo Báo giá */}
              {canCreateQuotation && (
                <Button size='sm' onClick={handleCreateQuotation}>
                  <FileText className='w-4 h-4 mr-2' />
                  Tạo Báo giá
                </Button>
              )}

              {/* Tiếp tục (từ on_hold) */}
              {tr.status === "on_hold" && (
                <Button size='sm' variant='outline' onClick={handleResume}>
                  <ArrowRight className='w-4 h-4 mr-2' />
                  Tiếp tục xử lý
                </Button>
              )}

              {/* Tạm hoãn */}
              {canMarkOnHold && (
                <Button size='sm' variant='outline' onClick={() => setHoldDialog(true)}>
                  <PauseCircle className='w-4 h-4 mr-2' />
                  Tạm hoãn
                </Button>
              )}

              {/* Mất lead */}
              {canMarkLost && (
                <Button
                  size='sm'
                  variant='outline'
                  className='text-red-600 border-red-300 hover:bg-red-50'
                  onClick={() => setLostDialog(true)}>
                  <XCircle className='w-4 h-4 mr-2' />
                  Mất lead
                </Button>
              )}

              {/* Xem ConfirmedTour khi converted */}
              {tr.status === "converted" && tr.confirmedTourId && (
                <Button
                  size='sm'
                  variant='outline'
                  className='border-green-300 text-green-700'
                  onClick={() =>
                    navigate(PATHS.SALES.CONFIRMED_TOUR_DETAIL.replace(":id", tr.confirmedTourId!))
                  }>
                  <CheckCircle2 className='w-4 h-4 mr-2' />
                  Xem Tour Xác Nhận
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ── On Hold info ── */}
      {tr.status === "on_hold" && tr.holdUntil && (
        <div className='flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-md text-sm text-purple-800'>
          <PauseCircle className='w-4 h-4 shrink-0' />
          <span>
            Tạm hoãn — Hẹn liên hệ lại vào ngày <strong>{formatDate(tr.holdUntil)}</strong>
          </span>
        </div>
      )}

      {/* ── Main grid ── */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

        {/* Thông tin khách hàng */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base flex items-center gap-2'>
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
                tr.assignedTo ?? (
                  <span className='text-amber-600 italic text-xs'>Chưa phân công</span>
                )
              }
            />
          </CardContent>
        </Card>

        {/* Nhu cầu chuyến đi */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base flex items-center gap-2'>
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
            <InfoRow
              label='Mức dịch vụ'
              value={
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SERVICE_LEVEL_BADGE[tr.serviceLevel]}`}>
                  {SERVICE_LEVEL_LABEL[tr.serviceLevel]}
                </span>
              }
            />
            {tr.budgetEstimate && (
              <InfoRow
                label='Ngân sách tham khảo'
                value={`${formatNumberVN(tr.budgetEstimate)} ${tr.budgetCurrency ?? "VND"}`}
              />
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
            <CardTitle className='text-base flex items-center gap-2'>
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
          <div className='flex items-center justify-between'>
            <CardTitle className='text-base flex items-center gap-2'>
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
            <p className='text-sm text-muted-foreground italic'>Chưa có báo giá nào được tạo từ trip request này.</p>
          ) : (
            <div className='space-y-2'>
              {linkedQuotations.map((q) => {
                if (!q) return null;
                return (
                  <div
                    key={q.id}
                    className='flex items-center justify-between p-2.5 border rounded-md hover:bg-muted/40 cursor-pointer transition-colors'
                    onClick={() => navigate(PATHS.SALES.QUOTATION_DETAIL.replace(":id", q.id))}>
                    <div>
                      <p className='text-sm font-medium'>{q.code}</p>
                      <p className='text-xs text-muted-foreground'>v{q.currentVersion} · {q.status}</p>
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
          <div className='flex items-center justify-between'>
            <CardTitle className='text-base flex items-center gap-2'>
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
            <p className='text-sm text-muted-foreground italic'>Chưa có ghi chú.</p>
          )}
        </CardContent>
      </Card>

      {/* Lost reason */}
      {tr.status === "lost" && tr.lostReason && (
        <div className='flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800'>
          <XCircle className='w-4 h-4 shrink-0 mt-0.5' />
          <span>Lý do mất lead: <strong>{tr.lostReason}</strong></span>
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
            <FieldLabel>Seller phụ trách <span className='text-red-500'>*</span></FieldLabel>
            <Select value={assignSeller} onValueChange={setAssignSeller}>
              <SelectTrigger>
                <SelectValue placeholder='Chọn Seller' />
              </SelectTrigger>
              <SelectContent>
                {SELLER_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <DialogFooter>
            <Button variant='outline' onClick={() => setAssignDialog(false)}>Hủy</Button>
            <Button onClick={handleAssign} disabled={!assignSeller}>Xác nhận phân công</Button>
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
            <FieldLabel>Lý do mất lead <span className='text-red-500'>*</span></FieldLabel>
            <Select value={lostReason} onValueChange={setLostReason}>
              <SelectTrigger>
                <SelectValue placeholder='Chọn lý do' />
              </SelectTrigger>
              <SelectContent>
                {LOST_REASON_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.label}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <DialogFooter>
            <Button variant='outline' onClick={() => setLostDialog(false)}>Hủy</Button>
            <Button
              variant='destructive'
              onClick={handleLost}
              disabled={!lostReason}>
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
              <FieldLabel>Hẹn liên hệ lại vào ngày <span className='text-red-500'>*</span></FieldLabel>
              <Input
                type='date'
                value={holdUntil}
                onChange={(e) => setHoldUntil(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
              />
            </Field>
            <Field>
              <FieldLabel>Ghi chú (lý do tạm hoãn)</FieldLabel>
              <Textarea
                value={holdNote}
                onChange={(e) => setHoldNote(e.target.value)}
                placeholder='VD: Khách đang chờ kinh phí duyệt...'
                rows={2}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setHoldDialog(false)}>Hủy</Button>
            <Button onClick={handleOnHold} disabled={!holdUntil}>
              <PauseCircle className='w-4 h-4 mr-2' />
              Xác nhận tạm hoãn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
