import type { HotelFormValues } from "@/modules/masterData/hotel/schemas/hotel.schema";
import type { DayOfWeek, Hotel } from "@/modules/masterData/hotel/types/hotel.type";

export const mapHotelDataToFormValues = (hotel: Hotel | undefined): HotelFormValues => {
  return {
    code: hotel?.code || "",
    name: hotel?.name || "",
    rate: hotel?.rate || "",
    country: hotel?.country || "",
    city: hotel?.city || "",
    address: hotel?.address || "",
    roomTypes:
      hotel?.roomTypes?.map((rt) => ({
        name: rt.name,
        maxGuests: rt.maxGuests,
        note: rt.note,
      })) || [],
    pricingPeriods:
      hotel?.pricingPeriods?.map((period) => ({
        currency: period.currency || "VND",
        dateRanges: period.dateRanges.map((dr) => ({
          from: dr.from,
          to: dr.to,
          dayGroups: dr.dayGroups.map((dg) => ({
            label: dg.label,
            days: dg.days,
            price: dg.price,
            roomTypeIndex: String(dg.roomTypeId - 1),
          })),
        })),
      })) || [],
    note: hotel?.note || "",
    supplier: hotel?.supplier || "",
    isActive: hotel?.isActive ?? true,
  };
};

export const mapHotelFormValuesToPayload = (formValues: HotelFormValues): Omit<Hotel, "id"> => {
  return {
    code: formValues.code,
    name: formValues.name,
    rate: formValues.rate,
    country: formValues.country,
    city: formValues.city,
    address: formValues.address,
    roomTypes: formValues.roomTypes.map((rt, idx) => ({
      id: idx + 1,
      name: rt.name,
      maxGuests: rt.maxGuests,
      note: rt.note,
    })),
    pricingPeriods: formValues.pricingPeriods.map((period, pIdx) => ({
      id: String(pIdx + 1),
      label: period.dateRanges.map((dr) => `${dr.from}-${dr.to}`).join(", "),
      currency: period.currency,
      dateRanges: period.dateRanges.map((dr, drIdx) => ({
        from: dr.from,
        to: dr.to,
        dayGroups: dr.dayGroups.map((dg, gIdx) => ({
          id: String(gIdx + 1),
          label: dg.label,
          days: dg.days as DayOfWeek[],
          price: dg.price,
          roomTypeId: Number(dg.roomTypeIndex) + 1,
        })),
      })),
    })),
    note: formValues.note,
    supplier: formValues.supplier,
    isActive: formValues.isActive,
  };
};
