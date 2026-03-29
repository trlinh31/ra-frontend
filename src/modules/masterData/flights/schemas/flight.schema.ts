import { z } from "zod";

export const flightSchema = z.object({
  // code: z.string().min(1, "Vui lòng nhập mã chuyến bay"),
  // airlineCode: z.string().min(1, "Vui lòng nhập mã hãng bay"),
  origin: z.string().min(1, "Vui lòng nhập mã điểm đi"),
  destination: z.string().min(1, "Vui lòng nhập mã điểm đến"),
  airline: z.string().min(1, "Vui lòng nhập tên hãng bay"),
  flightTime: z
    .string()
    .min(1, "Vui lòng nhập thời gian bay")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Thời gian không hợp lệ"),
  price: z.number({ error: "Vui lòng nhập giá tiền" }).min(0, "Giá tiền không được âm"),
  unitPrice: z.string().min(1, "Vui lòng nhập đơn vị tiền tệ"),
  provider: z.string().min(1, "Vui lòng nhập nhà cung cấp"),
  fromCountry: z.string().min(1, "Vui lòng chọn quốc gia điểm đi"),
  toCountry: z.string().min(1, "Vui lòng chọn quốc gia điểm đến"),
  fromCity: z.string().min(1, "Vui lòng chọn thành phố điểm đi"),
  toCity: z.string().min(1, "Vui lòng chọn thành phố điểm đến"),
  notes: z.string(),
  isActive: z.boolean(),
});

export type FlightFormValues = z.infer<typeof flightSchema>;
