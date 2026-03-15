import { z } from "zod";

export const visaGroupSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên nhóm"),
});
export type VisaGroupFormValues = z.infer<typeof visaGroupSchema>;

export const visaServiceItemSchema = z.object({
  groupId: z.string().min(1, "Vui lòng chọn nhóm"),
  serviceName: z.string().min(1, "Vui lòng nhập tên dịch vụ"),
  priceUsd: z.preprocess((val) => (val === "" || val == null ? undefined : Number(val)), z.number().min(0, "Giá không được âm").optional()),
  priceUnit: z.string().optional().default(""),
  description: z.string().optional().default(""),
  pickupLocation: z.string().optional().default(""),
});
export type VisaServiceItemFormValues = z.infer<typeof visaServiceItemSchema>;
