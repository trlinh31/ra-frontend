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

export const hotelSchema = z.object({
  roomType: z.enum(ROOM_TYPES, { error: "Vui lòng chọn loại phòng" }),
  roomCount: z.coerce.number({ error: "Vui lòng nhập số phòng" }).int("Số phòng phải là số nguyên").min(1, "Số phòng phải lớn hơn 0"),
  priceRanges: z.array(priceRangeSchema).min(1, "Vui lòng thêm ít nhất một khoảng giá"),
  notes: z.string().optional().default(""),
  isActive: z.boolean().default(true),
});

export type HotelFormValues = z.infer<typeof hotelSchema>;
