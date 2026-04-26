import { PATHS } from "@/app/routes/route.constant";
import type { VendorPayment } from "@/modules/accounting/vendorPayment/types/vendor-payment.type";
import { daysUntil } from "@/modules/dashboard/helpers/dashboard.helper";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { HandCoins } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  dueSoon: VendorPayment[];
}

export default function VendorDueSoonCard({ dueSoon }: Props) {
  const navigate = useNavigate();

  if (dueSoon.length === 0) return null;

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-base'>
          <HandCoins className='w-4 h-4 text-rose-500' />
          Phiếu chi sắp đến hạn
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-2 pt-0'>
        {dueSoon.map((vp) => {
          const days = daysUntil(vp.dueDate);
          return (
            <div
              key={vp.id}
              className='bg-rose-50 hover:bg-rose-100 p-2.5 border border-rose-100 rounded-md transition-colors cursor-pointer'
              onClick={() => navigate(PATHS.ACCOUNTING.VENDOR_PAYMENTS)}>
              <div className='flex justify-between items-start gap-2'>
                <div className='min-w-0'>
                  <p className='font-semibold text-rose-800 text-xs truncate'>{vp.vendorName}</p>
                  <p className='text-rose-600 text-xs truncate'>
                    {vp.confirmedTourCode} · {formatNumberVN(vp.expectedAmount)} {vp.currency}
                  </p>
                </div>
                <span className={`text-xs font-bold shrink-0 ${days === 0 ? "text-red-700" : "text-rose-600"}`}>
                  {days === 0 ? "Hôm nay!" : `${days}n`}
                </span>
              </div>
            </div>
          );
        })}
        <Button variant='outline' size='sm' className='w-full h-7 text-xs' onClick={() => navigate(PATHS.ACCOUNTING.VENDOR_PAYMENTS)}>
          Xem tất cả phiếu chi
        </Button>
      </CardContent>
    </Card>
  );
}
