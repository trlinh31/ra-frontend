import { PATHS } from "@/app/routes/route.constant";
import { StatCard } from "@/shared/components/ui/stat-card";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { Banknote, ClipboardCheck, FileText, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  quotationActive: number;
  quotationDraft: number;
  quotationSent: number;
  tourActive: number;
  tourConfirmed: number;
  tourInOperation: number;
  totalCollected: number;
  totalExpected: number;
  collectedRatio: number;
  vendorPendingCount: number;
  vendorTotalPending: number;
}

export default function KpiCards({
  quotationActive,
  quotationDraft,
  quotationSent,
  tourActive,
  tourConfirmed,
  tourInOperation,
  totalCollected,
  totalExpected,
  collectedRatio,
  vendorPendingCount,
  vendorTotalPending,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className='gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
      <StatCard
        icon={FileText}
        iconBg='bg-sky-50'
        iconColor='text-sky-600'
        label='Báo giá đang mở'
        value={quotationActive}
        sub={`${quotationDraft} nháp · ${quotationSent} đã gửi`}
        onClick={() => navigate(PATHS.SALES.QUOTATIONS)}
      />
      <StatCard
        icon={ClipboardCheck}
        iconBg='bg-teal-50'
        iconColor='text-teal-600'
        label='Tour đang hoạt động'
        value={tourActive}
        sub={`${tourConfirmed} xác nhận · ${tourInOperation} vận hành`}
        onClick={() => navigate(PATHS.SALES.CONFIRMED_TOURS)}
      />
      <StatCard
        icon={Wallet}
        iconBg='bg-green-50'
        iconColor='text-green-600'
        label='Doanh thu đã thu'
        value={`${formatNumberVN(totalCollected)}đ`}
        sub={`${collectedRatio}% / tổng ${formatNumberVN(totalExpected)}đ`}
        subColor={collectedRatio < 50 ? "text-amber-600" : "text-green-600"}
        onClick={() => navigate(PATHS.ACCOUNTING.CUSTOMER_PAYMENTS)}
      />
      <StatCard
        icon={Banknote}
        iconBg='bg-rose-50'
        iconColor='text-rose-600'
        label='Phiếu chi chưa trả'
        value={vendorPendingCount}
        sub={`Còn lại ~${formatNumberVN(vendorTotalPending)}đ`}
        subColor='text-rose-600'
        onClick={() => navigate(PATHS.ACCOUNTING.VENDOR_PAYMENTS)}
      />
    </div>
  );
}
