import { PATHS } from "@/app/routes/route.constant";
import QuotationStatusBadge from "@/modules/sales/quotation/components/QuotationStatusBadge";
import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
import type { Quotation } from "@/modules/sales/quotation/types/quotation.type";
import { SERVICE_TYPE_CONFIG } from "@/modules/tour/day/types/day.type";
import PageHeader from "@/shared/components/common/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { CURRENCY_OPTIONS } from "@/shared/constants/currency.constant";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { AlertCircle, CheckCircle2, Clock, FileDown, Pencil, Plus, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function QuotationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [quotation, setQuotation] = useState<Quotation | undefined>(() => (id ? quotationMockStore.getById(id) : undefined));
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendNote, setSendNote] = useState("");
  const [sendSellingPrice, setSendSellingPrice] = useState("");
  const [sendCurrency, setSendCurrency] = useState("VND");

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

  const isEditable = quotation.status === "draft" || quotation.status === "sent";
  const canSend = quotation.status === "draft" || quotation.status === "sent";
  const canApprove = quotation.status === "sent";
  const canClose = quotation.status === "sent";
  const canCreateConfirmedTour = quotation.status === "approved" && !quotation.confirmedTourId;

  const openSendDialog = () => {
    // Pre-fill selling price nếu đã có
    const existing = Object.entries(quotation.sellingPrice);
    if (existing.length > 0) {
      const [cur, amt] = existing[0];
      setSendCurrency(cur);
      setSendSellingPrice(String(amt));
    } else {
      setSendSellingPrice("");
      setSendCurrency("VND");
    }
    setSendNote("");
    setSendDialogOpen(true);
  };

  const handleSend = () => {
    const price = parseFloat(sendSellingPrice);
    const sellingPrice = sendSellingPrice && price > 0 ? { [sendCurrency]: price } : quotation.sellingPrice;
    quotationMockStore.send(quotation.id, sellingPrice, quotation.terms, sendNote || undefined);
    setSendDialogOpen(false);
    setSendNote("");
    setSendSellingPrice("");
    refresh();
  };

  const handleApprove = async () => {
    const ok = await confirm({
      description: `Đánh dấu báo giá "${quotation.code}" là đã được khách chấp thuận? Sau đó có thể tạo Booking Tour từ báo giá này.`,
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
      <PageHeader title={`Báo giá ${quotation.code}`} description={`Tạo bởi ${quotation.createdBy} — ${quotation.createdAt}`} />

      {/* Trạng thái + hành động */}
      <Card>
        <CardHeader>
          <div className='flex flex-wrap justify-between items-center gap-3'>
            <div className='flex items-center gap-3'>
              <CardTitle className='text-base'>Trạng thái báo giá</CardTitle>
              <QuotationStatusBadge status={quotation.status} />
              {quotation.currentVersion > 0 && (
                <span className='bg-muted px-2 py-0.5 rounded-full text-muted-foreground text-xs'>v{quotation.currentVersion}</span>
              )}
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              {/* Nút chỉnh sửa — chỉ khi draft/sent */}
              {isEditable && (
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => navigate(PATHS.SALES.QUOTATION_EDIT.replace(":id", quotation.id))}>
                  <Pencil className='mr-2 w-4 h-4' />
                  Chỉnh sửa
                </Button>
              )}

              {/* Nút xuất PDF — luôn hiển thị */}
              <Button
                size='sm'
                variant='outline'
                className='hover:bg-indigo-50 border-indigo-300 text-indigo-700'
                onClick={() => window.open(PATHS.SALES.QUOTATION_PRINT.replace(":id", quotation.id), "_blank")}>
                <FileDown className='mr-2 w-4 h-4' />
                Xuất PDF
              </Button>

              {canSend && (
                <Button size='sm' variant='default' onClick={openSendDialog}>
                  <CheckCircle2 className='mr-2 w-4 h-4' />
                  {quotation.status === "sent" ? "Ghi nhận gửi lại (bản mới)" : "Ghi nhận đã gửi cho khách"}
                </Button>
              )}
              {canApprove && (
                <Button size='sm' variant='default' className='bg-green-600 hover:bg-green-700' onClick={handleApprove}>
                  <CheckCircle2 className='mr-2 w-4 h-4' />
                  Đánh dấu Đã chấp thuận
                </Button>
              )}
              {canClose && (
                <>
                  <Button size='sm' variant='outline' onClick={handleReject}>
                    <XCircle className='mr-2 w-4 h-4' />
                    Khách từ chối
                  </Button>
                  <Button size='sm' variant='outline' onClick={handleExpire}>
                    <Clock className='mr-2 w-4 h-4' />
                    Hết hạn
                  </Button>
                </>
              )}
              {canCreateConfirmedTour && (
                <Button size='sm' className='bg-blue-600 hover:bg-blue-700' onClick={handleCreateConfirmedTour}>
                  <Plus className='mr-2 w-4 h-4' />
                  Tạo Booking Tour
                </Button>
              )}
              {quotation.confirmedTourId && (
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => navigate(PATHS.SALES.CONFIRMED_TOUR_DETAIL.replace(":id", quotation.confirmedTourId!))}>
                  Xem Booking Tour
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Thông tin khách hàng */}
      <div className='gap-6 grid grid-cols-1 md:grid-cols-2'>
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
              <p className='mb-1 text-muted-foreground text-xs'>Chi phí (cost)</p>
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
              <p className='mb-1 text-muted-foreground text-xs'>Giá bán đề xuất cho khách</p>
              {Object.entries(quotation.sellingPrice).length > 0 ? (
                Object.entries(quotation.sellingPrice).map(([cur, amt]) => (
                  <p key={cur} className='font-medium text-green-700'>
                    {formatNumberVN(amt)} {cur}
                  </p>
                ))
              ) : (
                <p className='text-muted-foreground italic'>Chưa nhập giá bán (nhập khi ghi nhận đã gửi cho khách)</p>
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

      {/* Lịch trình */}
      {quotation.itinerary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Lịch trình báo giá</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 px-4 py-3'>
            {quotation.itinerary.map((entry, idx) => {
              if (entry.kind === "group_tour") {
                return (
                  <div key={idx} className='border rounded-md overflow-hidden'>
                    <div className='flex justify-between items-center bg-blue-50 px-3 py-2'>
                      <span className='font-semibold text-sm'>
                        Ngày {idx + 1}: [Nhóm tour] {entry.name}
                      </span>
                      {entry.unitPrice > 0 && entry.currency && (
                        <span className='font-medium text-green-700 text-sm'>
                          {formatNumberVN(entry.unitPrice)} {entry.currency}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              const dayTotals = entry.services.reduce<Record<string, number>>((acc, svc) => {
                if (!svc.unitPrice || !svc.currency) return acc;
                acc[svc.currency] = (acc[svc.currency] ?? 0) + svc.unitPrice;
                return acc;
              }, {});

              return (
                <div key={idx} className='border rounded-md overflow-hidden'>
                  <div className='flex justify-between items-center bg-muted px-3 py-2'>
                    <span className='font-semibold text-sm'>
                      Ngày {idx + 1}: [{entry.code}] {entry.title}
                    </span>
                    <div className='flex items-center gap-2 font-medium text-green-700 text-sm'>
                      {Object.entries(dayTotals).map(([cur, total]) => (
                        <span key={cur}>
                          {formatNumberVN(total)} {cur}
                        </span>
                      ))}
                    </div>
                  </div>
                  {entry.services.length > 0 ? (
                    <div className='divide-y text-sm'>
                      {entry.services.map((svc, sIdx) => {
                        const config = SERVICE_TYPE_CONFIG[svc.serviceType];
                        return (
                          <div key={sIdx} className='flex justify-between items-center px-3 py-2'>
                            <div className='flex items-center gap-2'>
                              <span className='flex items-center gap-1 w-28 text-muted-foreground text-xs shrink-0'>
                                {config?.icon}
                                {config?.label}
                              </span>
                              <span>{svc.name}</span>
                            </div>
                            <span className='font-medium text-green-600 whitespace-nowrap'>
                              {svc.unitPrice ? `${formatNumberVN(svc.unitPrice)} ${svc.currency}` : "—"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className='px-3 py-2 text-muted-foreground text-xs italic'>Không có dịch vụ trong ngày này.</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

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
                <div key={v.version} className='space-y-1 p-3 border rounded-md text-sm'>
                  <div className='flex items-center gap-2'>
                    <span className='bg-blue-100 px-2 py-0.5 rounded font-semibold text-blue-800 text-xs'>v{v.version}</span>
                    <span className='text-muted-foreground'>Đã gửi lúc: {v.sentAt}</span>
                    {v === quotation.versions[quotation.versions.length - 1] && (
                      <span className='bg-green-100 px-2 py-0.5 rounded text-green-700 text-xs'>Hiện hành</span>
                    )}
                  </div>
                  {v.note && <p className='text-muted-foreground italic'>{v.note}</p>}
                  <div className='text-muted-foreground text-xs'>
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

      {/* Dialog ghi nhận đã gửi báo giá */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {quotation.currentVersion === 0
                ? "Ghi nhận đã gửi báo giá cho khách"
                : `Ghi nhận đã gửi bản cập nhật (v${quotation.currentVersion + 1})`}
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4 py-1'>
            {/* Hướng dẫn */}
            <div className='flex items-start gap-2.5 bg-amber-50 p-3 border border-amber-200 rounded-md text-sm'>
              <AlertCircle className='mt-0.5 w-4 h-4 text-amber-600 shrink-0' />
              <div className='space-y-2'>
                <p className='font-medium text-amber-800'>Quy trình gửi báo giá</p>
                <p className='text-amber-700 leading-relaxed'>
                  Xuất PDF → gửi cho khách qua email / Zalo / điện thoại → quay lại đây ghi nhận để cập nhật trạng thái.
                </p>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  className='hover:bg-amber-100 border-amber-300 h-7 text-amber-700'
                  onClick={() => window.open(PATHS.SALES.QUOTATION_PRINT.replace(":id", quotation.id), "_blank")}>
                  <FileDown className='mr-1.5 w-3.5 h-3.5' />
                  Mở PDF báo giá
                </Button>
              </div>
            </div>

            {/* Thông tin tóm tắt */}
            <div className='space-y-1 bg-muted/40 p-3 rounded-md text-sm'>
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

            {/* Giá bán gửi cho khách */}
            <Field>
              <FieldLabel>
                Giá bán gửi cho khách <span className='text-red-500'>*</span>
              </FieldLabel>
              <div className='flex gap-2'>
                <Input
                  type='number'
                  value={sendSellingPrice}
                  onChange={(e) => setSendSellingPrice(e.target.value)}
                  placeholder='VD: 15000000'
                  className='flex-1'
                  min={0}
                />
                <Select value={sendCurrency} onValueChange={setSendCurrency}>
                  <SelectTrigger className='w-28'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Field>

            {/* Ghi chú phiên bản */}
            <Field>
              <FieldLabel>Ghi chú thay đổi so với lần trước (nếu có)</FieldLabel>
              <Textarea
                value={sendNote}
                onChange={(e) => setSendNote(e.target.value)}
                placeholder='VD: Đã điều chỉnh giá, thay đổi khách sạn, bổ sung dịch vụ...'
                rows={2}
              />
            </Field>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setSendDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSend} disabled={!sendSellingPrice || parseFloat(sendSellingPrice) <= 0}>
              <CheckCircle2 className='mr-2 w-4 h-4' />
              Ghi nhận đã gửi
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
