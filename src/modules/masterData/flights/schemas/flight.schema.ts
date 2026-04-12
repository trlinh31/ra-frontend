import { z } from "zod";

const flightDayGroupSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Trường này là bắt buộc"),
  days: z.array(z.number().min(0).max(6)).min(1, "Phải chọn ít nhất một ngày trong tuần"),
  price: z.number({ error: "Trường này là bắt buộc" }).min(0, "Giá phải lớn hơn hoặc bằng 0"),
});

const flightDateRangeSchema = z.object({
  from: z.string().min(1, "Trường này là bắt buộc"),
  to: z.string().min(1, "Trường này là bắt buộc"),
  dayGroups: z.array(flightDayGroupSchema).min(1, "Phải có ít nhất một nhóm ngày"),
});

export const flightPricingPeriodSchema = z.object({
  id: z.string(),
  label: z.string(),
  currency: z.string().min(1, "Trường này là bắt buộc"),
  dateRanges: z.array(flightDateRangeSchema).min(1, "Phải có ít nhất một khoảng ngày"),
});

export const flightSchema = z.object({
  // code: z.string().min(1, "Vui lòng nhập mã chuyến bay"),
  // airlineCode: z.string().min(1, "Vui lòng nhập mã hãng bay"),
  origin: z.string().min(1, "Vui lòng nhập mã điểm đi"),
  destination: z.string().min(1, "Vui lòng nhập mã điểm đến"),
  airline: z.string().min(1, "Vui lòng nhập tên hãng bay"),
  flightTime: z
    .string()
    .min(1, "Vui lòng nhập thời gian bay")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Thời gian không hợp lệ"),
  provider: z.string().min(1, "Vui lòng nhập nhà cung cấp"),
  fromCountry: z.string().min(1, "Vui lòng chọn quốc gia điểm đi"),
  toCountry: z.string().min(1, "Vui lòng chọn quốc gia điểm đến"),
  fromCity: z.string().min(1, "Vui lòng chọn thành phố điểm đi"),
  toCity: z.string().min(1, "Vui lòng chọn thành phố điểm đến"),
  notes: z.string(),
  isActive: z.boolean(),
  pricingPeriods: z.array(flightPricingPeriodSchema),
});

export type FlightFormValues = z.infer<typeof flightSchema>;
