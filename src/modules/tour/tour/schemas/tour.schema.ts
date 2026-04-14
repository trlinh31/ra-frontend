import { z } from "zod";

export const tourDaySchema = z.object({
  dayId: z.string().min(1, "Vui lòng chọn ngày"),
  order: z.number(),
});

export const tourGroupTourSchema = z.object({
  groupTourId: z.string().min(1, "Vui lòng chọn nhóm tour"),
  pricingPeriodId: z.string().min(1, "Vui lòng chọn giai đoạn giá"),
  dayGroupId: z.string().min(1, "Vui lòng chọn nhóm ngày"),
  name: z.string(),
  unitPrice: z.number(),
  currency: z.string(),
});

export const tourSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã tour"),
  name: z.string().min(1, "Vui lòng nhập tên tour"),
  description: z.string(),
  content: z.string(),
  numberOfPeople: z.number({ error: "Vui lòng nhập số người" }).min(1, "Số người phải ít nhất là 1"),
  groupTours: z.array(tourGroupTourSchema).optional(),
  days: z.array(tourDaySchema).min(1, "Tour phải có ít nhất 1 ngày"),
});

export type TourDayFormValues = z.infer<typeof tourDaySchema>;
export type TourGroupTourFormValues = z.infer<typeof tourGroupTourSchema>;
export type TourFormValues = z.infer<typeof tourSchema>;
