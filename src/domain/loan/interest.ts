import type { InterestRateRange } from "./types";
import type { LoanPlan } from "../../shared/types";
import interestRatesData from "../../data/interest-rates.json";
import { getRepaymentThreshold, getUpperInterestThreshold } from "./thresholds";

interface InterestRatesByYear {
  [year: number]: {
    [key in LoanPlan]: InterestRateRange;
  };
}

interface InterestRatesData {
  longTermRPI: number;
  postGradRepayment: InterestRatesByYear;
}

const INTEREST_RATES = interestRatesData as InterestRatesData;
const LONG_TERM_RPI = INTEREST_RATES.longTermRPI;
const POSTGRAD_INTEREST_RATES = INTEREST_RATES.postGradRepayment;

// Calculate long-term forecast based on RPI
function buildLongTermForecast(rpi: number): {
  [key in LoanPlan]: InterestRateRange;
} {
  return {
    plan1: { min: rpi, max: rpi },
    plan1NI: { min: rpi, max: rpi },
    plan2: { min: rpi, max: rpi + 3.0 },
    plan4: { min: rpi, max: rpi },
    plan5: { min: rpi, max: rpi },
    postgrad: { min: rpi + 3.0, max: rpi + 3.0 },
  };
}

const LONG_TERM_FORECAST = buildLongTermForecast(LONG_TERM_RPI);

/**
 * Calculate the interest rate for a given year, plan, and income level.
 *
 * Plan 2 uses progressive interest rates that increase with income between
 * the repayment threshold and upper interest threshold. All other plans use
 * flat rates.
 *
 * If the requested year is not in the historical data, falls back to the
 * long-term forecast based on RPI.
 *
 * @param year - The calendar year for which to calculate interest
 * @param plan - The loan plan type
 * @param annualIncome - The borrower's annual income
 * @returns The interest rate as a percentage (e.g., 4.3 for 4.3%)
 *
 * @example
 * // Below threshold - minimum rate
 * getInterestRateAtRepayment(2025, "plan2", 20000) // Returns 4.3
 *
 * // Above upper threshold - maximum rate
 * getInterestRateAtRepayment(2025, "plan2", 60000) // Returns 7.3
 *
 * // Between thresholds - progressive rate
 * getInterestRateAtRepayment(2025, "plan2", 40000) // Returns ~5.8
 *
 * Sources: Gov.uk official statistics (verified Dec 2025)
 */
export function getInterestRateAtRepayment(
  year: number,
  plan: LoanPlan,
  annualIncome: number,
  overrideRepaymentThreshold?: number,
  longTermRPI?: number,
  thresholdGrowthRate?: number
): number {
  const ratesForYear = POSTGRAD_INTEREST_RATES[year];
  const forecast =
    longTermRPI !== undefined
      ? buildLongTermForecast(longTermRPI)
      : LONG_TERM_FORECAST;
  const planRates = ratesForYear ? ratesForYear[plan] : forecast[plan];

  // Plan 2 uses progressive interest rates based on income
  if (plan === "plan2") {
    const lowerThreshold =
      overrideRepaymentThreshold ?? getRepaymentThreshold(year, plan, thresholdGrowthRate);
    const upperThreshold = getUpperInterestThreshold(year, plan, thresholdGrowthRate);

    if (annualIncome <= lowerThreshold) {
      return planRates.min;
    }
    if (annualIncome >= upperThreshold) {
      return planRates.max;
    }

    // Linear interpolation between thresholds
    const incomeAboveLower = annualIncome - lowerThreshold;
    const incomeRange = upperThreshold - lowerThreshold;
    const rateRange = planRates.max - planRates.min;

    return planRates.min + (incomeAboveLower / incomeRange) * rateRange;
  }

  // All other plans use flat rates
  return planRates.min;
}
