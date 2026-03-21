import type { VisaServiceFormValues } from "@/modules/masterData/visaFastTrack/schemas/visa-fast-track.schema";
import type { UnitPriceType, VisaService } from "@/modules/masterData/visaFastTrack/types/visa-fast-track.type";

export const mapVisaServiceDataToFormValues = (data: VisaService | undefined): VisaServiceFormValues => {
  return {
    code: data?.code ?? "",
    group: data?.group ?? "",
    serviceName: data?.serviceName ?? "",
    price: data?.price ?? 0,
    priceUnit: data?.priceUnit ?? "PAX",
    description: data?.description ?? "",
    pickupLocation: data?.pickupLocation ?? "",
  };
};

export const mapVisaServiceFormValuesToPayload = (values: VisaServiceFormValues): Omit<VisaService, "id"> => {
  return { ...values, priceUnit: values.priceUnit as UnitPriceType };
};
