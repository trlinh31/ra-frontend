import type { TransportKmFormValues } from "@/modules/masterData/transportation/schemas/transport-km.schema";
import type { TransportKm } from "@/modules/masterData/transportation/types/transportation.type";

export const mapTransportKmDataToFormValues = (data: TransportKm | undefined): TransportKmFormValues => {
  return {
    code: data?.code ?? "",
    country: data?.country ?? "",
    city: data?.city ?? "",
    category: data?.category ?? "",
    km: data?.km ?? 0,
    price: data?.price ?? 0,
    notes: data?.notes ?? "",
    isActive: data?.isActive ?? true,
  };
};
