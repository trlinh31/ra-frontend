import { PATHS } from "@/app/routes/route.constant";
import { TOUR_STATUS_CONFIG } from "@/modules/dashboard/constants/dashboard.constant";
import { daysUntil, formatDate } from "@/modules/dashboard/helpers/dashboard.helper";
import type { ConfirmedTour } from "@/modules/sales/confirmedTour/types/confirmed-tour.type";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  upcomingTours: ConfirmedTour[];
}

export default function UpcomingToursCard({ upcomingTours }: Props) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex justify-between items-center'>
          <CardTitle className='flex items-center gap-2 text-base'>
            <Calendar className='w-4 h-4 text-sky-500' />
            Tour sắp khởi hành
          </CardTitle>
          <Button variant='ghost' size='sm' className='px-2 h-7 text-xs' onClick={() => navigate(PATHS.SALES.CONFIRMED_TOURS)}>
            Xem tất cả <ArrowRight className='ml-1 w-3 h-3' />
          </Button>
        </div>
      </CardHeader>
      <CardContent className='pt-0'>
        {upcomingTours.length === 0 ? (
          <p className='py-3 text-muted-foreground text-sm'>Không có tour nào sắp khởi hành.</p>
        ) : (
          <div className='space-y-2'>
            {upcomingTours.map((tour) => {
              const days = daysUntil(tour.departureDate);
              const cfg = TOUR_STATUS_CONFIG[tour.status];
              return (
                <div
                  key={tour.id}
                  className='flex justify-between items-center hover:bg-muted/40 p-2.5 border rounded-md transition-colors cursor-pointer'
                  onClick={() => navigate(PATHS.SALES.CONFIRMED_TOUR_DETAIL.replace(":id", tour.id))}>
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='w-11 text-center shrink-0'>
                      <div className={`text-sm font-bold ${days <= 3 ? "text-rose-600" : days <= 7 ? "text-amber-600" : "text-sky-600"}`}>{days}</div>
                      <div className='text-muted-foreground text-xs'>ngày</div>
                    </div>
                    <div className='bg-border w-px h-8 shrink-0' />
                    <div className='min-w-0'>
                      <p className='font-medium text-sm truncate'>{tour.customerName}</p>
                      <p className='text-muted-foreground text-xs truncate'>
                        {tour.code} · {tour.numberOfPeople} khách · {formatDate(tour.departureDate)}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 ml-2 shrink-0'>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${cfg.badgeCls}`}>{cfg.label}</span>
                    <ArrowRight className='w-3.5 h-3.5 text-muted-foreground' />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
