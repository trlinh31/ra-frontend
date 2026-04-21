import { z } from "zod";

export const createConfirmedTourSchema = z.object({
  tourTemplateId: z.string().min(1, "Vui lòng chọn tour mẫu"),
  customerName: z.string().min(1, "Vui lòng nhập tên đoàn / khách hàng"),
  numberOfPeople: z.number({ error: "Vui lòng nhập số người" }).min(1, "Số khách phải ít nhất là 1"),
  departureDate: z.string().min(1, "Vui lòng chọn ngày khởi hành"),
  note: z.string(),
});

export type CreateConfirmedTourFormValues = z.infer<typeof createConfirmedTourSchema>;
