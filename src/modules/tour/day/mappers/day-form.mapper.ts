import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import type { Day } from "@/modules/tour/day/types/day.type";

export const mapDayDataToFormValues = (data: Day | undefined): DayFormValues => {
  return {
    code: data?.code ?? "",
    title: data?.title ?? "",
    country: data?.country ?? "",
    city: data?.city ?? "",
    description: data?.description ?? "",
    services:
      data?.services.map((s) => ({
        serviceType: s.serviceType,
        name: s.name,
        unitPrice: s.unitPrice,
        currency: s.currency,
        ...(s.hotelDetail ? { hotelDetail: s.hotelDetail } : {}),
      })) ?? [],
  };
};

export const mapDayFormValuesToPayload = (values: DayFormValues) => {
  return {
    // code: values.code,
    // title: values.title,
    // country: values.country,
    // city: values.city,
    // description: values.description ?? "",
    // services: values.services.map((s, i) => ({
    //   id: `s${Date.now()}-${i}`,
    //   serviceType: s.serviceType,
    //   name: s.name,
    //   quantity: s.quantity,
    //   unitPrice: s.unitPrice,
    //   currency: s.currency,
    //   ...(s.hotelDetail ? { hotelDetail: s.hotelDetail } : {}),
    // })),
  };
};
