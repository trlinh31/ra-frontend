import { z } from "zod";

export const roomCategorySchema = z.object({
  name: z.string().min(1, "Trường này là bắt buộc"),
  quantity: z.number({ error: "Trường này là bắt buộc" }).min(1, "Số lượng phòng phải lớn hơn 0"),
  area: z.number({ error: "Trường này là bắt buộc" }).min(1, "Diện tích phòng phải lớn hơn 0"),
  note: z.string(),
});

export const roomSchema = z.object({
  roomCategory: z.string().min(1, "Trường này là bắt buộc"),
  priceRange: z
    .object({
      startDate: z.string().refine(
        (value) => {
          const date = new Date(value);
          return !isNaN(date.getTime());
        },
        { message: "Trường này là bắt buộc" }
      ),
      endDate: z.string().refine(
        (value) => {
          const date = new Date(value);
          return !isNaN(date.getTime());
        },
        { message: "Trường này là bắt buộc" }
      ),
      price: z.number({ error: "Trường này là bắt buộc" }).min(1, "Giá tiền phải lớn hơn 0"),
      currency: z.string().min(1, "Trường này là bắt buộc"),
    })
    .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      path: ["endDate"],
    }),
});

export const hotelSchema = z.object({
  code: z.string().min(1, "Trường này là bắt buộc"),
  name: z.string().min(1, "Trường này là bắt buộc"),
  rate: z.string().min(1, "Trường này là bắt buộc"),
  country: z.string().min(1, "Trường này là bắt buộc"),
  city: z.string().min(1, "Trường này là bắt buộc"),
  address: z.string().min(1, "Trường này là bắt buộc"),
  roomCategories: z.array(roomCategorySchema).min(1, "Phải có ít nhất một loại phòng"),
  rooms: z.array(roomSchema).min(1, "Phải có ít nhất một phòng"),
  note: z.string(),
  isActive: z.boolean(),
});

export type HotelFormValues = z.infer<typeof hotelSchema>;
