import type { GroupTourFormValues } from "@/modules/masterData/groupTour/schemas/group-tour.schema";
import type { GroupTour } from "@/modules/masterData/groupTour/types/group-tour.type";

export const mapGroupTourDataToFormValues = (data: GroupTour | undefined): GroupTourFormValues => {
  return {
    code: data?.code ?? "",
    tourName: data?.tourName ?? "",
    supplier: data?.supplier ?? "",
    content: data?.content ?? "",
    price: data?.price ?? 0,
    notes: data?.notes ?? "",
    isActive: data?.isActive ?? true,
  };
};

export const mapGroupTourFormValuesToPayload = (values: GroupTourFormValues): Omit<GroupTour, "id"> => {
  return { ...values };
};
