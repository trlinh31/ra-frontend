import { z } from "zod";

export const installmentItemSchema = z.object({
  label: z.string().min(1, "Vui lòng nhập tên đợt"),
  dueDate: z.string().min(1, "Vui lòng chọn hạn thanh toán"),
  expectedAmount: z.coerce.number({ error: "Vui lòng nhập số tiền" }).min(0, "Số tiền phải ≥ 0"),
  note: z.string(),
});

export const createCustomerPaymentSchema = z.object({
  confirmedTourId: z.string().min(1, "Vui lòng chọn tour"),
  totalAmount: z.coerce.number({ error: "Vui lòng nhập tổng giá trị" }).min(0, "Tổng giá trị phải ≥ 0"),
  currency: z.string().min(1, "Vui lòng chọn tiền tệ"),
  installments: z.array(installmentItemSchema).min(1, "Phải có ít nhất 1 đợt thu"),
});

export const recordInstallmentSchema = z.object({
  actualAmount: z.coerce.number({ error: "Vui lòng nhập số tiền" }).min(0, "Số tiền phải ≥ 0"),
  paidAt: z.string().min(1, "Vui lòng chọn ngày nhận tiền"),
  paymentMethod: z.string().min(1, "Vui lòng chọn hình thức thanh toán"),
  note: z.string(),
});

export type CreateCustomerPaymentFormValues = z.infer<typeof createCustomerPaymentSchema>;
export type RecordInstallmentFormValues = z.infer<typeof recordInstallmentSchema>;
