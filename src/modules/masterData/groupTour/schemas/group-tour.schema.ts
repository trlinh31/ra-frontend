import { z } from "zod";

export const groupTourSchema = z.object({
  tourName: z.string().min(1, "Vui lòng nhập tên tour"),
  contractRateUsd: z.coerce.number({ error: "Vui lòng nhập giá hợp đồng" }).min(0, "Giá không được âm"),
  notes: z.string().optional().default(""),
});

export type GroupTourFormValues = z.infer<typeof groupTourSchema>;
