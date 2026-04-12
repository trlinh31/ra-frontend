import { z } from "zod";

const groupTourDayGroupSchema = z.object({
  label: z.string().min(1, "Trường này là bắt buộc"),
  days: z.array(z.number().min(0).max(6)).min(1, "Phải chọn ít nhất một ngày trong tuần"),
  price: z.number({ error: "Trường này là bắt buộc" }).min(0, "Giá phải lớn hơn hoặc bằng 0"),
});

const groupTourDateRangeSchema = z.object({
  from: z.string().min(1, "Trường này là bắt buộc"),
  to: z.string().min(1, "Trường này là bắt buộc"),
  dayGroups: z.array(groupTourDayGroupSchema).min(1, "Phải có ít nhất một nhóm ngày"),
});

export const groupTourPricingPeriodSchema = z.object({
  currency: z.string().min(1, "Trường này là bắt buộc"),
  dateRanges: z.array(groupTourDateRangeSchema).min(1, "Phải có ít nhất một khoảng ngày"),
});

export const groupTourSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã tour"),
  tourName: z.string().min(1, "Vui lòng nhập tên tour"),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  city: z.string().min(1, "Vui lòng chọn thành phố"),
  supplier: z.string().min(1, "Vui lòng chọn nhà cung cấp"),
  content: z.string(),
  notes: z.string(),
  isActive: z.boolean(),
  pricingPeriods: z.array(groupTourPricingPeriodSchema),
});

export type GroupTourFormValues = z.infer<typeof groupTourSchema>;
