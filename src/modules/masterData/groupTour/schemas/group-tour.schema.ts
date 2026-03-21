import { z } from "zod";

export const groupTourSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã tour"),
  tourName: z.string().min(1, "Vui lòng nhập tên tour"),
  supplier: z.string().min(1, "Vui lòng nhập nhà cung cấp"),
  content: z.string(),
  price: z.number({ error: "Vui lòng nhập giá" }).min(0, "Giá không được âm"),
  notes: z.string(),
  isActive: z.boolean(),
});

export type GroupTourFormValues = z.infer<typeof groupTourSchema>;
