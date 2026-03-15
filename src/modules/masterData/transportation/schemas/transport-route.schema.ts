import { z } from "zod";

const optionalPrice = z.preprocess((val) => (val === "" || val == null ? undefined : Number(val)), z.number().min(0, "Giá không được âm").optional());

export const transportRouteSchema = z.object({
  route: z.string().min(1, "Vui lòng nhập lộ trình"),
  price_4: optionalPrice,
  price_7: optionalPrice,
  price_16: optionalPrice,
  price_29: optionalPrice,
  price_35: optionalPrice,
  price_45: optionalPrice,
});
export type TransportRouteItemFormValues = z.infer<typeof transportRouteSchema>;
