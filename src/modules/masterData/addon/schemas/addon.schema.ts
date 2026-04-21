import { z } from "zod";

export const addonServiceSchema = z.object({
  name: z.string().min(1, "Tên dịch vụ là bắt buộc"),
  price: z.number({ error: "Đơn giá là bắt buộc" }).min(0, "Đơn giá phải lớn hơn hoặc bằng 0"),
  currency: z.string().min(1, "Tiền tệ là bắt buộc"),
  description: z.string(),
});

export type AddonServiceFormValues = z.infer<typeof addonServiceSchema>;
