export type CountryResponse = {
  error: boolean;
  msg: string;
  data: Country[];
};

export type Country = {
  iso2: string;
  iso3: string;
  country: string;
  cities: string[];
};
