import { z } from "zod";

export const installmentItemSchema = z.object({
  label: z.string().min(1, "Vui lòng nhập tên đợt"),
  dueDate: z.string().min(1, "Vui lòng chọn hạn thanh toán"),
  expectedAmount: z.number({ error: "Vui lòng nhập số tiền" }).min(0, "Số tiền phải ≥ 0"),
  note: z.string(),
});

export const createCustomerPaymentSchema = z
  .object({
    confirmedTourId: z.string().min(1, "Vui lòng chọn tour"),
    totalAmount: z.number({ error: "Vui lòng nhập tổng giá trị" }).min(0, "Tổng giá trị phải ≥ 0"),
    currency: z.string().min(1, "Vui lòng chọn tiền tệ"),
    customerPhone: z.string().optional(),
    customerEmail: z.string().optional(),
    installments: z.array(installmentItemSchema).min(1, "Phải có ít nhất 1 đợt thu"),
  })
  .superRefine((data, ctx) => {
    const sum = data.installments.reduce((acc, inst) => acc + (inst.expectedAmount ?? 0), 0);
    if (data.totalAmount > 0 && Math.abs(sum - data.totalAmount) > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Tổng các đợt (${sum.toLocaleString("vi-VN")}) phải bằng tổng hợp đồng (${data.totalAmount.toLocaleString("vi-VN")})`,
        path: ["installments"],
      });
    }
  });

export const recordInstallmentSchema = z.object({
  actualAmount: z.number({ error: "Vui lòng nhập số tiền" }).min(0, "Số tiền phải ≥ 0"),
  paidAt: z.string().min(1, "Vui lòng chọn ngày nhận tiền"),
  paymentMethod: z.string().min(1, "Vui lòng chọn hình thức thanh toán"),
  note: z.string(),
});

export type CreateCustomerPaymentFormValues = z.infer<typeof createCustomerPaymentSchema>;
export type RecordInstallmentFormValues = z.infer<typeof recordInstallmentSchema>;
