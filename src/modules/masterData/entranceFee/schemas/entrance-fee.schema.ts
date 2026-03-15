import { z } from "zod";

export const entranceFeeGroupSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã nhóm"),
  name: z.string().optional().default(""),
});
export type EntranceFeeGroupFormValues = z.infer<typeof entranceFeeGroupSchema>;

export const entranceFeeItemSchema = z.object({
  groupId: z.string().min(1, "Vui lòng chọn nhóm"),
  serviceName: z.string().min(1, "Vui lòng nhập tên dịch vụ"),
  adultNetRateVnd: z.preprocess((val) => (val === "" || val == null ? undefined : Number(val)), z.number().min(0, "Giá không được âm").optional()),
  notes: z.string().optional().default(""),
});
export type EntranceFeeItemFormValues = z.infer<typeof entranceFeeItemSchema>;
