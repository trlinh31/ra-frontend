import { z } from "zod";

export const createVendorPaymentSchema = z.object({
  confirmedTourId: z.string().min(1, "Vui lòng chọn tour"),
  vendorName: z.string().min(1, "Vui lòng nhập tên Vendor"),
  vendorType: z.string().min(1, "Vui lòng chọn loại Vendor"),
  serviceDescription: z.string().min(1, "Vui lòng mô tả dịch vụ"),
  expectedAmount: z.number({ error: "Vui lòng nhập số tiền" }).min(0, "Số tiền phải ≥ 0"),
  currency: z.string().min(1, "Vui lòng chọn tiền tệ"),
  dueDate: z.string().min(1, "Vui lòng chọn hạn thanh toán"),
  note: z.string(),
});

export const recordVendorPaymentSchema = z.object({
  actualAmount: z.number({ error: "Vui lòng nhập số tiền" }).min(0, "Số tiền phải ≥ 0"),
  paidAt: z.string().min(1, "Vui lòng chọn ngày thanh toán"),
  paymentMethod: z.string().min(1, "Vui lòng chọn hình thức thanh toán"),
  note: z.string(),
});

export type CreateVendorPaymentFormValues = z.infer<typeof createVendorPaymentSchema>;
export type RecordVendorPaymentFormValues = z.infer<typeof recordVendorPaymentSchema>;
