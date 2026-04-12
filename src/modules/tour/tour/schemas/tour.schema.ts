import { z } from "zod";

export const tourDaySchema = z.object({
  dayId: z.string().min(1, "Vui lòng chọn ngày"),
  order: z.number(),
});

export const tourSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã tour"),
  name: z.string().min(1, "Vui lòng nhập tên tour"),
  description: z.string(),
  content: z.string(),
  numberOfPeople: z.number({ error: "Vui lòng nhập số người" }).min(1, "Số người phải ít nhất là 1"),
  days: z.array(tourDaySchema).min(1, "Tour phải có ít nhất 1 ngày"),
});

export type TourDayFormValues = z.infer<typeof tourDaySchema>;
export type TourFormValues = z.infer<typeof tourSchema>;
