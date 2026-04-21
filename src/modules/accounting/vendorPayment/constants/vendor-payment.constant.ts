import type { VendorPaymentStatus } from "@/modules/accounting/vendorPayment/types/vendor-payment.type";
import type { SelectOption } from "@/shared/components/common/AppSelect/AppSelect";

export const VENDOR_PAYMENT_STATUS_LABEL: Record<VendorPaymentStatus, string> = {
  pending: "Chờ thanh toán",
  partial: "Đã chi một phần",
  paid: "Đã thanh toán",
  overdue: "Quá hạn",
};

export const VENDOR_PAYMENT_STATUS_OPTIONS: SelectOption[] = (Object.entries(VENDOR_PAYMENT_STATUS_LABEL) as [VendorPaymentStatus, string][]).map(
  ([value, label]) => ({ value, label })
);

export const VENDOR_TYPE_OPTIONS: SelectOption[] = [
  { value: "hotel", label: "Khách sạn" },
  { value: "restaurant", label: "Nhà hàng" },
  { value: "transport", label: "Vận chuyển" },
  { value: "flight", label: "Chuyến bay" },
  { value: "tour_guide", label: "Hướng dẫn viên" },
  { value: "visa", label: "Visa / Fast Track" },
  { value: "entrance_fee", label: "Phí vào cổng" },
  { value: "group_tour", label: "Nhóm Tour" },
  { value: "other", label: "Khác" },
];

export const VENDOR_TYPE_LABEL: Record<string, string> = Object.fromEntries(VENDOR_TYPE_OPTIONS.map((o) => [o.value, o.label]));
