import type { TourGuideFormValues } from "@/modules/masterData/tourGuide/schemas/tourGuide.schema";
import type { TourGuide } from "@/modules/masterData/tourGuide/types/tourGuide.type";

export const mapTourGuideDataToFormValues = (data: TourGuide | undefined): TourGuideFormValues => {
  return {
    code: data?.code ?? "",
    name: data?.name ?? "",
    country: data?.country ?? "",
    city: data?.city ?? "",
    address: data?.address ?? "",
    nationalId: data?.nationalId ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    pricePerDay: data?.pricePerDay ?? 0,
    isActive: data?.isActive ?? true,
  };
};

export const mapTourGuideFormValuesToPayload = (values: TourGuideFormValues): Omit<TourGuide, "id"> => {
  return { ...values };
};
