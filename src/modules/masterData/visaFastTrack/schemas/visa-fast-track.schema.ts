import { z } from "zod";

export const serviceSchema = z.object({
  group: z.string().min(1, "Vui lòng chọn nhóm"),
  serviceName: z.string().min(1, "Vui lòng nhập tên dịch vụ"),
  price: z.number({ error: "Vui lòng nhập giá" }).min(0, "Giá không được âm"),
  priceUnit: z.string().min(1, "Vui lòng chọn đơn vị giá"),
  description: z.string(),
  pickupLocation: z.string()
});
export const visaServiceSchema = z.object({
  provider: z.string().min(1, "Vui lòng nhập nhà cung cấp"),
  // code: z.string().min(1, "Vui lòng nhập mã dịch vụ"),
  country: z.string(),
  city: z.string(),
  services: z.array(serviceSchema).min(1, "Phải có ít nhất một dịch vụ")
});

export type VisaServiceFormValues = z.infer<typeof visaServiceSchema>;
