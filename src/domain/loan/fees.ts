import type { FeesLoansAndGrants, FeesLoansAndGrantsByYear } from "./types";
import feesData from "../../data/fees-loans-grants.json";

const FEES_LOANS_AND_GRANTS = feesData as FeesLoansAndGrantsByYear;

/**
 * Get the fees, loans, and grants amounts for a given academic year.
 *
 * Returns the data for the most recent year available if the requested year
 * is not in the dataset (i.e., uses the latest applicable rates).
 *
 * Historical highlights:
 * - 1998: Tuition fees introduced at £1,000
 * - 2006: Fees increased to £3,000, maintenance loans introduced
 * - 2012: Fees tripled to £9,000 (Plan 2 introduced)
 * - 2016: Postgraduate loans introduced at £10,000, maintenance grants removed
 * - 2017: Fees increased to £9,250
 * - 2023+: Fees frozen at £9,535, maintenance/postgrad loans continue rising
 *
 * @param year - The academic year start (e.g., 2025 for 2025/26)
 * @returns Object containing tuition, maintenance loan, maintenance grant, and postgraduate loan amounts
 *
 * @example
 * getFeesForYear(2025) // Returns { tuition: 9535, maintenanceLoan: 10544, ... }
 * getFeesForYear(2030) // Returns 2025 data (most recent available)
 *
 * Sources: Gov.uk / SLC official figures
 */
export function getFeesForYear(year: number): FeesLoansAndGrants {
  // Find the most recent year that's <= the requested year
  const years = Object.keys(FEES_LOANS_AND_GRANTS)
    .map(Number)
    .sort((a, b) => b - a);

  for (const availableYear of years) {
    if (year >= availableYear) {
      return FEES_LOANS_AND_GRANTS[availableYear];
    }
  }

  // Fallback to earliest year if requested year predates all data
  const earliestYear = years[years.length - 1];
  return FEES_LOANS_AND_GRANTS[earliestYear];
}
