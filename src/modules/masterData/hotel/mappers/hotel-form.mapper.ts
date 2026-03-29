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
        dateRanges: period.dateRanges,
        dayGroups: period.dayGroups.map((dg) => ({ label: dg.label, days: dg.days })),
        prices: period.prices.map((rtp) => ({ dayGroupPrices: rtp.dayGroupPrices })),
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
      dateRanges: period.dateRanges,
      dayGroups: period.dayGroups.map((dg, gIdx) => ({
        id: String(gIdx + 1),
        label: dg.label,
        days: dg.days as DayOfWeek[],
      })),
      prices: period.prices.map((rtp, roomIdx) => ({
        roomTypeId: roomIdx + 1,
        dayGroupPrices: rtp.dayGroupPrices.map((dgp, gIdx) => ({
          dayGroupId: String(gIdx + 1),
          price: dgp.price,
        })),
      })),
    })),
    note: formValues.note,
    supplier: formValues.supplier,
    isActive: formValues.isActive,
  };
};
