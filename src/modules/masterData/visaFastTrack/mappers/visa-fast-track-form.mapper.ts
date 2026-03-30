import type { VisaServiceFormValues } from "@/modules/masterData/visaFastTrack/schemas/visa-fast-track.schema";
import type {VisaService } from "@/modules/masterData/visaFastTrack/types/visa-fast-track.type";

export const mapVisaServiceDataToFormValues = (data: VisaService | undefined): VisaServiceFormValues => {
  return {
    // code: data?.code ?? "",
    provider: data?.provider ?? "",
    services: data?.services || [],
    country: data?.country ?? "",
    city: data?.city ?? "",
  };
};

export const mapVisaServiceFormValuesToPayload = (values: VisaServiceFormValues): Omit<VisaService, "id"> => {
  return { ...values};
};
