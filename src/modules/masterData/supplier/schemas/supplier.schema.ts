import { z } from "zod";

export const supplierSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã nhà cung cấp"),
  name: z.string().min(1, "Vui lòng nhập tên nhà cung cấp"),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  city: z.string().min(1, "Vui lòng chọn thành phố"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  taxCode: z.string().min(1, "Vui lòng nhập mã số thuế"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  isActive: z.boolean(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
