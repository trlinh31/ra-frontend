import { QUOTATION_STATUS_LABEL } from "@/modules/sales/quotation/constants/quotation.constant";
import type { QuotationStatus } from "@/modules/sales/quotation/types/quotation.type";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

const statusStyles: Record<QuotationStatus, string> = {
  draft: "bg-muted text-muted-foreground border-transparent",
  sent: "bg-blue-100 text-blue-800 border-blue-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  expired: "bg-slate-100 text-slate-500 border-slate-200",
};

interface QuotationStatusBadgeProps {
  status: QuotationStatus;
}

export default function QuotationStatusBadge({ status }: QuotationStatusBadgeProps) {
  return <Badge className={cn("border font-medium text-xs", statusStyles[status])}>{QUOTATION_STATUS_LABEL[status]}</Badge>;
}
