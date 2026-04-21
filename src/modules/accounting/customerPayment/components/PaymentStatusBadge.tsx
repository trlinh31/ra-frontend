import { PAYMENT_INSTALLMENT_STATUS_LABEL } from "@/modules/accounting/customerPayment/constants/customer-payment.constant";
import type { PaymentInstallmentStatus } from "@/modules/accounting/customerPayment/types/customer-payment.type";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

const statusStyles: Record<PaymentInstallmentStatus, string> = {
  pending: "bg-slate-100 text-slate-600 border-slate-200",
  partial: "bg-yellow-100 text-yellow-800 border-yellow-200",
  paid: "bg-green-100 text-green-800 border-green-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
};

export default function PaymentStatusBadge({ status }: { status: PaymentInstallmentStatus }) {
  return <Badge className={cn("border font-medium text-xs", statusStyles[status])}>{PAYMENT_INSTALLMENT_STATUS_LABEL[status]}</Badge>;
}
