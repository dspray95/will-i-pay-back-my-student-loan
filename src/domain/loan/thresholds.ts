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

// Plans with thresholds frozen by policy (no growth projection)
const FROZEN_THRESHOLD_PLANS: LoanPlan[] = ["plan5", "postgrad"];

function getMostRecentYear(data: ThresholdsByYear): number {
  return Object.keys(data)
    .map(Number)
    .sort((a, b) => b - a)[0];
}

function projectThreshold(
  baseValue: number,
  yearsAhead: number,
  growthRate: number
): number {
  return Math.round(baseValue * Math.pow(1 + growthRate / 100, yearsAhead));
}

/**
 * Get the repayment threshold for a given tax year and loan plan.
 *
 * If the requested year is not found in the data, projects forward from the
 * most recent known value using compound growth. Plan 5 and Postgrad
 * thresholds are frozen by policy and do not grow.
 *
 * @param taxYearStart - The start year of the tax year (e.g., 2025 for tax year 2025/26)
 * @param plan - The loan plan type
 * @param growthRate - Annual growth rate as a percentage (e.g., 2.5 for 2.5%) for projecting future thresholds
 * @returns The annual income threshold at which repayments begin
 *
 * @example
 * getRepaymentThreshold(2025, "plan2") // Returns 28470
 *
 * Sources: Gov.uk official announcements
 */
export function getRepaymentThreshold(
  taxYearStart: number,
  plan: LoanPlan,
  growthRate?: number
): number {
  const row = REPAYMENT_THRESHOLDS[taxYearStart];
  if (row) {
    return row[plan];
  }

  const lastYear = getMostRecentYear(REPAYMENT_THRESHOLDS);
  const baseValue = REPAYMENT_THRESHOLDS[lastYear][plan];

  if (
    taxYearStart > lastYear &&
    growthRate !== undefined &&
    !FROZEN_THRESHOLD_PLANS.includes(plan)
  ) {
    return projectThreshold(baseValue, taxYearStart - lastYear, growthRate);
  }

  return baseValue;
}

/**
 * Get the upper interest threshold for a given year and loan plan.
 *
 * This is the income level at which Plan 2 loans reach their maximum
 * interest rate. Projects forward from the most recent known value using
 * compound growth for future years.
 *
 * @param year - The calendar year
 * @param plan - The loan plan type
 * @param growthRate - Annual growth rate as a percentage for projecting future thresholds
 * @returns The upper income threshold for maximum interest
 *
 * @example
 * getUpperInterestThreshold(2025, "plan2") // Returns 52885
 *
 * Sources: Gov.uk official announcements
 */
export function getUpperInterestThreshold(
  year: number,
  plan: LoanPlan,
  growthRate?: number
): number {
  const row = UPPER_INTEREST_THRESHOLDS[year];
  if (row) {
    return row[plan];
  }

  const lastYear = getMostRecentYear(UPPER_INTEREST_THRESHOLDS);
  const baseValue = UPPER_INTEREST_THRESHOLDS[lastYear][plan];

  if (
    year > lastYear &&
    growthRate !== undefined &&
    !FROZEN_THRESHOLD_PLANS.includes(plan)
  ) {
    return projectThreshold(baseValue, year - lastYear, growthRate);
  }

  return baseValue;
}
