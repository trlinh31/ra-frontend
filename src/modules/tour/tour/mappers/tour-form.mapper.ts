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
  days:
    data?.days.map((d) => ({
      code: d.code,
      title: d.title,
      country: d.country,
      city: d.city,
      description: d.description,
      services: d.services.map((s) => ({
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
    })) ?? [],
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
  days: values.days.map((d, i) => ({
    code: d.code,
    title: d.title,
    country: d.country,
    city: d.city,
    description: d.description ?? "",
    services: (d.services ?? []).map((s, si) => ({
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
  })),
});
