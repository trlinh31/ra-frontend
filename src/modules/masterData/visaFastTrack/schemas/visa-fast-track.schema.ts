import { z } from "zod";

export const visaServiceSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã dịch vụ"),
  group: z.string().min(1, "Vui lòng chọn nhóm"),
  serviceName: z.string().min(1, "Vui lòng nhập tên dịch vụ"),
  price: z.number({ error: "Vui lòng nhập giá" }).min(0, "Giá không được âm"),
  priceUnit: z.string().min(1, "Vui lòng chọn đơn vị giá"),
  description: z.string(),
  pickupLocation: z.string(),
});

export type VisaServiceFormValues = z.infer<typeof visaServiceSchema>;
