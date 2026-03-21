import * as z from "zod";

export const TransportKmSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã phí vận chuyển"),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  city: z.string().min(1, "Vui lòng chọn thành phố"),
  category: z.string().min(1, "Vui lòng chọn loại phí"),
  km: z.number({ error: "Vui lòng nhập km" }).min(1, "Km phải lớn hơn 0"),
  price: z.number({ error: "Vui lòng nhập giá tiền" }).min(0, "Giá tiền không được âm"),
  notes: z.string(),
  isActive: z.boolean(),
});

export type TransportKmFormValues = z.infer<typeof TransportKmSchema>;
