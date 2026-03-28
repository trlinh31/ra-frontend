import { env } from "@/configs/env";
import type { CountryResponse } from "@/shared/types/country/country.type";

export const countryApi = {
  getCountries: async (): Promise<CountryResponse> => {
    return fetch(`${env.countryUrl}/countries`).then((res) => res.json());
  },
};
