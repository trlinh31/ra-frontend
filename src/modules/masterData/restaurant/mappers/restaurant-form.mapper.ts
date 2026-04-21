import type { RestaurantFormValues } from "@/modules/masterData/restaurant/schemas/restaurant.schema";
import type { Restaurant } from "@/modules/masterData/restaurant/types/restaurant.type";

export const mapRestaurantDataToFormValues = (data: Restaurant | undefined): RestaurantFormValues => {
  return {
    code: data?.code ?? "",
    name: data?.name ?? "",
    country: data?.country ?? "",
    city: data?.city ?? "",
    address: data?.address ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    capacity: data?.capacity ?? 0,
    comboPackages: data?.comboPackages ?? [],
    pricingPeriods: data?.pricingPeriods ?? [],
    isActive: data?.isActive ?? true,
  };
};

export const mapRestaurantFormValuesToPayload = (values: RestaurantFormValues): Omit<Restaurant, "id"> => {
  return { ...values };
};
