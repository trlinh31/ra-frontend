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

export const entranceFeeServiceDetailSchema = z.object({
  entranceFeeId: z.string().min(1, "Vui lòng chọn phí vào cổng"),
  pricingPeriodId: z.string().min(1, "Vui lòng chọn giai đoạn giá"),
  ticketTypeIndex: z.string().min(1, "Vui lòng chọn loại đối tượng"),
  dayGroupId: z.string().min(1, "Vui lòng chọn nhóm ngày"),
  count: z.number({ error: "Vui lòng nhập số lượng" }).min(1, "Số lượng phải ít nhất là 1"),
});

export const flightServiceDetailSchema = z.object({
  flightId: z.string().min(1, "Vui lòng chọn chuyến bay"),
  pricingPeriodId: z.string().min(1, "Vui lòng chọn giai đoạn giá"),
  seatClassId: z.string().min(1, "Vui lòng chọn hạng vé"),
  dayGroupId: z.string().min(1, "Vui lòng chọn nhóm ngày"),
});

export const tourGuideServiceDetailSchema = z.object({
  tourGuideId: z.string().min(1, "Vui lòng chọn hướng dẫn viên"),
});

export const restaurantServiceDetailSchema = z.object({
  restaurantId: z.string().min(1, "Vui lòng chọn nhà hàng"),
  pricingPeriodIndex: z.string().min(1, "Vui lòng chọn giai đoạn giá"),
  comboPackageIndex: z.string().min(1, "Vui lòng chọn gói combo"),
  dayGroupKey: z.string().min(1, "Vui lòng chọn nhóm ngày"),
});

export const addonServiceDetailSchema = z.object({
  entityType: z.string().min(1, "Vui lòng chọn loại dịch vụ"),
  entityId: z.string().min(1, "Vui lòng chọn đối tác"),
  addonId: z.string().min(1, "Vui lòng chọn dịch vụ thêm"),
});

export const customServiceDetailSchema = z.object({
  description: z.string(),
});

export const dayServiceSchema = z.object({
  serviceType: z.enum(ServiceType, { error: "Vui lòng chọn loại dịch vụ" }),
  name: z.string().min(1, "Vui lòng nhập tên dịch vụ"),
  unitPrice: z.number({ error: "Vui lòng nhập đơn giá" }).min(0, "Giá không được âm"),
  currency: z.string().min(1, "Vui lòng chọn loại tiền tệ"),
  hotelDetail: hotelServiceDetailSchema.optional(),
  transportDetail: transportServiceDetailSchema.optional(),
  visaDetail: visaServiceDetailSchema.optional(),
  entranceFeeDetail: entranceFeeServiceDetailSchema.optional(),
  flightDetail: flightServiceDetailSchema.optional(),
  tourGuideDetail: tourGuideServiceDetailSchema.optional(),
  restaurantDetail: restaurantServiceDetailSchema.optional(),
  addonDetail: addonServiceDetailSchema.optional(),
  customDetail: customServiceDetailSchema.optional(),
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
