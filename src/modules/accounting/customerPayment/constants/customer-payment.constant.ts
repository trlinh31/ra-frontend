import type { PaymentInstallmentStatus } from "@/modules/accounting/customerPayment/types/customer-payment.type";
import type { SelectOption } from "@/shared/components/common/AppSelect/AppSelect";

export const PAYMENT_INSTALLMENT_STATUS_LABEL: Record<PaymentInstallmentStatus, string> = {
  pending: "Chờ thanh toán",
  partial: "Thu một phần",
  paid: "Đã thu đủ",
  overdue: "Quá hạn",
};

export const PAYMENT_INSTALLMENT_STATUS_OPTIONS: SelectOption[] = (
  Object.entries(PAYMENT_INSTALLMENT_STATUS_LABEL) as [PaymentInstallmentStatus, string][]
).map(([value, label]) => ({ value, label }));

export const PAYMENT_METHOD_OPTIONS: SelectOption[] = [
  { value: "bank_transfer", label: "Chuyển khoản ngân hàng" },
  { value: "cash", label: "Tiền mặt" },
  { value: "credit_card", label: "Thẻ tín dụng / ghi nợ" },
  { value: "e_wallet", label: "Ví điện tử (Momo, ZaloPay...)" },
];

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  bank_transfer: "Chuyển khoản",
  cash: "Tiền mặt",
  credit_card: "Thẻ tín dụng",
  e_wallet: "Ví điện tử",
};
