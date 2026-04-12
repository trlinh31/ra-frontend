import type { EntranceFeeFormValues } from "@/modules/masterData/entranceFee/schemas/entrance-fee.schema";
import type { EntranceFee } from "@/modules/masterData/entranceFee/types/entrance-fee.type";

export const mapEntranceFeeDataToFormValues = (data: EntranceFee | undefined): EntranceFeeFormValues => {
  return {
    code: data?.code ?? "",
    serviceName: data?.serviceName ?? "",
    country: data?.country ?? "",
    city: data?.city ?? "",
    notes: data?.notes ?? "",
    isActive: data?.isActive ?? true,
    pricingPeriods: data?.pricingPeriods ?? [],
  };
};

export const mapEntranceFeeFormValuesToPayload = (values: EntranceFeeFormValues): Omit<EntranceFee, "id"> => {
  return { ...values };
};
