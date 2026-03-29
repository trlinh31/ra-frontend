import type { TransportationFormValues } from "@/modules/masterData/transportation/schemas/transportation.schema";
import type { Transportation } from "@/modules/masterData/transportation/types/transportation.type";

export const mapTransportationDataToFormValues = (data: Transportation | undefined): TransportationFormValues => {
  return {
    code: data?.code ?? "",
    name: data?.name ?? "",
    country: data?.country ?? "",
    city: data?.city ?? "",
    supplier: data?.supplier ?? "",
    km: data?.km ?? 0,
    vehicleCapacityPrice: data?.vehicleCapacityPrice ?? [],
    notes: data?.notes ?? "",
    isActive: data?.isActive ?? true,
  };
};

export const mapTransportationFormValuesToPayload = (values: TransportationFormValues): Omit<Transportation, "id"> => {
  return { ...values };
};
