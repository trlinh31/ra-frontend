import { CONFIRMED_TOUR_STATUS_LABEL } from "@/modules/sales/confirmedTour/constants/confirmed-tour.constant";
import type { ConfirmedTourStatus } from "@/modules/sales/confirmedTour/types/confirmed-tour.type";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

const statusStyles: Record<ConfirmedTourStatus, string> = {
  draft: "bg-muted text-muted-foreground border-transparent",
  pending_approval: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  in_operation: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};

interface ConfirmedTourStatusBadgeProps {
  status: ConfirmedTourStatus;
}

export default function ConfirmedTourStatusBadge({ status }: ConfirmedTourStatusBadgeProps) {
  return <Badge className={cn("border font-medium text-xs", statusStyles[status])}>{CONFIRMED_TOUR_STATUS_LABEL[status]}</Badge>;
}
