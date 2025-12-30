import type { LoanPlanInfo } from "./types";
import type { LoanPlan } from "../../shared/types";

import loanPlansData from "../../data/loan-plans.json";

interface LoanPlansData {
  plans: {
    [key in LoanPlan]: LoanPlanInfo;
  };
  plansByStartYearAndCountry: {
    [year: number]: {
      [country: string]: LoanPlan;
    };
  };
  interestRatesDuringStudy: {
    [key in LoanPlan]: {
      [startYear: number]: number;
    };
  };
}

const DATA = loanPlansData as LoanPlansData;

export const LOAN_PLANS = DATA.plans;

/**
 * Get the appropriate loan plan based on course start year and country.
 *
 * Undergrad plan mapping by cohort start and country:
 * - 1998–2011: Plan 1 (E/W), Plan 1 NI, Plan 4 Scotland.
 * - 2012–2022: Plan 2 (E/W), Plan 1 NI, Plan 4 Scotland.
 * - 2023+:     Plan 5 England, Plan 2 Wales, Plan 1 NI, Plan 4 Scotland.
 *
 * @param startYear - The year the course started
 * @param country - The country code (ENGLAND, WALES, NORTHERN_IRELAND, SCOTLAND)
 * @returns The loan plan type, or empty string if not found
 *
 * @example
 * getLoanPlan(2015, "ENGLAND") // Returns "plan2"
 * getLoanPlan(2024, "ENGLAND") // Returns "plan5"
 *
 * Sources: DfE / SLC rules
 */
export function getLoanPlan(startYear: number, country: string): LoanPlan | "" {
  const years = Object.keys(DATA.plansByStartYearAndCountry)
    .map(Number)
    .sort((a, b) => b - a);

  for (const year of years) {
    if (startYear >= year) {
      return DATA.plansByStartYearAndCountry[year][country] ?? "";
    }
  }

  return "";
}

/**
 * Get the interest rate applied during the study period for a given plan and year.
 *
 * Study-period interest rates by plan and cohort year:
 * - Plan 2: RPI+3%, capped where PMR applies.
 * - Plan 1/Plan 4: lower of RPI or base+1.
 * - Plan 5: interest-free while studying (England policy).
 * - Postgrad: RPI+3% flat rate.
 *
 * Falls back to the earliest available rate if the requested year predates
 * the data.
 *
 * @param startYear - The year the course started
 * @param plan - The loan plan type
 * @returns The interest rate as a percentage (e.g., 4.3 for 4.3%)
 *
 * @example
 * getInterestRateDuringStudy(2025, "plan2") // Returns 6.2
 * getInterestRateDuringStudy(2023, "plan5") // Returns 0
 *
 * @throws {Error} If no interest rate data exists for the plan
 *
 * Sources: Gov.uk official statistics (verified Dec 2025)
 */
export function getInterestRateDuringStudy(
  startYear: number,
  plan: LoanPlan
): number {
  const rates = DATA.interestRatesDuringStudy[plan];
  if (!rates) {
    throw new Error(`No interest rate data for plan: ${plan}`);
  }

  const years = Object.keys(rates)
    .map(Number)
    .sort((a, b) => b - a);

  for (const year of years) {
    if (startYear >= year) {
      return rates[year];
    }
  }

  // Fallback to earliest year if startYear predates all data
  const earliestYear = years[years.length - 1];
  return rates[earliestYear] ?? 0;
}
