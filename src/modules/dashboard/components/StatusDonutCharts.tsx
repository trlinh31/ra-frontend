import { QUOTATION_STATUS_CONFIG, TOUR_STATUS_CONFIG } from "@/modules/dashboard/constants/dashboard.constant";
import type { ConfirmedTourStatus } from "@/modules/sales/confirmedTour/types/confirmed-tour.type";
import type { QuotationStatus } from "@/modules/sales/quotation/types/quotation.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DonutChart } from "@/shared/components/ui/chart-donut";
import { ClipboardCheck, FileText } from "lucide-react";

interface Props {
  quotationTotal: number;
  quotationByStatus: Record<QuotationStatus, number>;
  tourTotal: number;
  tourByStatus: Record<ConfirmedTourStatus, number>;
}

export default function StatusDonutCharts({ quotationTotal, quotationByStatus, tourTotal, tourByStatus }: Props) {
  const quotationDonutData = (Object.keys(QUOTATION_STATUS_CONFIG) as QuotationStatus[]).map((s) => ({
    label: QUOTATION_STATUS_CONFIG[s].label,
    value: quotationByStatus[s],
    color: QUOTATION_STATUS_CONFIG[s].color,
  }));

  const tourDonutData = (Object.keys(TOUR_STATUS_CONFIG) as ConfirmedTourStatus[]).map((s) => ({
    label: TOUR_STATUS_CONFIG[s].label,
    value: tourByStatus[s],
    color: TOUR_STATUS_CONFIG[s].color,
  }));

  return (
    <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
      <Card>
        <CardHeader className='pb-1'>
          <CardTitle className='flex items-center gap-2 font-semibold text-sm'>
            <FileText className='w-4 h-4 text-sky-500' />
            Phân bố trạng thái báo giá
          </CardTitle>
        </CardHeader>
        <CardContent className='flex justify-center pt-2'>
          <DonutChart data={quotationDonutData} total={quotationTotal} centerLabel='báo giá' />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-1'>
          <CardTitle className='flex items-center gap-2 font-semibold text-sm'>
            <ClipboardCheck className='w-4 h-4 text-teal-500' />
            Phân bố trạng thái tour
          </CardTitle>
        </CardHeader>
        <CardContent className='flex justify-center pt-2'>
          <DonutChart data={tourDonutData} total={tourTotal} centerLabel='tour' />
        </CardContent>
      </Card>
    </div>
  );
}
