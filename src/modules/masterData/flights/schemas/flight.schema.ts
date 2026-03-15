import { z } from "zod";

export const flightSchema = z.object({
  route: z.string().min(1, "Vui lòng nhập tuyến bay"),
  netRateUsd: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z.number({ error: "Vui lòng nhập giá" }).min(0, "Giá không được âm")
  ),
  notes: z.string().optional().default(""),
});

export type FlightFormValues = z.infer<typeof flightSchema>;
