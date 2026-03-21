import type { TransportRouteFormValues } from "@/modules/masterData/transportation/schemas/transport-route.schema";
import type { TransportRoute } from "@/modules/masterData/transportation/types/transportation.type";

export const mapTransportRouteDataToFormValues = (data: TransportRoute | undefined): TransportRouteFormValues => {
  return {
    code: data?.code ?? "",
    country: data?.country ?? "",
    startLocation: data?.startLocation ?? "",
    endLocation: data?.endLocation ?? "",
    vehicleCapacityPrice: data?.vehicleCapacityPrice ?? [],
    notes: data?.notes ?? "",
    isActive: data?.isActive ?? true,
  };
};

export const mapTransportRouteFormValuesToPayload = (formValues: TransportRouteFormValues): Omit<TransportRoute, "id"> => {
  return {
    ...formValues,
  };
};
