import { countryApi } from "@/modules/masterData/country/api/country.api";
import { countryKeys } from "@/shared/constants/query-key.constant";
import { useQuery } from "@tanstack/react-query";

export const useCountries = () => {
  return useQuery({
    queryKey: countryKeys.lists(),
    queryFn: () => countryApi.getCountries(),
    select: (res) => res.data,
  });
};
