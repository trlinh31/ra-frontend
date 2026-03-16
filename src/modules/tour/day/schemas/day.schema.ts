import { z } from "zod";
import { CURRENCIES, SERVICE_TYPES } from "../types/day.type";

export const dayServiceSchema = z.object({
  serviceType: z.enum(SERVICE_TYPES, { error: "Vui lòng chọn loại dịch vụ" }),
  name: z.string().min(1, "Vui lòng nhập tên dịch vụ"),
  quantity: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z.number({ error: "Vui lòng nhập số lượng" }).min(1, "Tối thiểu 1")
  ),
  unitPrice: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z.number({ error: "Vui lòng nhập đơn giá" }).min(0, "Giá không được âm")
  ),
  currency: z.enum(CURRENCIES).default("VND"),
  notes: z.string().optional().default(""),
});

export const daySchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã ngày"),
  title: z.string().min(1, "Vui lòng nhập tiêu đề ngày"),
  description: z.string().optional().default(""),
  services: z.array(dayServiceSchema).default([]),
});

export type DayServiceFormValues = z.infer<typeof dayServiceSchema>;
export type DayFormValues = z.infer<typeof daySchema>;
