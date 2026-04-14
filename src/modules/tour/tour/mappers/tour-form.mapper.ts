import type { TourFormValues } from "../schemas/tour.schema";
import type { Tour } from "../types/tour.type";

export const mapTourDataToFormValues = (data: Tour | undefined): TourFormValues => ({
  code: data?.code ?? "",
  name: data?.name ?? "",
  description: data?.description ?? "",
  content: data?.content ?? "",
  numberOfPeople: data?.numberOfPeople ?? 1,
  groupTours:
    data?.groupTours?.map((gt) => ({
      groupTourId: gt.groupTourId,
      pricingPeriodId: gt.pricingPeriodId,
      dayGroupId: gt.dayGroupId,
      name: gt.name,
      unitPrice: gt.unitPrice,
      currency: gt.currency,
    })) ?? [],
  days: data?.days.map((d) => ({ dayId: d.dayId, order: d.order })) ?? [],
});

export const mapTourFormValuesToPayload = (values: TourFormValues): Omit<Tour, "id"> => ({
  code: values.code,
  name: values.name,
  description: values.description ?? "",
  content: values.content ?? "",
  numberOfPeople: values.numberOfPeople,
  groupTours:
    values.groupTours?.map((gt) => ({
      groupTourId: gt.groupTourId,
      pricingPeriodId: gt.pricingPeriodId,
      dayGroupId: gt.dayGroupId,
      name: gt.name,
      unitPrice: gt.unitPrice,
      currency: gt.currency,
    })) ?? [],
  days: values.days.map((d, i) => ({ dayId: d.dayId, order: i + 1 })),
});
