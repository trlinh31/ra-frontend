import { AREA_SERIES, BAR_SERIES, MONTHLY_TREND } from "@/modules/dashboard/constants/dashboard.constant";
import { compact } from "@/modules/dashboard/helpers/dashboard.helper";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { AreaChart } from "@/shared/components/ui/chart-area";
import { BarChart } from "@/shared/components/ui/chart-bar";
import { TrendingUp, Wallet } from "lucide-react";

interface Props {
  totalCollected: number;
  totalPaid: number;
}

export default function RevenueCharts({ totalCollected, totalPaid }: Props) {
  const barData = [
    { label: "Q4/25", thu: 108_000_000, chi: 79_700_000 },
    { label: "Q1/26", thu: 94_000_000, chi: 68_000_000 },
    { label: "T4/26", thu: totalCollected || 78_000_000, chi: totalPaid || 57_600_000 },
  ];

  return (
    <div className='gap-4 grid grid-cols-1 lg:grid-cols-5'>
      <Card className='lg:col-span-3'>
        <CardHeader className='pb-2'>
          <CardTitle className='flex items-center gap-2 font-semibold text-sm'>
            <TrendingUp className='w-4 h-4 text-green-500' />
            Xu hướng doanh thu & chi phí (6 tháng)
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <AreaChart data={MONTHLY_TREND} series={AREA_SERIES} formatY={(v) => compact(v)} height={210} />
        </CardContent>
      </Card>

      <Card className='lg:col-span-2'>
        <CardHeader className='pb-2'>
          <CardTitle className='flex items-center gap-2 font-semibold text-sm'>
            <Wallet className='w-4 h-4 text-sky-500' />
            So sánh Thu / Chi
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <BarChart data={barData} series={BAR_SERIES} formatY={(v) => compact(v)} height={210} />
        </CardContent>
      </Card>
    </div>
  );
}
