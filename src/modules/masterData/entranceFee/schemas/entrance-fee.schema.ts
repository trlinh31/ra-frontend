import { z } from "zod";

export const entranceFeeSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã phí vào cổng"),
  serviceName: z.string().min(1, "Vui lòng nhập tên dịch vụ"),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  city: z.string().min(1, "Vui lòng chọn thành phố"),
  price: z.number({ error: "Vui lòng nhập giá tiền" }).min(0, "Giá tiền không được âm"),
  notes: z.string(),
  isActive: z.boolean(),
});

export type EntranceFeeFormValues = z.infer<typeof entranceFeeSchema>;
