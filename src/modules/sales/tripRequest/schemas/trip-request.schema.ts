import { z } from "zod";

export const createTripRequestSchema = z.object({
  // Thông tin khách hàng
  customerName: z.string().min(1, "Vui lòng nhập tên khách / đoàn"),
  customerEmail: z.string().optional(),
  customerPhone: z.string().optional(),
  leadSource: z.string().min(1, "Vui lòng chọn nguồn lead"),

  // Nhu cầu chuyến đi
  destination: z.string().optional(),
  departureDateEst: z.string().optional(),
  durationDays: z.string().optional(), // chuỗi, chuyển number khi submit
  numberOfAdults: z.number({ error: "Vui lòng nhập số người lớn" }).min(1, "Ít nhất 1 người lớn"),
  numberOfChildren: z.number({ error: "Vui lòng nhập số trẻ em" }).min(0, "Không được âm"),
  specialRequirements: z.string().optional(),
  budgetEstimate: z.string().optional(), // chuỗi, chuyển number khi submit
  budgetCurrency: z.string().optional(),

  // Phân công & ghi chú
  suggestedTourId: z.string().optional(),
  assignedTo: z.string().optional(),
  internalNotes: z.string().optional(),
});

export type CreateTripRequestFormValues = z.infer<typeof createTripRequestSchema>;
