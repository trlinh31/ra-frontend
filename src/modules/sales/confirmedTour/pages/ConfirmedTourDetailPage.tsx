import { PATHS } from "@/app/routes/route.constant";
import AssignTourDialog from "@/modules/sales/confirmedTour/components/AssignTourDialog";
import ConfirmedTourStatusBadge from "@/modules/sales/confirmedTour/components/ConfirmedTourStatusBadge";
import { CONFIRMED_TOUR_STATUS_LABEL } from "@/modules/sales/confirmedTour/constants/confirmed-tour.constant";
import { confirmedTourMockStore } from "@/modules/sales/confirmedTour/data/confirmed-tour.mock-store";
import type { ConfirmedTour } from "@/modules/sales/confirmedTour/types/confirmed-tour.type";
import { CANCELLATION_REASONS } from "@/modules/sales/quotation/constants/quotation.constant";
import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
import { userMockStore } from "@/modules/userManagement/data/user.mock-store";
import AppSelect from "@/shared/components/common/AppSelect";
import PageHeader from "@/shared/components/common/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { Ban, CheckCircle2, UserRoundCog, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ConfirmedTourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [tour, setTour] = useState<ConfirmedTour | undefined>(() => (id ? confirmedTourMockStore.getById(id) : undefined));
  const [assignOpen, setAssignOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelReasonError, setCancelReasonError] = useState(false);
  const [cancelNote, setCancelNote] = useState("");

  const refresh = () => setTour(id ? confirmedTourMockStore.getById(id) : undefined);

  if (!tour) {
    return (
      <div className='space-y-4'>
        <p className='text-muted-foreground'>Không tìm thấy Xác nhận Tour.</p>
        <Button variant='outline' onClick={() => navigate(PATHS.SALES.CONFIRMED_TOURS)}>
          Quay lại
        </Button>
      </div>
    );
  }

  const linkedQuotation = tour.quotationId ? quotationMockStore.getById(tour.quotationId) : undefined;
  const operatorName = userMockStore.getById(tour.assignedTo ?? "")?.fullName;

  const canAssign = tour.status === "confirmed";
  const canApprove = tour.status === "pending_approval";
  const canReject = tour.status === "pending_approval";
  const canCancel = tour.status !== "completed" && tour.status !== "cancelled";
  const needsSpecialApproval = tour.status === "in_operation";

  const handleApprove = async () => {
    const ok = await confirm({
      description: `Phê duyệt Xác nhận Tour "${tour.code}"? Tour sẽ chuyển sang trạng thái "Đã xác nhận".`,
    });
    if (!ok) return;
    confirmedTourMockStore.updateStatus(tour.id, "confirmed", { approvedBy: "Sale Manager" });
    refresh();
  };

  const handleReject = async () => {
    const ok = await confirm({
      description: `Từ chối Xác nhận Tour "${tour.code}"? Nhân viên kinh doanh sẽ cần chỉnh sửa và gửi lại.`,
    });
    if (!ok) return;
    confirmedTourMockStore.updateStatus(tour.id, "rejected");
    refresh();
  };

  const handleCancelSubmit = async () => {
    if (!cancelReason) {
      setCancelReasonError(true);
      return;
    }

    if (needsSpecialApproval) {
      const ok = await confirm({
        description: `Tour đang vận hành. Hủy sẽ yêu cầu xác nhận từ Sale Manager VÀ Operation Manager. Trong môi trường demo, hủy ngay lập tức với quyền đặc biệt.`,
      });
      if (!ok) return;
      const result = confirmedTourMockStore.cancel(tour.id, cancelReason + (cancelNote ? ` — ${cancelNote}` : ""), "Sale Manager", true);
      if (!result.success) {
        await confirm({ description: result.message ?? "Không thể hủy tour." });
        return;
      }
    } else {
      const ok = await confirm({
        description: `Xác nhận hủy tour "${tour.code}"? Hành động này không thể hoàn tác.`,
      });
      if (!ok) return;
      const result = confirmedTourMockStore.cancel(tour.id, cancelReason + (cancelNote ? ` — ${cancelNote}` : ""), "Seller A");
      if (!result.success) {
        await confirm({ description: result.message ?? "Không thể hủy tour." });
        return;
      }
    }

    setCancelDialogOpen(false);
    setCancelReason("");
    setCancelNote("");
    refresh();
  };

  const cancelReasonLabel = CANCELLATION_REASONS.find((r) => r.value === tour.cancellationReason)?.label ?? tour.cancellationReason;

  return (
    <div className='space-y-6'>
      <PageHeader title={`Xác nhận Tour ${tour.code}`} description={`Tạo bởi ${tour.createdBy} — ${tour.createdAt}`} />

      {/* Trạng thái + hành động */}
      <Card>
        <CardHeader>
          <div className='flex flex-wrap justify-between items-center gap-3'>
            <div className='flex items-center gap-3'>
              <CardTitle className='text-base'>Trạng thái</CardTitle>
              <ConfirmedTourStatusBadge status={tour.status} />
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              {canApprove && (
                <Button size='sm' className='bg-green-600 hover:bg-green-700' onClick={handleApprove}>
                  <CheckCircle2 className='mr-2 w-4 h-4' />
                  Phê duyệt
                </Button>
              )}
              {canReject && (
                <Button size='sm' variant='outline' onClick={handleReject}>
                  <XCircle className='mr-2 w-4 h-4' />
                  Từ chối
                </Button>
              )}
              {canAssign && (
                <Button size='sm' variant='outline' onClick={() => setAssignOpen(true)}>
                  <UserRoundCog className='mr-2 w-4 h-4' />
                  Assign Vận hành
                </Button>
              )}
              {canCancel && (
                <Button size='sm' variant='destructive' onClick={() => setCancelDialogOpen(true)}>
                  <Ban className='mr-2 w-4 h-4' />
                  {needsSpecialApproval ? "Yêu cầu Hủy Tour (đặc biệt)" : "Hủy Tour"}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Thông tin tour */}
      <div className='gap-6 grid grid-cols-1 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Thông tin đoàn khách</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <InfoRow label='Tên đoàn / Khách hàng' value={tour.customerName} />
            <InfoRow label='Số khách thực tế' value={`${tour.numberOfPeople} người`} />
            <InfoRow label='Ngày khởi hành' value={tour.departureDate} />
            {tour.note && <InfoRow label='Ghi chú yêu cầu' value={tour.note} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Nguồn gốc & Chi phí</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            {tour.tourTemplateName && <InfoRow label='Tour mẫu' value={tour.tourTemplateName} />}
            {linkedQuotation && (
              <div className='flex flex-col gap-0.5'>
                <span className='text-muted-foreground text-xs'>Báo giá gốc</span>
                <button
                  className='font-medium text-blue-600 text-left hover:underline'
                  onClick={() => navigate(PATHS.SALES.QUOTATION_DETAIL.replace(":id", linkedQuotation.id))}>
                  {linkedQuotation.code}
                </button>
              </div>
            )}
            <Separator />
            <div>
              <p className='mb-1 text-muted-foreground text-xs'>Tổng chi phí</p>
              {Object.entries(tour.totalCost).length > 0 ? (
                Object.entries(tour.totalCost).map(([cur, amt]) => (
                  <p key={cur} className='font-medium'>
                    {formatNumberVN(amt)} {cur}
                  </p>
                ))
              ) : (
                <p className='text-muted-foreground italic'>—</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vận hành */}
      {(tour.assignedTo || tour.approvedBy) && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Thông tin vận hành</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            {tour.approvedBy && <InfoRow label='Người phê duyệt' value={tour.approvedBy} />}
            {operatorName && <InfoRow label='Operator phụ trách' value={operatorName} />}
            {tour.assignedAt && <InfoRow label='Ngày assign' value={tour.assignedAt} />}
            {tour.operationNote && <InfoRow label='Ghi chú vận hành' value={tour.operationNote} />}
          </CardContent>
        </Card>
      )}

      {/* Thông tin hủy */}
      {tour.status === "cancelled" && (
        <Card className='border-red-200'>
          <CardHeader>
            <CardTitle className='text-red-700 text-base'>Thông tin hủy tour</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <InfoRow label='Người yêu cầu hủy' value={tour.cancelledBy} />
            <InfoRow label='Ngày hủy' value={tour.cancelledAt} />
            <InfoRow label='Lý do hủy' value={cancelReasonLabel} />
          </CardContent>
        </Card>
      )}

      {/* Dialog Assign */}
      <AssignTourDialog
        tour={assignOpen ? tour : null}
        open={assignOpen}
        onOpenChange={setAssignOpen}
        onAssigned={() => {
          setAssignOpen(false);
          refresh();
        }}
      />

      {/* Dialog Hủy Tour */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>{needsSpecialApproval ? "Yêu cầu Hủy Tour (Đặc biệt)" : "Xác nhận Hủy Tour"}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            {needsSpecialApproval && (
              <div className='bg-yellow-50 p-3 border border-yellow-200 rounded-md text-yellow-800 text-sm'>
                ⚠️ Tour đang ở trạng thái <strong>Đang vận hành</strong>. Hủy tour yêu cầu xác nhận đồng thời từ <strong>Sale Manager</strong> và{" "}
                <strong>Operation Manager</strong>.
              </div>
            )}
            <div className='space-y-1 bg-muted/40 p-3 rounded-md text-sm'>
              <p>
                <span className='text-muted-foreground'>Mã tour: </span>
                <span className='font-medium'>{tour.code}</span>
              </p>
              <p>
                <span className='text-muted-foreground'>Đoàn: </span>
                <span className='font-medium'>{tour.customerName}</span>
              </p>
              <p>
                <span className='text-muted-foreground'>Trạng thái: </span>
                <span className='font-medium'>{CONFIRMED_TOUR_STATUS_LABEL[tour.status]}</span>
              </p>
            </div>
            <Field data-invalid={cancelReasonError}>
              <FieldLabel>
                Lý do hủy <span className='text-red-500'>*</span>
              </FieldLabel>
              <AppSelect
                options={CANCELLATION_REASONS}
                value={cancelReason}
                onChange={(v) => {
                  setCancelReason(String(v));
                  setCancelReasonError(false);
                }}
                placeholder='Chọn lý do hủy'
              />
              {cancelReasonError && <FieldError errors={[{ message: "Vui lòng chọn lý do hủy" }]} />}
            </Field>
            <Field>
              <FieldLabel>Ghi chú bổ sung</FieldLabel>
              <Textarea value={cancelNote} onChange={(e) => setCancelNote(e.target.value)} placeholder='Thông tin thêm về lý do hủy...' rows={3} />
            </Field>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setCancelDialogOpen(false)}>
              Đóng
            </Button>
            <Button variant='destructive' onClick={handleCancelSubmit}>
              <Ban className='mr-2 w-4 h-4' />
              Xác nhận Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className='flex flex-col gap-0.5'>
      <span className='text-muted-foreground text-xs'>{label}</span>
      <span className='font-medium'>{value ?? <span className='text-muted-foreground italic'>—</span>}</span>
    </div>
  );
}
