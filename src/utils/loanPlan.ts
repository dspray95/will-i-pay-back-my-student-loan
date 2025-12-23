import { LOAN_PLANS_BY_START_YEAR_AND_COUNTRY } from "../data";

export const getLoanPlan = (startYear: number, country: string) => {
  // Find the appropriate year range
  const years = Object.keys(LOAN_PLANS_BY_START_YEAR_AND_COUNTRY)
    .map(Number)
    .sort((a, b) => b - a); // Sort descending

  for (const year of years) {
    if (startYear >= year) {
      return LOAN_PLANS_BY_START_YEAR_AND_COUNTRY[year][country] || "";
    }
  }
  return "";
};
