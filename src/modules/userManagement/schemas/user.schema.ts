import { z } from "zod";

export const userSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã người dùng"),
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "SALE_MANAGER", "SELLER", "OPERATION_MANAGER", "OPERATOR", "ACCOUNTANT_MANAGER", "ACCOUNTANT"], {
    required_error: "Vui lòng chọn vai trò",
  }),
  isActive: z.boolean(),
  note: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;
