import { z } from "zod";
import { ROOM_TYPES } from "../types/hotel.type";

export const priceRangeSchema = z
  .object({
    startDate: z.date({ error: "Vui lòng chọn ngày bắt đầu" }),
    endDate: z.date({ error: "Vui lòng chọn ngày kết thúc" }),
    price: z.coerce.number({ error: "Vui lòng nhập giá tiền" }).min(1, "Giá tiền phải lớn hơn 0"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["endDate"],
  });

export const roomSchema = z.object({
  roomType: z.enum(ROOM_TYPES, { error: "Vui lòng chọn loại phòng" }),
  priceRange: z
    .object({
      startDate: z.date({ error: "Vui lòng chọn ngày bắt đầu" }),
      endDate: z.date({ error: "Vui lòng chọn ngày kết thúc" }),
      price: z.coerce.number({ error: "Vui lòng nhập giá tiền" }).min(1, "Giá tiền phải lớn hơn 0"),
    })
    .refine((data) => data.endDate >= data.startDate, {
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      path: ["endDate"],
    }),
});

export const hotelSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên khách sạn"),
  rate: z.string().min(1, "Vui lòng chọn đánh giá"),
  country: z.string().min(1, "Vui lòng nhập quốc gia"),
  city: z.string().min(1, "Vui lòng nhập thành phố"),
  rooms: z.array(roomSchema).min(1, "Vui lòng thêm ít nhất một loại phòng"),
  notes: z.string().optional().default(""),
  isActive: z.boolean().default(true),
});

export type HotelFormValues = z.infer<typeof hotelSchema>;
