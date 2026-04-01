import { ServiceType } from "@/modules/tour/day/types/day.type";
import { z } from "zod";

export const hotelServiceDetailSchema = z.object({
  hotelId: z.string().min(1, "Vui lòng chọn khách sạn"),
  pricingPeriodId: z.string().min(1, "Vui lòng chọn giai đoạn giá"),
  dayGroupId: z.string().min(1, "Vui lòng chọn nhóm ngày"),
  roomTypeId: z.string().min(1, "Vui lòng chọn hạng phòng"),
});

export const dayServiceSchema = z.object({
  serviceType: z.enum(ServiceType, { error: "Vui lòng chọn loại dịch vụ" }),
  name: z.string().min(1, "Vui lòng nhập tên dịch vụ"),
  unitPrice: z.number({ error: "Vui lòng nhập đơn giá" }).min(0, "Giá không được âm"),
  currency: z.string().min(1, "Vui lòng chọn loại tiền tệ"),
  hotelDetail: hotelServiceDetailSchema.optional(),
});

export type HotelServiceDetailFormValues = z.infer<typeof hotelServiceDetailSchema>;

export const daySchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã ngày"),
  title: z.string().min(1, "Vui lòng nhập tên hành trình"),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  city: z.string().min(1, "Vui lòng chọn thành phố"),
  description: z.string(),
  services: z.array(dayServiceSchema),
});

export type DayServiceFormValues = z.infer<typeof dayServiceSchema>;
export type DayFormValues = z.infer<typeof daySchema>;
