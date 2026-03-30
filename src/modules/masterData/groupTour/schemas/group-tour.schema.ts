import { z } from "zod";

export const groupTourSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã tour"),
  tourName: z.string().min(1, "Vui lòng nhập tên tour"),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  city: z.string().min(1, "Vui lòng chọn thành phố"),
  supplier: z.string().min(1, "Vui lòng chọn nhà cung cấp"),
  currency: z.string().min(1, "Vui lòng chọn đơn vị tiền tệ"),
  content: z.string(),
  price: z.number({ error: "Vui lòng nhập giá" }).min(0, "Giá không được âm"),
  notes: z.string(),
  isActive: z.boolean(),
});

export type GroupTourFormValues = z.infer<typeof groupTourSchema>;
