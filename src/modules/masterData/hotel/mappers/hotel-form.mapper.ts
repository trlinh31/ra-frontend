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
    rooms:
      hotel?.rooms.map((room) => ({
        roomCategory: room.roomCategory.name,
        startDate: room.startDate,
        endDate: room.endDate,
        price: room.price,
        currency: room.currency,
      })) || [],
    roomCategories: hotel?.roomCategories || [],
    note: hotel?.note || "",
    supplier: hotel?.supplier || "",
    isActive: hotel?.isActive ?? true,
  };
};

export const mapHotelFormValuesToPayload = (formValues: HotelFormValues): Omit<Hotel, "id"> => {
  return {
    ...formValues,
    rate: Number(formValues.rate),
    rooms: formValues.rooms.map((room) => ({
      roomCategory: formValues.roomCategories.find((type) => type.name === room.roomCategory) || {
        name: room.roomCategory,
        quantity: 0,
        area: 0,
        note: "",
      },
      startDate: room.startDate,
      endDate: room.endDate,
      price: room.price,
      currency: room.currency,
    })),
  };
};
