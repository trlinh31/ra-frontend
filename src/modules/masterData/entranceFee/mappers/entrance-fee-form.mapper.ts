import type { EntranceFeeFormValues } from "@/modules/masterData/entranceFee/schemas/entrance-fee.schema";
import type { EntranceFee } from "@/modules/masterData/entranceFee/types/entrance-fee.type";
import { formatDate } from "date-fns";

export const mapEntranceFeeDataToFormValues = (data: EntranceFee | undefined): EntranceFeeFormValues => {
  return {
    code: data?.code ?? "",
    serviceName: data?.serviceName ?? "",
    country: data?.country ?? "",
    city: data?.city ?? "",
    notes: data?.notes ?? "",
    isActive: data?.isActive ?? true,
    ticketTypes: data?.ticketTypes ?? [],
    pricingPeriods: data?.pricingPeriods ?? [],
  };
};

export const mapEntranceFeeFormValuesToPayload = (values: EntranceFeeFormValues): Omit<EntranceFee, "id"> => {
  return {
    ...values,
    pricingPeriods: values.pricingPeriods.map((period) => ({
      ...period,
      label: period.dateRanges
        .filter((dr) => dr.from && dr.to)
        .map((dr) => `${formatDate(new Date(dr.from), "dd/MM")} - ${formatDate(new Date(dr.to), "dd/MM")}`)
        .join(", "),
    })),
  };
};
