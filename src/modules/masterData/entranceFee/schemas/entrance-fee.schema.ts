import { z } from "zod";

const entranceFeeDayGroupSchema = z.object({
  label: z.string().min(1, "Trường này là bắt buộc"),
  days: z.array(z.number().min(0).max(6)).min(1, "Phải chọn ít nhất một ngày trong tuần"),
  price: z.number({ error: "Trường này là bắt buộc" }).min(0, "Giá phải lớn hơn hoặc bằng 0"),
});

const entranceFeeDateRangeSchema = z.object({
  from: z.string().min(1, "Trường này là bắt buộc"),
  to: z.string().min(1, "Trường này là bắt buộc"),
  dayGroups: z.array(entranceFeeDayGroupSchema).min(1, "Phải có ít nhất một nhóm ngày"),
});

export const entranceFeePricingPeriodSchema = z.object({
  currency: z.string().min(1, "Trường này là bắt buộc"),
  dateRanges: z.array(entranceFeeDateRangeSchema).min(1, "Phải có ít nhất một khoảng ngày"),
});

export const entranceFeeSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã phí vào cổng"),
  serviceName: z.string().min(1, "Vui lòng nhập tên dịch vụ"),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  city: z.string().min(1, "Vui lòng chọn thành phố"),
  notes: z.string(),
  isActive: z.boolean(),
  pricingPeriods: z.array(entranceFeePricingPeriodSchema),
});

export type EntranceFeeFormValues = z.infer<typeof entranceFeeSchema>;
