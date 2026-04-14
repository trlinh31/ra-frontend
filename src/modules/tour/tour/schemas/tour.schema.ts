import { daySchema } from "@/modules/tour/day/schemas/day.schema";
import { z } from "zod";

export const tourDayItemSchema = daySchema.extend({ kind: z.literal("day") });

export const tourGroupTourItemSchema = z.object({
  kind: z.literal("group_tour"),
  groupTourId: z.string().min(1, "Vui lòng chọn nhóm tour"),
  pricingPeriodId: z.string().min(1, "Vui lòng chọn giai đoạn giá"),
  dayGroupId: z.string().min(1, "Vui lòng chọn nhóm ngày"),
  name: z.string(),
  unitPrice: z.number(),
  currency: z.string(),
});

export const tourItineraryItemSchema = z.discriminatedUnion("kind", [tourDayItemSchema, tourGroupTourItemSchema]);

export const tourSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã tour"),
  name: z.string().min(1, "Vui lòng nhập tên tour"),
  description: z.string(),
  content: z.string(),
  numberOfPeople: z.number({ error: "Vui lòng nhập số người" }).min(1, "Số người phải ít nhất là 1"),
  itinerary: z.array(tourItineraryItemSchema).min(1, "Tour phải có ít nhất 1 mục lịch trình"),
});

export type TourDayItemFormValues = z.infer<typeof tourDayItemSchema>;
export type TourGroupTourItemFormValues = z.infer<typeof tourGroupTourItemSchema>;
export type TourItineraryItemFormValues = z.infer<typeof tourItineraryItemSchema>;
export type TourFormValues = z.infer<typeof tourSchema>;
