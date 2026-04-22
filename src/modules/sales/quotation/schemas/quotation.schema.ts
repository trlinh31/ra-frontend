import { z } from "zod";

export const createQuotationSchema = z.object({
  customerName: z.string().min(1, "Vui lòng nhập tên khách hàng / tên đoàn"),
  customerEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  customerPhone: z.string().optional(),
  numberOfPeople: z.number({ error: "Vui lòng nhập số khách dự kiến" }).min(1, "Số khách phải ít nhất là 1"),
  departureDateEst: z.string().optional(),
  tourTemplateId: z.string().optional(),
  terms: z.string().optional(),
  note: z.string().optional(),
});

export type CreateQuotationFormValues = z.infer<typeof createQuotationSchema>;

export const sendQuotationSchema = z.object({
  sellingPriceVnd: z.number({ error: "Vui lòng nhập giá bán" }).min(0, "Giá bán không được âm").optional(),
  sellingPriceUsd: z.number().min(0, "Giá bán không được âm").optional(),
  terms: z.string().optional(),
  note: z.string().optional(),
});

export type SendQuotationFormValues = z.infer<typeof sendQuotationSchema>;
