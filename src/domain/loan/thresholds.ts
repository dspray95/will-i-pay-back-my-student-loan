import repaymentThresholdsData from "../../data/repayment-thresholds.json" with {type: 'json'};
import upperInterestThresholdsData from "../../data/upper-interest-thresholds.json";
import type { LoanPlan } from "../../shared/types";

interface ThresholdsByYear {
  [year: number]: {
    [key in LoanPlan]: number;
  };
}

const REPAYMENT_THRESHOLDS = repaymentThresholdsData as ThresholdsByYear;
const UPPER_INTEREST_THRESHOLDS =
  upperInterestThresholdsData as ThresholdsByYear;

/**
 * Get the repayment threshold for a given tax year and loan plan.
 *
 * If the requested year is not found in the data, falls back to the most
 * recent year available.
 *
 * @param taxYearStart - The start year of the tax year (e.g., 2025 for tax year 2025/26)
 * @param plan - The loan plan type
 * @returns The annual income threshold at which repayments begin
 *
 * @example
 * getRepaymentThreshold(2025, "plan2") // Returns 28470
 *
 * Sources: Gov.uk official announcements
 */
export function getRepaymentThreshold(
  taxYearStart: number,
  plan: LoanPlan
): number {
  const row = REPAYMENT_THRESHOLDS[taxYearStart];
  if (row) {
    return row[plan];
  }

  // Fallback to most recent year if requested year not found
  const years = Object.keys(REPAYMENT_THRESHOLDS)
    .map(Number)
    .sort((a, b) => b - a);
  const lastYear = years[0];
  return REPAYMENT_THRESHOLDS[lastYear][plan];
}

/**
 * Get the upper interest threshold for a given year and loan plan.
 *
 * This is the income level at which Plan 2 loans reach their maximum
 * interest rate. Falls back to 2026 data if the requested year is not found.
 *
 * @param year - The calendar year
 * @param plan - The loan plan type
 * @returns The upper income threshold for maximum interest
 *
 * @example
 * getUpperInterestThreshold(2025, "plan2") // Returns 52885
 *
 * Sources: Gov.uk official announcements
 */
export function getUpperInterestThreshold(
  year: number,
  plan: LoanPlan
): number {
  const row = UPPER_INTEREST_THRESHOLDS[year];
  if (row) {
    return row[plan];
  }
  return UPPER_INTEREST_THRESHOLDS[2026][plan];
}
