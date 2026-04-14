import type { TourFormValues } from "../schemas/tour.schema";
import type { Tour } from "../types/tour.type";

export const mapTourDataToFormValues = (data: Tour | undefined): TourFormValues => ({
  code: data?.code ?? "",
  name: data?.name ?? "",
  description: data?.description ?? "",
  content: data?.content ?? "",
  numberOfPeople: data?.numberOfPeople ?? 1,
  itinerary:
    data?.itinerary?.map((item) => {
      if (item.kind === "day") {
        return {
          kind: "day" as const,
          code: item.code,
          title: item.title,
          country: item.country,
          city: item.city,
          description: item.description,
          services: item.services.map((s) => ({
            serviceType: s.serviceType,
            name: s.name,
            unitPrice: s.unitPrice,
            currency: s.currency,
            ...(s.hotelDetail ? { hotelDetail: s.hotelDetail } : {}),
            ...(s.transportDetail ? { transportDetail: s.transportDetail } : {}),
            ...(s.visaDetail ? { visaDetail: s.visaDetail } : {}),
            ...(s.entranceFeeDetail ? { entranceFeeDetail: s.entranceFeeDetail } : {}),
            ...(s.flightDetail ? { flightDetail: s.flightDetail } : {}),
          })),
        };
      }
      return {
        kind: "group_tour" as const,
        groupTourId: item.groupTourId,
        pricingPeriodId: item.pricingPeriodId,
        dayGroupId: item.dayGroupId,
        name: item.name,
        unitPrice: item.unitPrice,
        currency: item.currency,
      };
    }) ?? [],
});

export const mapTourFormValuesToPayload = (values: TourFormValues): Omit<Tour, "id"> => ({
  code: values.code,
  name: values.name,
  description: values.description ?? "",
  content: values.content ?? "",
  numberOfPeople: values.numberOfPeople,
  itinerary: values.itinerary.map((item, i) => {
    if (item.kind === "day") {
      return {
        kind: "day" as const,
        code: item.code,
        title: item.title,
        country: item.country,
        city: item.city,
        description: item.description ?? "",
        services: (item.services ?? []).map((s, si) => ({
          id: `s${Date.now()}-${i}-${si}`,
          serviceType: s.serviceType,
          name: s.name,
          unitPrice: s.unitPrice,
          currency: s.currency,
          ...(s.hotelDetail ? { hotelDetail: s.hotelDetail } : {}),
          ...(s.transportDetail ? { transportDetail: s.transportDetail } : {}),
          ...(s.visaDetail ? { visaDetail: s.visaDetail } : {}),
          ...(s.entranceFeeDetail ? { entranceFeeDetail: s.entranceFeeDetail } : {}),
          ...(s.flightDetail ? { flightDetail: s.flightDetail } : {}),
        })),
      };
    }
    return {
      kind: "group_tour" as const,
      groupTourId: item.groupTourId,
      pricingPeriodId: item.pricingPeriodId,
      dayGroupId: item.dayGroupId,
      name: item.name,
      unitPrice: item.unitPrice,
      currency: item.currency,
    };
  }),
});
