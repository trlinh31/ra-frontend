import type { TourFormValues } from "../schemas/tour.schema";
import type { Tour } from "../types/tour.type";

export const mapTourDataToFormValues = (data: Tour | undefined): TourFormValues => ({
  code: data?.code ?? "",
  name: data?.name ?? "",
  description: data?.description ?? "",
  days: data?.days.map((d) => ({ dayId: d.dayId, order: d.order })) ?? [],
});

export const mapTourFormValuesToPayload = (values: TourFormValues): Omit<Tour, "id"> => ({
  code: values.code,
  name: values.name,
  description: values.description ?? "",
  days: values.days.map((d, i) => ({ dayId: d.dayId, order: i + 1 })),
});
