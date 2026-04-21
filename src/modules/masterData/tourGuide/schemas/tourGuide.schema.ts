import { z } from "zod";

export const tourGuideSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã hướng dẫn viên"),
  name: z.string().min(1, "Vui lòng nhập tên hướng dẫn viên"),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  city: z.string().min(1, "Vui lòng chọn thành phố"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  nationalId: z.string().min(1, "Vui lòng nhập số CMND/CCCD"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  pricePerDay: z.number().min(0, "Phí thuê phải lớn hơn hoặc bằng 0"),
  isActive: z.boolean(),
});

export type TourGuideFormValues = z.infer<typeof tourGuideSchema>;
