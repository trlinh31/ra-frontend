import { confirmedTourMockStore } from "@/modules/sales/confirmedTour/data/confirmed-tour.mock-store";
import type { ConfirmedTour } from "@/modules/sales/confirmedTour/types/confirmed-tour.type";
import { userMockStore } from "@/modules/userManagement/data/user.mock-store";
import PageHeader from "@/shared/components/common/PageHeader";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Eye, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/app/routes/route.constant";
import { SERVICE_STATUS_CLASS } from "../constants/operation.constant";
import type { ServiceExecutionStatus } from "../types/operation.type";

function getChecklistProgress(tour: ConfirmedTour): { done: number; confirmed: number; issue: number; total: number } {
  let done = 0, confirmed = 0, issue = 0, total = 0;
  tour.itinerary.forEach((item) => {
    if (item.kind === "day") {
      item.services.forEach((svc) => {
        total++;
        const s = tour.serviceChecklist?.[svc.id];
        if (s === "done") done++;
        else if (s === "confirmed") confirmed++;
        else if (s === "issue") issue++;
      });
    }
  });
  return { done, confirmed, issue, total };
}

const STATUS_BADGE: Record<string, string> = {
  in_operation: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-green-100 text-green-700 border-green-200",
};

const STATUS_LABEL: Record<string, string> = {
  in_operation: "Đang vận hành",
  completed: "Hoàn thành",
};

export default function OperatorToursPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const tours = useMemo(
    () =>
      confirmedTourMockStore
        .getAll()
        .filter((t) => t.status === "in_operation" || t.status === "completed"),
    []
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tours.filter(
      (t) =>
        t.code.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        (t.tourTemplateName ?? "").toLowerCase().includes(q)
    );
  }, [tours, search]);

  return (
    <div className='space-y-6'>
      <PageHeader title='Vận hành Tour' description='Danh sách tour đang thực hiện và đã hoàn thành' />

      {/* Search */}
      <div className='relative max-w-sm'>
        <Search className='top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2' />
        <Input
          className='pl-9'
          placeholder='Tìm mã tour, tên đoàn...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tour list */}
      <div className='space-y-3'>
        {filtered.length === 0 && (
          <Card>
            <CardContent className='py-10 text-center text-muted-foreground text-sm'>
              Không tìm thấy tour nào.
            </CardContent>
          </Card>
        )}
        {filtered.map((tour) => {
          const progress = getChecklistProgress(tour);
          const operator = userMockStore.getById(tour.assignedTo ?? "");
          const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

          return (
            <Card key={tour.id} className='hover:shadow-md transition-shadow'>
              <CardContent className='py-4'>
                <div className='flex flex-wrap justify-between items-start gap-4'>
                  {/* Left: tour info */}
                  <div className='flex-1 min-w-0 space-y-2'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <span className='font-semibold text-sm'>{tour.code}</span>
                      <Badge
                        variant='outline'
                        className={STATUS_BADGE[tour.status] ?? ""}
                      >
                        {STATUS_LABEL[tour.status] ?? tour.status}
                      </Badge>
                      {progress.issue > 0 && (
                        <Badge variant='outline' className={SERVICE_STATUS_CLASS["issue"]}>
                          {progress.issue} sự cố
                        </Badge>
                      )}
                    </div>

                    <p className='font-medium text-base'>{tour.customerName}</p>

                    <div className='flex flex-wrap gap-x-6 gap-y-1 text-muted-foreground text-xs'>
                      {tour.tourTemplateName && <span>🗺 {tour.tourTemplateName}</span>}
                      <span>📅 Khởi hành: {tour.departureDate}</span>
                      <span>👥 {tour.numberOfPeople} người</span>
                      {operator && <span>👤 Operator: {operator.fullName}</span>}
                    </div>

                    {/* Progress bar */}
                    {progress.total > 0 && (
                      <div className='space-y-1'>
                        <div className='flex justify-between text-xs'>
                          <span className='text-muted-foreground'>Tiến độ dịch vụ</span>
                          <span className='font-medium'>
                            {progress.done}/{progress.total} dịch vụ hoàn thành ({pct}%)
                          </span>
                        </div>
                        <div className='bg-gray-100 rounded-full h-2 overflow-hidden'>
                          <div
                            className='bg-green-500 h-2 rounded-full transition-all'
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className='flex gap-3 text-xs text-muted-foreground'>
                          {progress.confirmed > 0 && (
                            <span className='text-blue-600'>{progress.confirmed} đã xác nhận</span>
                          )}
                          {progress.issue > 0 && (
                            <span className='text-red-600'>{progress.issue} có vấn đề</span>
                          )}
                          <span>{progress.total - progress.done - progress.confirmed - progress.issue} chưa xử lý</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: action */}
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => navigate(PATHS.OPERATIONS.TOUR_DETAIL.replace(":id", tour.id))}
                  >
                    <Eye className='mr-2 w-4 h-4' />
                    Chi tiết vận hành
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
