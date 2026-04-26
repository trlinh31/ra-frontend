import { customerPaymentMockStore } from "@/modules/accounting/customerPayment/data/customer-payment.mock-store";
import { vendorPaymentMockStore } from "@/modules/accounting/vendorPayment/data/vendor-payment.mock-store";
import KpiCards from "@/modules/dashboard/components/KpiCards";
import QuickLinksCard from "@/modules/dashboard/components/QuickLinksCard";
import RevenueCharts from "@/modules/dashboard/components/RevenueCharts";
import StatusDonutCharts from "@/modules/dashboard/components/StatusDonutCharts";
import TasksCard from "@/modules/dashboard/components/TasksCard";
import UpcomingToursCard from "@/modules/dashboard/components/UpcomingToursCard";
import VendorDueSoonCard from "@/modules/dashboard/components/VendorDueSoonCard";
import { QUOTATION_STATUS_CONFIG, TOUR_STATUS_CONFIG } from "@/modules/dashboard/constants/dashboard.constant";
import { daysUntil } from "@/modules/dashboard/helpers/dashboard.helper";
import { confirmedTourMockStore } from "@/modules/sales/confirmedTour/data/confirmed-tour.mock-store";
import type { ConfirmedTourStatus } from "@/modules/sales/confirmedTour/types/confirmed-tour.type";
import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
import type { QuotationStatus } from "@/modules/sales/quotation/types/quotation.type";
import { Badge } from "@/shared/components/ui/badge";
import { useMemo } from "react";

export default function DashboardPage() {
  const quotations = useMemo(() => quotationMockStore.getAll(), []);
  const confirmedTours = useMemo(() => confirmedTourMockStore.getAll(), []);
  const customerPayments = useMemo(() => customerPaymentMockStore.getAll(), []);
  const vendorPayments = useMemo(() => vendorPaymentMockStore.getAll(), []);

  // ── Quotation stats ──
  const quotationStats = useMemo(() => {
    const byStatus = Object.fromEntries(
      (Object.keys(QUOTATION_STATUS_CONFIG) as QuotationStatus[]).map((s) => [s, quotations.filter((q) => q.status === s).length])
    ) as Record<QuotationStatus, number>;
    return { total: quotations.length, byStatus, active: byStatus.draft + byStatus.sent };
  }, [quotations]);

  // ── Tour stats ──
  const tourStats = useMemo(() => {
    const byStatus = Object.fromEntries(
      (Object.keys(TOUR_STATUS_CONFIG) as ConfirmedTourStatus[]).map((s) => [s, confirmedTours.filter((t) => t.status === s).length])
    ) as Record<ConfirmedTourStatus, number>;
    return { total: confirmedTours.length, byStatus, active: byStatus.confirmed + byStatus.in_operation };
  }, [confirmedTours]);

  // ── Customer payment stats ──
  const customerStats = useMemo(() => {
    let totalExpected = 0,
      totalCollected = 0;
    const overdueItems: { tourCode: string; label: string; amount: number }[] = [];
    for (const cp of customerPayments) {
      totalExpected += cp.totalAmount;
      for (const inst of cp.installments) {
        totalCollected += inst.actualAmount ?? 0;
        if (inst.status === "overdue") {
          overdueItems.push({ tourCode: cp.confirmedTourCode, label: inst.label, amount: inst.expectedAmount - (inst.actualAmount ?? 0) });
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
      .filter((v) => {
        const d = daysUntil(v.dueDate);
        return d >= 0 && d <= 7;
      })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    return { pendingCount: pending.length, totalPending, dueSoon, totalExpected, totalPaid };
  }, [vendorPayments]);

  const collectedRatio = customerStats.totalExpected > 0 ? Math.round((customerStats.totalCollected / customerStats.totalExpected) * 100) : 0;

  const upcomingTours = useMemo(
    () =>
      confirmedTours
        .filter((t) => ["confirmed", "in_operation"].includes(t.status) && daysUntil(t.departureDate) >= 0)
        .sort((a, b) => a.departureDate.localeCompare(b.departureDate))
        .slice(0, 5),
    [confirmedTours]
  );

  const toursNeedingApproval = useMemo(() => confirmedTours.filter((t) => t.status === "pending_approval"), [confirmedTours]);
  const quotationsAwaitingResponse = useMemo(() => quotations.filter((q) => q.status === "sent"), [quotations]);

  const todoCount = customerStats.overdueItems.length + toursNeedingApproval.length + quotationsAwaitingResponse.length;

  return (
    <div className='space-y-6'>
      {/* ── Header ── */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='font-bold text-xl'>Tổng quan</h1>
          <p className='mt-0.5 text-muted-foreground text-sm'>Dữ liệu cập nhật theo hệ thống</p>
        </div>
        {todoCount > 0 && (
          <Badge variant='outline' className='bg-amber-50 px-3 py-1 border-amber-300 text-amber-700 text-sm'>
            ⚠ {todoCount} việc cần xử lý
          </Badge>
        )}
      </div>

      {/* ── KPI Cards ── */}
      <KpiCards
        quotationActive={quotationStats.active}
        quotationDraft={quotationStats.byStatus.draft}
        quotationSent={quotationStats.byStatus.sent}
        tourActive={tourStats.active}
        tourConfirmed={tourStats.byStatus.confirmed}
        tourInOperation={tourStats.byStatus.in_operation}
        totalCollected={customerStats.totalCollected}
        totalExpected={customerStats.totalExpected}
        collectedRatio={collectedRatio}
        vendorPendingCount={vendorStats.pendingCount}
        vendorTotalPending={vendorStats.totalPending}
      />

      {/* ── Charts row 1: Area + Bar ── */}
      <RevenueCharts totalCollected={customerStats.totalCollected} totalPaid={vendorStats.totalPaid} />

      {/* ── Charts row 2: Donut × 2 ── */}
      <StatusDonutCharts
        quotationTotal={quotationStats.total}
        quotationByStatus={quotationStats.byStatus}
        tourTotal={tourStats.total}
        tourByStatus={tourStats.byStatus}
      />

      {/* ── Main content ── */}
      <div className='gap-6 grid grid-cols-1 lg:grid-cols-3'>
        {/* Left: Tasks + Upcoming tours */}
        <div className='space-y-4 lg:col-span-2'>
          <TasksCard
            overdueItems={customerStats.overdueItems}
            toursNeedingApproval={toursNeedingApproval}
            quotationsAwaitingResponse={quotationsAwaitingResponse}
          />
          <UpcomingToursCard upcomingTours={upcomingTours} />
        </div>

        {/* Right: Vendor due soon + Quick links */}
        <div className='space-y-4'>
          <VendorDueSoonCard dueSoon={vendorStats.dueSoon} />
          <QuickLinksCard />
        </div>
      </div>
    </div>
  );
}
