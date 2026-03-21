import { z } from "zod";

export const vehicleCapacityPriceSchema = z.object({
  capacity: z.number({ error: "Vui lòng nhập sức chứa chỗ ngồi" }).min(1, "Sức chứa phải lớn hơn 0"),
  price: z.number({ error: "Vui lòng nhập giá tiền" }).min(0, "Giá tiền không được âm"),
});

export const transportRouteSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã tuyến vận chuyển"),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  startLocation: z.string().min(1, "Vui lòng nhập điểm xuất phát"),
  endLocation: z.string().min(1, "Vui lòng nhập điểm đến"),
  vehicleCapacityPrice: z.array(vehicleCapacityPriceSchema).min(1, "Vui lòng nhập ít nhất một giá theo loại xe"),
  notes: z.string(),
  isActive: z.boolean(),
});

export type TransportRouteFormValues = z.infer<typeof transportRouteSchema>;
