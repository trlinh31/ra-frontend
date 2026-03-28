import type { HotelFormValues } from "@/modules/masterData/hotel/schemas/hotel.schema";
import type { Hotel } from "@/modules/masterData/hotel/types/hotel.type";

export const mapHotelDataToFormValues = (hotel: Hotel | undefined): HotelFormValues => {
  return {
    code: hotel?.code || "",
    name: hotel?.name || "",
    rate: String(hotel?.rate || ""),
    country: hotel?.country || "",
    city: hotel?.city || "",
    address: hotel?.address || "",
    rooms: hotel?.rooms || [],
    roomCategories: hotel?.roomCategories || [],
    note: hotel?.note || "",
    isActive: hotel?.isActive ?? true,
  };
};

export const mapHotelFormValuesToPayload = (formValues: HotelFormValues): Omit<Hotel, "id"> => {
  return {
    ...formValues,
    rate: Number(formValues.rate),
  };
};
