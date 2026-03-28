import { countryApi } from "@/modules/masterData/country/api/country.api";
import { countryKeys } from "@/shared/constants/query-key.constant";
import { useQuery } from "@tanstack/react-query";

export const useCities = (country: string) => {
  return useQuery({
    enabled: !!country,
    queryKey: countryKeys.cities(country),
    queryFn: () => countryApi.getCities(country),
    select: (res) => res.data,
  });
};
