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
    price: flight?.price || 0,
    notes: flight?.notes || "",
    unitPrice: flight?.unitPrice || "",
    provider: flight?.provider || "",
    fromCountry: flight?.fromCountry || "",
    fromCity: flight?.fromCity || "",
    toCountry: flight?.toCountry || "",
    toCity: flight?.toCity || "",
    isActive: flight?.isActive || false,
  };
};

export const mapFlightFormValuesToPayload = (formValues: FlightFormValues): Omit<Flight, "id"> => {
  return {
    ...formValues,
  };
};
