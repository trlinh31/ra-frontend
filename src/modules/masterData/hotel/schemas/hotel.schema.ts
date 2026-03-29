import { z } from "zod";

export const roomTypeSchema = z.object({
  name: z.string().min(1, "Trường này là bắt buộc"),
  maxGuests: z.number({ error: "Trường này là bắt buộc" }).min(1, "Số lượng khách mỗi phòng phải lớn hơn 0"),
  note: z.string(),
});

const dateRangeSchema = z.object({
  from: z.string().min(1, "Trường này là bắt buộc"),
  to: z.string().min(1, "Trường này là bắt buộc"),
});

const dayGroupSchema = z.object({
  label: z.string().min(1, "Trường này là bắt buộc"),
  days: z.array(z.number().min(0).max(6)).min(1, "Phải chọn ít nhất một ngày trong tuần"),
});

const dayGroupPriceSchema = z.object({
  price: z.number({ error: "Trường này là bắt buộc" }).min(0, "Giá phải lớn hơn hoặc bằng 0"),
});

const roomTypePricingSchema = z.object({
  dayGroupPrices: z.array(dayGroupPriceSchema),
});

export const pricingPeriodSchema = z.object({
  dateRanges: z.array(dateRangeSchema).min(1, "Phải có ít nhất một khoảng ngày"),
  dayGroups: z.array(dayGroupSchema).min(1, "Phải có ít nhất một nhóm ngày"),
  prices: z.array(roomTypePricingSchema),
});

export const hotelSchema = z.object({
  code: z.string().min(1, "Trường này là bắt buộc"),
  name: z.string().min(1, "Trường này là bắt buộc"),
  rate: z.string().min(1, "Trường này là bắt buộc"),
  country: z.string().min(1, "Trường này là bắt buộc"),
  city: z.string().min(1, "Trường này là bắt buộc"),
  address: z.string().min(1, "Trường này là bắt buộc"),
  roomTypes: z.array(roomTypeSchema).min(1, "Phải có ít nhất một loại phòng"),
  pricingPeriods: z.array(pricingPeriodSchema),
  note: z.string(),
  supplier: z.string().min(1, "Trường này là bắt buộc"),
  isActive: z.boolean(),
});

export type HotelFormValues = z.infer<typeof hotelSchema>;
