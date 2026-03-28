import { env } from "@/configs/env";
import type { Country, CountryResponse } from "@/shared/types/country/country.type";

export const countryApi = {
  getCountries: async (): Promise<CountryResponse<Country[]>> => {
    return fetch(`${env.countryUrl}/countries`).then((res) => res.json());
  },

  getCities: async (country: string): Promise<CountryResponse<string[]>> => {
    return fetch(`${env.countryUrl}/countries/cities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ country }),
    }).then((res) => res.json());
  },
};
