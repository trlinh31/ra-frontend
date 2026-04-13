import { ServiceType } from "@/modules/tour/day/types/day.type";
import { z } from "zod";

export const hotelServiceDetailSchema = z.object({
  hotelId: z.string().min(1, "Vui lòng chọn khách sạn"),
  pricingPeriodId: z.string().min(1, "Vui lòng chọn giai đoạn giá"),
  dayGroupId: z.string().min(1, "Vui lòng chọn nhóm ngày"),
  roomTypeId: z.string().min(1, "Vui lòng chọn hạng phòng"),
});

export const transportServiceDetailSchema = z.object({
  transportId: z.string().min(1, "Vui lòng chọn lịch trình"),
  capacity: z.string().min(1, "Vui lòng chọn sức chứa"),
});

export const visaServiceDetailSchema = z.object({
  providerId: z.string().min(1, "Vui lòng chọn nhà cung cấp"),
  serviceName: z.string().min(1, "Vui lòng chọn dịch vụ"),
});

export const groupTourServiceDetailSchema = z.object({
  groupTourId: z.string().min(1, "Vui lòng chọn nhóm tour"),
  pricingPeriodId: z.string().min(1, "Vui lòng chọn giai đoạn giá"),
  dayGroupId: z.string().min(1, "Vui lòng chọn nhóm ngày"),
});

export const entranceFeeServiceDetailSchema = z.object({
  entranceFeeId: z.string().min(1, "Vui lòng chọn phí vào cổng"),
  pricingPeriodId: z.string().min(1, "Vui lòng chọn giai đoạn giá"),
  dayGroupId: z.string().min(1, "Vui lòng chọn nhóm ngày"),
  adultPrice: z.number().optional(),
  childPrice: z.number().optional(),
});

export const flightServiceDetailSchema = z.object({
  flightId: z.string().min(1, "Vui lòng chọn chuyến bay"),
  pricingPeriodId: z.string().min(1, "Vui lòng chọn giai đoạn giá"),
  dayGroupId: z.string().min(1, "Vui lòng chọn nhóm ngày"),
});

export const dayServiceSchema = z.object({
  serviceType: z.enum(ServiceType, { error: "Vui lòng chọn loại dịch vụ" }),
  name: z.string().min(1, "Vui lòng nhập tên dịch vụ"),
  unitPrice: z.number({ error: "Vui lòng nhập đơn giá" }).min(0, "Giá không được âm"),
  currency: z.string().min(1, "Vui lòng chọn loại tiền tệ"),
  hotelDetail: hotelServiceDetailSchema.optional(),
  transportDetail: transportServiceDetailSchema.optional(),
  groupTourDetail: groupTourServiceDetailSchema.optional(),
  visaDetail: visaServiceDetailSchema.optional(),
  entranceFeeDetail: entranceFeeServiceDetailSchema.optional(),
  flightDetail: flightServiceDetailSchema.optional(),
});

export type HotelServiceDetailFormValues = z.infer<typeof hotelServiceDetailSchema>;
export type TransportServiceDetailFormValues = z.infer<typeof transportServiceDetailSchema>;

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
