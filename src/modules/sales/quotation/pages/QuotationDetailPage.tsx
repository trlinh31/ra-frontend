import { PATHS } from "@/app/routes/route.constant";
import QuotationStatusBadge from "@/modules/sales/quotation/components/QuotationStatusBadge";
import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
import type { Quotation } from "@/modules/sales/quotation/types/quotation.type";
import PageHeader from "@/shared/components/common/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { CheckCircle2, Clock, FileDown, Plus, Send, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function QuotationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [quotation, setQuotation] = useState<Quotation | undefined>(() => (id ? quotationMockStore.getById(id) : undefined));
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendNote, setSendNote] = useState("");

  const refresh = () => setQuotation(id ? quotationMockStore.getById(id) : undefined);

  if (!quotation) {
    return (
      <div className='space-y-4'>
        <p className='text-muted-foreground'>Không tìm thấy báo giá.</p>
        <Button variant='outline' onClick={() => navigate(PATHS.SALES.QUOTATIONS)}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const isEditable = quotation.status === "draft";
  const canSend = quotation.status === "draft" || quotation.status === "sent";
  const canApprove = quotation.status === "sent";
  const canClose = quotation.status === "sent";
  const canCreateConfirmedTour = quotation.status === "approved" && !quotation.confirmedTourId;

  const handleSend = () => {
    quotationMockStore.send(quotation.id, quotation.sellingPrice, quotation.terms, sendNote || undefined);
    setSendDialogOpen(false);
    setSendNote("");
    refresh();
  };

  const handleApprove = async () => {
    const ok = await confirm({
      description: `Đánh dấu báo giá "${quotation.code}" là đã được khách chấp thuận? Sau đó có thể tạo Tour Xác Nhận từ báo giá này.`,
    });
    if (!ok) return;
    quotationMockStore.approve(quotation.id);
    refresh();
  };

  const handleReject = async () => {
    const ok = await confirm({
      description: `Đánh dấu báo giá "${quotation.code}" là bị khách từ chối? Báo giá sẽ bị đóng lại.`,
    });
    if (!ok) return;
    quotationMockStore.close(quotation.id, "rejected");
    refresh();
  };

  const handleExpire = async () => {
    const ok = await confirm({
      description: `Đánh dấu báo giá "${quotation.code}" là hết hạn / không có phản hồi?`,
    });
    if (!ok) return;
    quotationMockStore.close(quotation.id, "expired");
    refresh();
  };

  const handleCreateConfirmedTour = () => {
    navigate(`${PATHS.SALES.CONFIRMED_TOUR_CREATE}?quotationId=${quotation.id}`);
  };

  const costEntries = Object.entries(quotation.costTotal);

  return (
    <div className='space-y-6'>
      <PageHeader
        title={`Báo giá ${quotation.code}`}
        description={`Tạo bởi ${quotation.createdBy} — ${quotation.createdAt}`}
      />

      {/* Trạng thái + hành động */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between flex-wrap gap-3'>
            <div className='flex items-center gap-3'>
              <CardTitle className='text-base'>Trạng thái báo giá</CardTitle>
              <QuotationStatusBadge status={quotation.status} />
              {quotation.currentVersion > 0 && (
                <span className='text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full'>v{quotation.currentVersion}</span>
              )}
            </div>
            <div className='flex items-center gap-2 flex-wrap'>
              {/* Nút xuất PDF — luôn hiển thị */}
              <Button
                size='sm'
                variant='outline'
                className='border-indigo-300 text-indigo-700 hover:bg-indigo-50'
                onClick={() => window.open(PATHS.SALES.QUOTATION_PRINT.replace(":id", quotation.id), "_blank")}>
                <FileDown className='w-4 h-4 mr-2' />
                Xuất PDF
              </Button>

              {canSend && (
                <Button size='sm' onClick={() => setSendDialogOpen(true)}>
                  <Send className='w-4 h-4 mr-2' />
                  {quotation.status === "sent" ? "Gửi lại (phiên bản mới)" : "Gửi báo giá"}
                </Button>
              )}
              {canApprove && (
                <Button size='sm' variant='default' className='bg-green-600 hover:bg-green-700' onClick={handleApprove}>
                  <CheckCircle2 className='w-4 h-4 mr-2' />
                  Đánh dấu Đã chấp thuận
                </Button>
              )}
              {canClose && (
                <>
                  <Button size='sm' variant='outline' onClick={handleReject}>
                    <XCircle className='w-4 h-4 mr-2' />
                    Khách từ chối
                  </Button>
                  <Button size='sm' variant='outline' onClick={handleExpire}>
                    <Clock className='w-4 h-4 mr-2' />
                    Hết hạn
                  </Button>
                </>
              )}
              {canCreateConfirmedTour && (
                <Button size='sm' className='bg-blue-600 hover:bg-blue-700' onClick={handleCreateConfirmedTour}>
                  <Plus className='w-4 h-4 mr-2' />
                  Tạo Tour Xác Nhận
                </Button>
              )}
              {quotation.confirmedTourId && (
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => navigate(PATHS.SALES.CONFIRMED_TOUR_DETAIL.replace(":id", quotation.confirmedTourId!))}>
                  Xem Tour Xác Nhận
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Thông tin khách hàng */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Thông tin khách hàng</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <InfoRow label='Tên khách hàng / đoàn' value={quotation.customerName} />
            <InfoRow label='Email' value={quotation.customerEmail} />
            <InfoRow label='Số điện thoại' value={quotation.customerPhone} />
            <InfoRow label='Số khách dự kiến' value={`${quotation.numberOfPeople} người`} />
            <InfoRow label='Ngày khởi hành (dự kiến)' value={quotation.departureDateEst} />
            {quotation.note && <InfoRow label='Ghi chú yêu cầu' value={quotation.note} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Chi phí & Giá bán</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <div>
              <p className='text-xs text-muted-foreground mb-1'>Chi phí (cost)</p>
              {costEntries.length > 0 ? (
                costEntries.map(([cur, amt]) => (
                  <p key={cur} className='font-medium'>
                    {formatNumberVN(amt)} {cur}
                  </p>
                ))
              ) : (
                <p className='text-muted-foreground italic'>Chưa có dịch vụ</p>
              )}
            </div>
            <Separator />
            <div>
              <p className='text-xs text-muted-foreground mb-1'>Giá bán đề xuất cho khách</p>
              {Object.entries(quotation.sellingPrice).length > 0 ? (
                Object.entries(quotation.sellingPrice).map(([cur, amt]) => (
                  <p key={cur} className='font-medium text-green-700'>
                    {formatNumberVN(amt)} {cur}
                  </p>
                ))
              ) : (
                <p className='text-muted-foreground italic'>Chưa nhập giá bán (sẽ nhập khi gửi báo giá)</p>
              )}
            </div>
            {quotation.tourTemplateName && (
              <>
                <Separator />
                <InfoRow label='Tour mẫu cơ sở' value={quotation.tourTemplateName} />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Điều khoản */}
      {quotation.terms && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Điều khoản báo giá</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm whitespace-pre-wrap'>{quotation.terms}</p>
          </CardContent>
        </Card>
      )}

      {/* Lịch sử phiên bản */}
      {quotation.versions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Lịch sử phiên bản báo giá</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {[...quotation.versions].reverse().map((v) => (
                <div key={v.version} className='border rounded-md p-3 text-sm space-y-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs'>v{v.version}</span>
                    <span className='text-muted-foreground'>Gửi lúc: {v.sentAt}</span>
                    {v === quotation.versions[quotation.versions.length - 1] && (
                      <span className='text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded'>Hiện hành</span>
                    )}
                  </div>
                  {v.note && <p className='text-muted-foreground italic'>{v.note}</p>}
                  <div className='text-xs text-muted-foreground'>
                    Chi phí:{" "}
                    {Object.entries(v.costTotal)
                      .map(([c, a]) => `${formatNumberVN(a)} ${c}`)
                      .join(" | ") || "—"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog gửi báo giá */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>{quotation.currentVersion === 0 ? "Gửi báo giá cho khách" : `Gửi lại báo giá (v${quotation.currentVersion + 1})`}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            <div className='text-sm bg-muted/40 p-3 rounded-md space-y-1'>
              <p>
                <span className='text-muted-foreground'>Báo giá: </span>
                <span className='font-medium'>{quotation.code}</span>
              </p>
              <p>
                <span className='text-muted-foreground'>Khách hàng: </span>
                <span className='font-medium'>{quotation.customerName}</span>
              </p>
              {costEntries.length > 0 && (
                <p>
                  <span className='text-muted-foreground'>Chi phí: </span>
                  <span className='font-medium'>{costEntries.map(([c, a]) => `${formatNumberVN(a)} ${c}`).join(" | ")}</span>
                </p>
              )}
            </div>
            <Field>
              <FieldLabel>Ghi chú thay đổi so với phiên bản trước (nếu có)</FieldLabel>
              <Textarea
                value={sendNote}
                onChange={(e) => setSendNote(e.target.value)}
                placeholder='VD: Đã điều chỉnh giá, thay khách sạn...'
                rows={3}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setSendDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSend}>
              <Send className='w-4 h-4 mr-2' />
              Xác nhận Gửi
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
      <span className='text-xs text-muted-foreground'>{label}</span>
      <span className='font-medium'>{value ?? <span className='text-muted-foreground italic'>—</span>}</span>
    </div>
  );
}
