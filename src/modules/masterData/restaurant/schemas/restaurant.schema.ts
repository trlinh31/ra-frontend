import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên món"),
  price: z.number({ error: "Vui lòng nhập giá" }).min(0, "Giá phải lớn hơn hoặc bằng 0"),
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
  menuItems: z.array(menuItemSchema),
  isActive: z.boolean(),
});

export type RestaurantFormValues = z.infer<typeof restaurantSchema>;
