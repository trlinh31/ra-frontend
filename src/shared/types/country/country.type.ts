export type CountryResponse<T> = {
  error: boolean;
  msg: string;
  data: T;
};

export type Country = {
  iso2: string;
  iso3: string;
  country: string;
  cities: string[];
};
