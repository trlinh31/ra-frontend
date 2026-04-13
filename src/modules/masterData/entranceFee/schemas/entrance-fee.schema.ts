import { z } from "zod";

export const entranceFeeTicketTypeSchema = z.object({
  name: z.string().min(1, "Trường này là bắt buộc"),
  note: z.string(),
});

const entranceFeeDayGroupSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Trường này là bắt buộc"),
  days: z.array(z.number().min(0).max(6)).min(1, "Phải chọn ít nhất một ngày trong tuần"),
  ticketTypeIndex: z.string().min(1, "Trường này là bắt buộc"),
  price: z.number({ error: "Trường này là bắt buộc" }).min(0, "Giá phải lớn hơn hoặc bằng 0"),
});

const entranceFeeDateRangeSchema = z.object({
  from: z.string().min(1, "Trường này là bắt buộc"),
  to: z.string().min(1, "Trường này là bắt buộc"),
  dayGroups: z.array(entranceFeeDayGroupSchema).min(1, "Phải có ít nhất một nhóm ngày"),
});

export const entranceFeePricingPeriodSchema = z.object({
  id: z.string(),
  label: z.string(),
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
  ticketTypes: z.array(entranceFeeTicketTypeSchema).min(1, "Phải có ít nhất một loại đối tượng"),
  pricingPeriods: z.array(entranceFeePricingPeriodSchema),
});

export type EntranceFeeFormValues = z.infer<typeof entranceFeeSchema>;
