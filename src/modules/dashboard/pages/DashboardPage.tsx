import { PATHS } from "@/app/routes/route.constant";
import { customerPaymentMockStore } from "@/modules/accounting/customerPayment/data/customer-payment.mock-store";
import { vendorPaymentMockStore } from "@/modules/accounting/vendorPayment/data/vendor-payment.mock-store";
import { confirmedTourMockStore } from "@/modules/sales/confirmedTour/data/confirmed-tour.mock-store";
import type { ConfirmedTourStatus } from "@/modules/sales/confirmedTour/types/confirmed-tour.type";
import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
import type { QuotationStatus } from "@/modules/sales/quotation/types/quotation.type";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DonutChart } from "@/shared/components/ui/donut-chart";
import type { DonutSlice } from "@/shared/components/ui/donut-chart";
import { ProgressBars } from "@/shared/components/ui/progress-bars";
import type { ProgressBarItem } from "@/shared/components/ui/progress-bars";
import { StatCard } from "@/shared/components/ui/stat-card";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import {
  AlertCircle,
  ArrowRight,
  Banknote,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  HandCoins,
  Wallet,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso?: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

// ─── Status configs ───────────────────────────────────────────────────────────

const QUOTATION_STATUS_CONFIG: Record<QuotationStatus, { label: string; color: string; badgeCls: string }> = {
  draft:    { label: "Nháp",        color: "#9ca3af", badgeCls: "badge-neutral" },
  sent:     { label: "Đã gửi",      color: "#0EA5E9", badgeCls: "badge-sky" },
  approved: { label: "Chấp thuận",  color: "#22c55e", badgeCls: "badge-forest" },
  rejected: { label: "Từ chối",     color: "#ef4444", badgeCls: "badge-coral" },
  expired:  { label: "Hết hạn",     color: "#f59e0b", badgeCls: "badge-sand" },
};

const TOUR_STATUS_CONFIG: Record<ConfirmedTourStatus, { label: string; color: string; badgeCls: string }> = {
  draft:            { label: "Nháp",           color: "#d1d5db", badgeCls: "badge-neutral" },
  pending_approval: { label: "Chờ duyệt",      color: "#f59e0b", badgeCls: "badge-sand" },
  confirmed:        { label: "Đã xác nhận",    color: "#0EA5E9", badgeCls: "badge-sky" },
  in_operation:     { label: "Đang vận hành",  color: "#0D9488", badgeCls: "badge-ocean" },
  completed:        { label: "Hoàn thành",     color: "#22c55e", badgeCls: "badge-forest" },
  rejected:         { label: "Từ chối",        color: "#ef4444", badgeCls: "badge-coral" },
  cancelled:        { label: "Đã hủy",         color: "#f43f5e", badgeCls: "badge-coral" },
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();

  const quotations       = useMemo(() => quotationMockStore.getAll(), []);
  const confirmedTours   = useMemo(() => confirmedTourMockStore.getAll(), []);
  const customerPayments = useMemo(() => customerPaymentMockStore.getAll(), []);
  const vendorPayments   = useMemo(() => vendorPaymentMockStore.getAll(), []);

  // ── Quotation stats ──
  const quotationStats = useMemo(() => {
    const byStatus = Object.fromEntries(
      (Object.keys(QUOTATION_STATUS_CONFIG) as QuotationStatus[]).map((s) => [
        s,
        quotations.filter((q) => q.status === s).length,
      ])
    ) as Record<QuotationStatus, number>;
    return { total: quotations.length, byStatus, active: byStatus.draft + byStatus.sent };
  }, [quotations]);

  // ── Tour stats ──
  const tourStats = useMemo(() => {
    const byStatus = Object.fromEntries(
      (Object.keys(TOUR_STATUS_CONFIG) as ConfirmedTourStatus[]).map((s) => [
        s,
        confirmedTours.filter((t) => t.status === s).length,
      ])
    ) as Record<ConfirmedTourStatus, number>;
    return {
      total: confirmedTours.length,
      byStatus,
      active: byStatus.confirmed + byStatus.in_operation,
    };
  }, [confirmedTours]);

  // ── Customer payment stats ──
  const customerStats = useMemo(() => {
    let totalExpected = 0;
    let totalCollected = 0;
    const overdueItems: { tourCode: string; label: string; amount: number }[] = [];
    for (const cp of customerPayments) {
      totalExpected += cp.totalAmount;
      for (const inst of cp.installments) {
        totalCollected += inst.actualAmount ?? 0;
        if (inst.status === "overdue") {
          overdueItems.push({
            tourCode: cp.confirmedTourCode,
            label: inst.label,
            amount: inst.expectedAmount - (inst.actualAmount ?? 0),
          });
        }
      }
    }
    return { totalExpected, totalCollected, overdueItems };
  }, [customerPayments]);

  // ── Vendor payment stats ──
  const vendorStats = useMemo(() => {
    const pending = vendorPayments.filter((v) => v.status === "pending" || v.status === "partial");
    const totalExpected = vendorPayments.reduce((s, v) => s + v.expectedAmount, 0);
    const totalPaid = vendorPayments.reduce((s, v) => s + (v.actualAmount ?? 0), 0);
    const totalPending = pending.reduce((s, v) => s + (v.expectedAmount - (v.actualAmount ?? 0)), 0);
    const dueSoon = pending
      .filter((v) => { const d = daysUntil(v.dueDate); return d >= 0 && d <= 7; })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    return { pendingCount: pending.length, totalPending, dueSoon, totalExpected, totalPaid };
  }, [vendorPayments]);

  // ── Derived ──
  const collectedRatio = customerStats.totalExpected > 0
    ? Math.round((customerStats.totalCollected / customerStats.totalExpected) * 100) : 0;

  const upcomingTours = useMemo(
    () =>
      confirmedTours
        .filter((t) => ["confirmed", "in_operation"].includes(t.status) && daysUntil(t.departureDate) >= 0)
        .sort((a, b) => a.departureDate.localeCompare(b.departureDate))
        .slice(0, 5),
    [confirmedTours]
  );

  const toursNeedingApproval = useMemo(
    () => confirmedTours.filter((t) => t.status === "pending_approval"),
    [confirmedTours]
  );

  const quotationsAwaitingResponse = useMemo(
    () => quotations.filter((q) => q.status === "sent"),
    [quotations]
  );

  // ── Chart data ──
  const quotationDonutData: DonutSlice[] = (Object.keys(QUOTATION_STATUS_CONFIG) as QuotationStatus[]).map((s) => ({
    label: QUOTATION_STATUS_CONFIG[s].label,
    value: quotationStats.byStatus[s],
    color: QUOTATION_STATUS_CONFIG[s].color,
  }));

  const tourDonutData: DonutSlice[] = (Object.keys(TOUR_STATUS_CONFIG) as ConfirmedTourStatus[]).map((s) => ({
    label: TOUR_STATUS_CONFIG[s].label,
    value: tourStats.byStatus[s],
    color: TOUR_STATUS_CONFIG[s].color,
  }));

  const financialBars: ProgressBarItem[] = [
    {
      label: "Thu từ khách hàng",
      sub: `${customerPayments.length} phiếu thu`,
      value: customerStats.totalCollected,
      total: customerStats.totalExpected,
      color: "#22c55e",
      currency: "đ",
    },
    {
      label: "Chi cho nhà cung cấp",
      sub: `${vendorPayments.length} phiếu chi`,
      value: vendorStats.totalPaid,
      total: vendorStats.totalExpected,
      color: "#f43f5e",
    },
  ];

  return (
    <div className='space-y-6'>

      {/* ── Header ── */}
      <div>
        <h1 className='text-xl font-bold'>Tổng quan</h1>
        <p className='text-sm text-muted-foreground mt-0.5'>Cập nhật theo dữ liệu hệ thống hiện tại</p>
      </div>

      {/* ── KPI Cards ── */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          icon={FileText}
          iconBg='bg-sky-50' iconColor='text-sky-600'
          label='Báo giá đang mở'
          value={quotationStats.active}
          sub={`${quotationStats.byStatus.draft} nháp · ${quotationStats.byStatus.sent} đã gửi`}
          onClick={() => navigate(PATHS.SALES.QUOTATIONS)}
        />
        <StatCard
          icon={ClipboardCheck}
          iconBg='bg-teal-50' iconColor='text-teal-600'
          label='Tour đang hoạt động'
          value={tourStats.active}
          sub={`${tourStats.byStatus.confirmed} xác nhận · ${tourStats.byStatus.in_operation} vận hành`}
          onClick={() => navigate(PATHS.SALES.CONFIRMED_TOURS)}
        />
        <StatCard
          icon={Wallet}
          iconBg='bg-green-50' iconColor='text-green-600'
          label='Doanh thu đã thu'
          value={`${formatNumberVN(customerStats.totalCollected)}đ`}
          sub={`${collectedRatio}% / tổng ${formatNumberVN(customerStats.totalExpected)}đ`}
          subColor={collectedRatio < 50 ? "text-amber-600" : "text-green-600"}
          onClick={() => navigate(PATHS.ACCOUNTING.CUSTOMER_PAYMENTS)}
        />
        <StatCard
          icon={Banknote}
          iconBg='bg-rose-50' iconColor='text-rose-600'
          label='Phiếu chi chưa trả'
          value={vendorStats.pendingCount}
          sub={`Còn lại ~${formatNumberVN(vendorStats.totalPending)}đ`}
          subColor='text-rose-600'
          onClick={() => navigate(PATHS.ACCOUNTING.VENDOR_PAYMENTS)}
        />
      </div>

      {/* ── Charts row ── */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-semibold flex items-center gap-2'>
              <FileText className='w-4 h-4 text-sky-500' />
              Trạng thái báo giá
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={quotationDonutData} total={quotationStats.total} centerLabel='báo giá' />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-semibold flex items-center gap-2'>
              <Wallet className='w-4 h-4 text-green-500' />
              Tình hình tài chính
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBars items={financialBars} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-semibold flex items-center gap-2'>
              <ClipboardCheck className='w-4 h-4 text-teal-500' />
              Trạng thái tour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={tourDonutData} total={tourStats.total} centerLabel='tour' />
          </CardContent>
        </Card>
      </div>

      {/* ── Main content ── */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

        {/* Left: Urgent + Upcoming */}
        <div className='lg:col-span-2 space-y-4'>

          {/* Việc cần xử lý */}
          <Card>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-base flex items-center gap-2'>
                  <AlertCircle className='w-4 h-4 text-amber-500' />
                  Việc cần xử lý
                </CardTitle>
                <Badge variant='outline' className='text-amber-700 border-amber-300 bg-amber-50'>
                  {customerStats.overdueItems.length + toursNeedingApproval.length + quotationsAwaitingResponse.length} mục
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-1.5 pt-0'>
              {customerStats.overdueItems.length === 0 &&
                toursNeedingApproval.length === 0 &&
                quotationsAwaitingResponse.length === 0 && (
                  <div className='flex items-center gap-2 py-4 text-sm text-muted-foreground'>
                    <CheckCircle2 className='w-4 h-4 text-green-500' />
                    Không có việc gì cần xử lý. Tốt lắm!
                  </div>
                )}

              {customerStats.overdueItems.map((item, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between p-2.5 rounded-md bg-rose-50 border border-rose-100 cursor-pointer hover:bg-rose-100 transition-colors'
                  onClick={() => navigate(PATHS.ACCOUNTING.CUSTOMER_PAYMENTS)}>
                  <div className='flex items-center gap-2.5 min-w-0'>
                    <AlertCircle className='w-4 h-4 text-rose-500 shrink-0' />
                    <div className='min-w-0'>
                      <p className='text-sm font-medium text-rose-700 truncate'>Thanh toán quá hạn — {item.tourCode}</p>
                      <p className='text-xs text-rose-500 truncate'>{item.label} · còn nợ {formatNumberVN(item.amount)}đ</p>
                    </div>
                  </div>
                  <ArrowRight className='w-3.5 h-3.5 text-rose-400 shrink-0 ml-2' />
                </div>
              ))}

              {toursNeedingApproval.map((tour) => (
                <div
                  key={tour.id}
                  className='flex items-center justify-between p-2.5 rounded-md bg-amber-50 border border-amber-100 cursor-pointer hover:bg-amber-100 transition-colors'
                  onClick={() => navigate(PATHS.SALES.CONFIRMED_TOUR_DETAIL.replace(":id", tour.id))}>
                  <div className='flex items-center gap-2.5 min-w-0'>
                    <Clock className='w-4 h-4 text-amber-500 shrink-0' />
                    <div className='min-w-0'>
                      <p className='text-sm font-medium text-amber-800 truncate'>Tour chờ duyệt — {tour.code}</p>
                      <p className='text-xs text-amber-600 truncate'>{tour.customerName} · {tour.numberOfPeople} khách · {formatDate(tour.departureDate)}</p>
                    </div>
                  </div>
                  <ArrowRight className='w-3.5 h-3.5 text-amber-400 shrink-0 ml-2' />
                </div>
              ))}

              {quotationsAwaitingResponse.map((q) => (
                <div
                  key={q.id}
                  className='flex items-center justify-between p-2.5 rounded-md bg-sky-50 border border-sky-100 cursor-pointer hover:bg-sky-100 transition-colors'
                  onClick={() => navigate(PATHS.SALES.QUOTATION_DETAIL.replace(":id", q.id))}>
                  <div className='flex items-center gap-2.5 min-w-0'>
                    <FileText className='w-4 h-4 text-sky-500 shrink-0' />
                    <div className='min-w-0'>
                      <p className='text-sm font-medium text-sky-800 truncate'>Chờ phản hồi — {q.code}</p>
                      <p className='text-xs text-sky-600 truncate'>{q.customerName} · v{q.currentVersion} · Gửi {formatDate(q.sentAt)}</p>
                    </div>
                  </div>
                  <ArrowRight className='w-3.5 h-3.5 text-sky-400 shrink-0 ml-2' />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tour sắp khởi hành */}
          <Card>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-base flex items-center gap-2'>
                  <Calendar className='w-4 h-4 text-sky-500' />
                  Tour sắp khởi hành
                </CardTitle>
                <Button variant='ghost' size='sm' className='text-xs h-7 px-2' onClick={() => navigate(PATHS.SALES.CONFIRMED_TOURS)}>
                  Xem tất cả <ArrowRight className='w-3 h-3 ml-1' />
                </Button>
              </div>
            </CardHeader>
            <CardContent className='pt-0'>
              {upcomingTours.length === 0 ? (
                <p className='text-sm text-muted-foreground py-3'>Không có tour nào sắp khởi hành.</p>
              ) : (
                <div className='space-y-2'>
                  {upcomingTours.map((tour) => {
                    const days = daysUntil(tour.departureDate);
                    const cfg = TOUR_STATUS_CONFIG[tour.status];
                    return (
                      <div
                        key={tour.id}
                        className='flex items-center justify-between p-2.5 rounded-md border hover:bg-muted/40 cursor-pointer transition-colors'
                        onClick={() => navigate(PATHS.SALES.CONFIRMED_TOUR_DETAIL.replace(":id", tour.id))}>
                        <div className='flex items-center gap-3 min-w-0'>
                          <div className='text-center shrink-0 w-11'>
                            <div className={`text-sm font-bold ${days <= 3 ? "text-rose-600" : days <= 7 ? "text-amber-600" : "text-sky-600"}`}>
                              {days}
                            </div>
                            <div className='text-xs text-muted-foreground'>ngày</div>
                          </div>
                          <div className='w-px h-8 bg-border shrink-0' />
                          <div className='min-w-0'>
                            <p className='text-sm font-medium truncate'>{tour.customerName}</p>
                            <p className='text-xs text-muted-foreground truncate'>{tour.code} · {tour.numberOfPeople} khách · {formatDate(tour.departureDate)}</p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2 shrink-0 ml-2'>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badgeCls}`}>
                            {cfg.label}
                          </span>
                          <ArrowRight className='w-3.5 h-3.5 text-muted-foreground' />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Vendor due soon */}
        <div className='space-y-4'>
          {vendorStats.dueSoon.length > 0 && (
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base flex items-center gap-2'>
                  <HandCoins className='w-4 h-4 text-rose-500' />
                  Phiếu chi sắp đến hạn
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-0 space-y-2'>
                {vendorStats.dueSoon.map((vp) => {
                  const days = daysUntil(vp.dueDate);
                  return (
                    <div
                      key={vp.id}
                      className='p-2.5 rounded-md bg-rose-50 border border-rose-100 cursor-pointer hover:bg-rose-100 transition-colors'
                      onClick={() => navigate(PATHS.ACCOUNTING.VENDOR_PAYMENTS)}>
                      <div className='flex items-start justify-between gap-2'>
                        <div className='min-w-0'>
                          <p className='text-xs font-semibold text-rose-800 truncate'>{vp.vendorName}</p>
                          <p className='text-xs text-rose-600 truncate'>{vp.confirmedTourCode} · {formatNumberVN(vp.expectedAmount)} {vp.currency}</p>
                        </div>
                        <span className={`text-xs font-bold shrink-0 ${days === 0 ? "text-red-700" : "text-rose-600"}`}>
                          {days === 0 ? "Hôm nay!" : `${days}n`}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <Button variant='outline' size='sm' className='w-full text-xs h-7' onClick={() => navigate(PATHS.ACCOUNTING.VENDOR_PAYMENTS)}>
                  Xem tất cả phiếu chi
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick links */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>Truy cập nhanh</CardTitle>
            </CardHeader>
            <CardContent className='pt-0 space-y-2'>
              {[
                { label: "Tạo báo giá mới",   path: PATHS.SALES.QUOTATION_CREATE,              color: "text-sky-600 hover:bg-sky-50 border-sky-200" },
                { label: "Tạo Tour Xác Nhận", path: PATHS.SALES.CONFIRMED_TOUR_CREATE,          color: "text-teal-600 hover:bg-teal-50 border-teal-200" },
                { label: "Tạo phiếu thu",      path: PATHS.ACCOUNTING.CUSTOMER_PAYMENT_CREATE,  color: "text-green-600 hover:bg-green-50 border-green-200" },
                { label: "Tạo phiếu chi",      path: PATHS.ACCOUNTING.VENDOR_PAYMENT_CREATE,    color: "text-rose-600 hover:bg-rose-50 border-rose-200" },
              ].map((item) => (
                <button
                  key={item.path}
                  className={`w-full text-left text-sm font-medium px-3 py-2 rounded-md border transition-colors cursor-pointer ${item.color}`}
                  onClick={() => navigate(item.path)}>
                  + {item.label}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
