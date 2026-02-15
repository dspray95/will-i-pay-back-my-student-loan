import type { LoanPlan } from "../../shared/types";
import forgivenessData from "../../data/loan-forgiveness.json";

interface LoanForgivenessData {
  forgivenessByPlan: {
    [key in LoanPlan]: {
      [year: number]: number;
    };
  };
  fallbackYears: number;
}

const DATA = forgivenessData as LoanForgivenessData;

/**
 * Get the number of years until loan forgiveness for a given plan and start year.
 *
 * Forgiveness rules by plan:
 * - Plan 1: Loans written off 25 years after first repayment date (for loans from 2006+).
 *   Loans before 2006 are written off at age 65.
 * - Plan 1 NI: Same as Plan 1.
 * - Plan 2: Loans written off 30 years after first repayment date (from 2011+).
 * - Plan 4: Loans written off 30 years after first repayment date.
 *   Before 2007: written off at age 65 OR 30 years (whichever comes first).
 *   After 2007: written off 30 years after first repayment date.
 * - Plan 5: Loans written off 40 years after first repayment date (from 2023+).
 * - Postgraduate: Loans written off 30 years after first repayment date.
 *
 * Falls back to 30 years if no matching rule is found.
 *
 * @param year - The course start year
 * @param plan - The loan plan type
 * @returns The number of years until forgiveness
 *
 * @example
 * getForgivenessPlanForYear(2015, "plan2") // Returns 30
 * getForgivenessPlanForYear(2024, "plan5") // Returns 40
 *
 * @throws {Error} If no forgiveness data exists for the plan
 *
 * Sources: Gov.uk official student loan forgiveness rules
 */
export function getForgivenessPlanForYear(
  year: number,
  plan: LoanPlan
): number {
  const planData = DATA.forgivenessByPlan[plan];

  if (!planData) {
    throw new Error(`No forgiveness data found for plan: ${plan}`);
  }

  // Find the most recent applicable rule
  const years = Object.keys(planData)
    .map(Number)
    .sort((a, b) => b - a);

  for (const startYear of years) {
    if (year >= startYear) {
      return planData[startYear];
    }
  }

  // Fallback if year predates all rules return the earliest rule for this specific plan
  // e.g., for Plan 1, return the 1998 rule (25 years)
  const earliestYearAvailable = years[years.length - 1];
  return planData[earliestYearAvailable];
}

/**
 * Postgraduate loan forgiveness periods by region.
 * All postgraduate loans are written off 30 years after first repayment.
 */
export const POSTGRAD_FORGIVENESS_YEARS = {
  ENGLAND_WALES: 30,
  NORTHERN_IRELAND: 30,
  SCOTLAND: 30,
} as const;
