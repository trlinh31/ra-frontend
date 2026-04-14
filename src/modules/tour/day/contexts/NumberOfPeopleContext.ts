import { createContext, useContext } from "react";

const NumberOfPeopleContext = createContext<number>(1);

export const NumberOfPeopleProvider = NumberOfPeopleContext.Provider;

export function useNumberOfPeople(): number {
  return useContext(NumberOfPeopleContext);
}
