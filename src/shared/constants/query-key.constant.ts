export const countryKeys = {
  all: ["countries"] as const,
  lists: () => [...countryKeys.all, "list"] as const,
  cities: (countryCode: string) => [...countryKeys.lists(), "cities", countryCode] as const,
};
