import { z } from "zod";

export const transportKmGroupSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã nhóm"),
  title: z.string().min(1, "Vui lòng nhập tên nhóm"),
});
export type TransportKmGroupFormValues = z.infer<typeof transportKmGroupSchema>;

export const transportKmItemSchema = z.object({
  groupId: z.string().min(1, "Vui lòng chọn nhóm"),
  schedule: z.string().min(1, "Vui lòng nhập lịch trình"),
  km: z.coerce.number({ error: "Vui lòng nhập km" }).min(1, "Km phải lớn hơn 0"),
  notes: z.string().optional().default(""),
});
export type TransportKmItemFormValues = z.infer<typeof transportKmItemSchema>;
