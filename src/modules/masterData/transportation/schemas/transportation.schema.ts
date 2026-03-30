import { z } from "zod";

export const vehicleCapacityPriceSchema = z.object({
  capacity: z.number({ error: "Vui lòng nhập sức chứa" }).min(1, "Sức chứa phải lớn hơn 0"),
  currency: z.string().min(1, "Vui lòng chọn đơn vị tiền tệ"),
  price: z.number({ error: "Vui lòng nhập giá tiền" }).min(0, "Giá tiền không được âm"),
});

export const transportationSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã lịch trình"),
  name: z.string().min(1, "Vui lòng nhập tên lịch trình"),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  city: z.string().min(1, "Vui lòng chọn thành phố"),
  supplier: z.string().min(1, "Vui lòng chọn nhà cung cấp"),
  km: z.number({ error: "Vui lòng nhập số km" }).min(0, "Số km không được âm"),
  vehicleCapacityPrice: z.array(vehicleCapacityPriceSchema).min(1, "Vui lòng thêm ít nhất một loại xe"),
  notes: z.string(),
  isActive: z.boolean(),
});

export type TransportationFormValues = z.infer<typeof transportationSchema>;
