import type { FlightFormValues } from "@/modules/masterData/flights/schemas/flight.schema";
import type { Flight } from "@/modules/masterData/flights/types/flight.type";

export const mapFlightDataToFormValues = (flight: Flight | undefined): FlightFormValues => {
  return {
    // code: flight?.code || "",
    // airlineCode: flight?.airlineCode || "",
    origin: flight?.origin || "",
    destination: flight?.destination || "",
    airline: flight?.airline || "",
    flightTime: flight?.flightTime || "",
    notes: flight?.notes || "",
    provider: flight?.provider || "",
    fromCountry: flight?.fromCountry || "",
    fromCity: flight?.fromCity || "",
    toCountry: flight?.toCountry || "",
    toCity: flight?.toCity || "",
    isActive: flight?.isActive || false,
    seatClasses:
      flight?.seatClasses?.map((sc) => ({
        name: sc.name,
        note: sc.note,
      })) ?? [],
    pricingPeriods:
      flight?.pricingPeriods?.map((period) => ({
        id: period.id,
        label: period.label,
        currency: period.currency,
        dateRanges: period.dateRanges.map((dr) => ({
          from: dr.from,
          to: dr.to,
          dayGroups: dr.dayGroups.map((dg) => ({
            id: dg.id,
            label: dg.label,
            days: dg.days,
            price: dg.price,
            seatClassIndex: String(dg.seatClassId - 1),
          })),
        })),
      })) ?? [],
  };
};

export const mapFlightFormValuesToPayload = (formValues: FlightFormValues): Omit<Flight, "id"> => {
  return {
    ...formValues,
    seatClasses: formValues.seatClasses.map((sc, idx) => ({
      id: idx + 1,
      name: sc.name,
      note: sc.note,
    })),
    pricingPeriods: formValues.pricingPeriods.map((period, pIdx) => ({
      id: period.id || String(pIdx + 1),
      label: period.label || period.dateRanges.map((dr) => `${dr.from}-${dr.to}`).join(", "),
      currency: period.currency,
      dateRanges: period.dateRanges.map((dr) => ({
        from: dr.from,
        to: dr.to,
        dayGroups: dr.dayGroups.map((dg, gIdx) => ({
          id: dg.id || String(gIdx + 1),
          label: dg.label,
          days: dg.days,
          price: dg.price,
          seatClassId: Number(dg.seatClassIndex) + 1,
        })),
      })),
    })),
  };
};
