import type { HotelFormValues } from "@/modules/masterData/hotel/schemas/hotel.schema";
import type { Hotel } from "@/modules/masterData/hotel/types/hotel.type";

export const mapHotelDataToFormValues = (hotel: Hotel | undefined): HotelFormValues => {
  return {
    name: hotel?.name || "",
    rate: hotel?.rate ? String(hotel.rate) : "",
    city: hotel?.city || "",
    country: hotel?.country || "",
    rooms: hotel?.rooms || [],
    notes: hotel?.notes || "",
    isActive: hotel?.isActive ?? true,
  };
};

export const mapHotelFormValuesToPayload = (formValues: HotelFormValues): Omit<Hotel, "id"> => {
  return {
    ...formValues,
    rate: Number(formValues.rate),
  };
};
