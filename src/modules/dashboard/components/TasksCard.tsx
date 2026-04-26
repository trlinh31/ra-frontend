import { PATHS } from "@/app/routes/route.constant";
import { formatDate } from "@/modules/dashboard/helpers/dashboard.helper";
import type { ConfirmedTour } from "@/modules/sales/confirmedTour/types/confirmed-tour.type";
import type { Quotation } from "@/modules/sales/quotation/types/quotation.type";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { AlertCircle, ArrowRight, CheckCircle2, Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OverdueItem {
  tourCode: string;
  label: string;
  amount: number;
}

interface Props {
  overdueItems: OverdueItem[];
  toursNeedingApproval: ConfirmedTour[];
  quotationsAwaitingResponse: Quotation[];
}

export default function TasksCard({ overdueItems, toursNeedingApproval, quotationsAwaitingResponse }: Props) {
  const navigate = useNavigate();
  const todoCount = overdueItems.length + toursNeedingApproval.length + quotationsAwaitingResponse.length;

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex justify-between items-center'>
          <CardTitle className='flex items-center gap-2 text-base'>
            <AlertCircle className='w-4 h-4 text-amber-500' />
            Việc cần xử lý
          </CardTitle>
          {todoCount > 0 && (
            <Badge variant='outline' className='bg-amber-50 border-amber-300 text-amber-700'>
              {todoCount} mục
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className='space-y-1.5 pt-0'>
        {todoCount === 0 && (
          <div className='flex items-center gap-2 py-4 text-muted-foreground text-sm'>
            <CheckCircle2 className='w-4 h-4 text-green-500' />
            Không có việc gì cần xử lý. Tốt lắm!
          </div>
        )}

        {overdueItems.map((item, i) => (
          <div
            key={i}
            className='flex justify-between items-center bg-rose-50 hover:bg-rose-100 p-2.5 border border-rose-100 rounded-md transition-colors cursor-pointer'
            onClick={() => navigate(PATHS.ACCOUNTING.CUSTOMER_PAYMENTS)}>
            <div className='flex items-center gap-2.5 min-w-0'>
              <AlertCircle className='w-4 h-4 text-rose-500 shrink-0' />
              <div className='min-w-0'>
                <p className='font-medium text-rose-700 text-sm truncate'>Thanh toán quá hạn — {item.tourCode}</p>
                <p className='text-rose-500 text-xs truncate'>
                  {item.label} · còn nợ {formatNumberVN(item.amount)}đ
                </p>
              </div>
            </div>
            <ArrowRight className='ml-2 w-3.5 h-3.5 text-rose-400 shrink-0' />
          </div>
        ))}

        {toursNeedingApproval.map((tour) => (
          <div
            key={tour.id}
            className='flex justify-between items-center bg-amber-50 hover:bg-amber-100 p-2.5 border border-amber-100 rounded-md transition-colors cursor-pointer'
            onClick={() => navigate(PATHS.SALES.CONFIRMED_TOUR_DETAIL.replace(":id", tour.id))}>
            <div className='flex items-center gap-2.5 min-w-0'>
              <Clock className='w-4 h-4 text-amber-500 shrink-0' />
              <div className='min-w-0'>
                <p className='font-medium text-amber-800 text-sm truncate'>Tour chờ duyệt — {tour.code}</p>
                <p className='text-amber-600 text-xs truncate'>
                  {tour.customerName} · {tour.numberOfPeople} khách · {formatDate(tour.departureDate)}
                </p>
              </div>
            </div>
            <ArrowRight className='ml-2 w-3.5 h-3.5 text-amber-400 shrink-0' />
          </div>
        ))}

        {quotationsAwaitingResponse.map((q) => (
          <div
            key={q.id}
            className='flex justify-between items-center bg-sky-50 hover:bg-sky-100 p-2.5 border border-sky-100 rounded-md transition-colors cursor-pointer'
            onClick={() => navigate(PATHS.SALES.QUOTATION_DETAIL.replace(":id", q.id))}>
            <div className='flex items-center gap-2.5 min-w-0'>
              <FileText className='w-4 h-4 text-sky-500 shrink-0' />
              <div className='min-w-0'>
                <p className='font-medium text-sky-800 text-sm truncate'>Chờ phản hồi — {q.code}</p>
                <p className='text-sky-600 text-xs truncate'>
                  {q.customerName} · v{q.currentVersion} · Gửi {formatDate(q.sentAt)}
                </p>
              </div>
            </div>
            <ArrowRight className='ml-2 w-3.5 h-3.5 text-sky-400 shrink-0' />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
