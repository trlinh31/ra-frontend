import { z } from "zod";

export const comboPackageSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên gói combo"),
  maxGuests: z.number({ error: "Vui lòng nhập số người tối đa" }).min(1, "Số người phải lớn hơn 0"),
});

const dayGroupSchema = z.object({
  label: z.string().min(1, "Trường này là bắt buộc"),
  days: z
    .array(z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]))
    .min(1, "Phải chọn ít nhất một ngày trong tuần"),
  price: z.number({ error: "Trường này là bắt buộc" }).min(0, "Giá phải lớn hơn hoặc bằng 0"),
  comboPackageIndex: z.string().min(1, "Trường này là bắt buộc"),
});

const dateRangeSchema = z.object({
  from: z.string().min(1, "Trường này là bắt buộc"),
  to: z.string().min(1, "Trường này là bắt buộc"),
  dayGroups: z.array(dayGroupSchema).min(1, "Phải có ít nhất một nhóm ngày"),
});

const pricingPeriodSchema = z.object({
  currency: z.string().min(1, "Trường này là bắt buộc"),
  dateRanges: z.array(dateRangeSchema).min(1, "Phải có ít nhất một khoảng ngày"),
});

export const restaurantSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã nhà hàng"),
  name: z.string().min(1, "Vui lòng nhập tên nhà hàng"),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  city: z.string().min(1, "Vui lòng chọn thành phố"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  capacity: z.number().min(1, "Sức chứa phải lớn hơn 0"),
  comboPackages: z.array(comboPackageSchema).min(1, "Phải có ít nhất một gói combo"),
  pricingPeriods: z.array(pricingPeriodSchema),
  isActive: z.boolean(),
});

export type RestaurantFormValues = z.infer<typeof restaurantSchema>;
