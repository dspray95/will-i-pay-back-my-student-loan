import type { CalcPlan, LoanPlan } from "./plans";

const LONG_TERM_RPI = 2.5;

const LONG_TERM_FORECAST: {
  [key in CalcPlan]: { min: number; max: number };
} = {
  plan1: { min: LONG_TERM_RPI, max: LONG_TERM_RPI },
  plan1NI: { min: LONG_TERM_RPI, max: LONG_TERM_RPI },
  plan2: { min: LONG_TERM_RPI, max: LONG_TERM_RPI + 3.0 },
  plan4: { min: LONG_TERM_RPI, max: LONG_TERM_RPI },
  plan5: { min: LONG_TERM_RPI, max: LONG_TERM_RPI },
  postgrad: { min: LONG_TERM_RPI + 3.0, max: LONG_TERM_RPI + 3.0 },
};

/**
 * Upper income thresholds for maximum Plan 2 interest.
 * These are the “upper interest thresholds” used for the sliding
 * RPI → RPI+3% band. Approximated from SLC / DfE publications.
 */
export const UPPER_INTEREST_THRESHOLD_BY_YEAR: {
  [year: number]: {
    [key in LoanPlan]: number;
  };
} = {
  2018: {
    plan1: 41000,
    plan1NI: 41000,
    plan2: 41000,
    plan4: 41000,
    plan5: 0,
  },
  2019: {
    plan1: 41000,
    plan1NI: 41000,
    plan2: 41000,
    plan4: 41000,
    plan5: 0,
  },
  2020: {
    plan1: 41725,
    plan1NI: 41725,
    plan2: 41725,
    plan4: 41725,
    plan5: 0,
  },
  2021: {
    plan1: 43000,
    plan1NI: 43000,
    plan2: 43000,
    plan4: 43000,
    plan5: 0,
  },
  2022: {
    plan1: 43125,
    plan1NI: 43125,
    plan2: 43125,
    plan4: 43125,
    plan5: 0,
  },
  2023: {
    plan1: 46850,
    plan1NI: 46850,
    plan2: 46850,
    plan4: 46850,
    plan5: 0,
  },
  2024: {
    plan1: 53312,
    plan1NI: 53312,
    plan2: 53312,
    plan4: 53312,
    plan5: 0,
  },
  2025: {
    plan1: 55608,
    plan1NI: 55608,
    plan2: 55608,
    plan4: 55608,
    plan5: 0,
  },
};

export const getUpperInterestThreshold = (
  year: number,
  plan: LoanPlan
): number => {
  const row = UPPER_INTEREST_THRESHOLD_BY_YEAR[year];
  if (row) {
    return row[plan];
  }
  return UPPER_INTEREST_THRESHOLD_BY_YEAR[2025][plan];
};

/**
 * Repayment thresholds by tax year (start year) and plan.
 * Sources:
 * - gov.uk / SLC “Previous annual repayment thresholds”
 * - HMRC “Collection of student loans from 6 April 2025”
 * Plan 2: frozen at 27,295 from 2021–2024, rises to 28,470 from 6 Apr 2025.
 * Postgrad: £21,000 from 2019 onwards (England/Wales Plan 3).
 */
export const REPAYMENT_THRESHOLDS_BY_YEAR: {
  [taxYearStart: number]: {
    [key in CalcPlan]: number;
  };
} = {
  2018: {
    // 6 Apr 2018 – 5 Apr 2019
    plan1: 18330,
    plan1NI: 18330,
    plan2: 25000,
    plan4: 18330,
    plan5: 0,
    postgrad: 0,
  },
  2019: {
    // 6 Apr 2019 – 5 Apr 2020
    plan1: 18935,
    plan1NI: 18935,
    plan2: 25725,
    plan4: 18935,
    plan5: 0,
    postgrad: 21000,
  },
  2020: {
    // 6 Apr 2020 – 5 Apr 2021
    plan1: 19390,
    plan1NI: 19390,
    plan2: 26575,
    plan4: 19390,
    plan5: 0,
    postgrad: 21000,
  },
  2021: {
    // 6 Apr 2021 – 5 Apr 2022
    plan1: 19895,
    plan1NI: 19895,
    plan2: 27295,
    plan4: 25000,
    plan5: 0,
    postgrad: 21000,
  },
  2022: {
    // 6 Apr 2022 – 5 Apr 2023
    plan1: 20195,
    plan1NI: 20195,
    plan2: 27295,
    plan4: 25375,
    plan5: 0,
    postgrad: 21000,
  },
  2023: {
    // 6 Apr 2023 – 5 Apr 2024
    plan1: 22015,
    plan1NI: 22015,
    plan2: 27295,
    plan4: 27660,
    plan5: 0,
    postgrad: 21000,
  },
  2024: {
    // 6 Apr 2024 – 5 Apr 2025
    plan1: 24990,
    plan1NI: 24990,
    plan2: 27295,
    plan4: 31395,
    plan5: 25000,
    postgrad: 21000,
  },
  2025: {
    // 6 Apr 2025 – 5 Apr 2026
    plan1: 26065,
    plan1NI: 26065,
    plan2: 28470,
    plan4: 32745,
    plan5: 25000,
    postgrad: 21000,
  },
};

export const getRepaymentThreshold = (
  taxYearStart: number,
  plan: CalcPlan
): number => {
  const row = REPAYMENT_THRESHOLDS_BY_YEAR[taxYearStart];
  if (row) {
    return row[plan];
  }
  const years = Object.keys(REPAYMENT_THRESHOLDS_BY_YEAR)
    .map(Number)
    .sort((a, b) => b - a);
  const lastYear = years[0];
  return REPAYMENT_THRESHOLDS_BY_YEAR[lastYear][plan];
};

/**
 * Post‑graduation interest rates (bands) by year and undergrad plan.
 * Values are min/max (RPI → RPI+3) or single fixed rate for that plan.
 */
export const POSTGRAD_INTEREST_RATES_REPAYMENT: {
  [year: number]: {
    [key in LoanPlan]: {
      min: number;
      max: number;
    };
  };
} = {
  2018: {
    plan1: { min: 3.3, max: 3.3 },
    plan1NI: { min: 3.3, max: 3.3 },
    plan2: { min: 3.3, max: 6.3 },
    plan4: { min: 3.3, max: 3.3 },
    plan5: { min: 0, max: 0 },
  },
  2019: {
    plan1: { min: 2.4, max: 2.4 },
    plan1NI: { min: 2.4, max: 2.4 },
    plan2: { min: 2.4, max: 5.4 },
    plan4: { min: 2.4, max: 2.4 },
    plan5: { min: 0, max: 0 },
  },
  2020: {
    plan1: { min: 2.6, max: 2.6 },
    plan1NI: { min: 2.6, max: 2.6 },
    plan2: { min: 2.6, max: 5.6 },
    plan4: { min: 2.6, max: 2.6 },
    plan5: { min: 0, max: 0 },
  },
  2021: {
    plan1: { min: 1.5, max: 1.5 },
    plan1NI: { min: 1.5, max: 1.5 },
    plan2: { min: 1.5, max: 4.5 },
    plan4: { min: 1.5, max: 1.5 },
    plan5: { min: 0, max: 0 },
  },
  2022: {
    plan1: { min: 5.0, max: 5.0 },
    plan1NI: { min: 5.0, max: 5.0 },
    plan2: { min: 5.0, max: 6.9 },
    plan4: { min: 5.0, max: 5.0 },
    plan5: { min: 0, max: 0 },
  },
  2023: {
    plan1: { min: 6.25, max: 6.25 },
    plan1NI: { min: 6.25, max: 6.25 },
    plan2: { min: 5.5, max: 7.7 },
    plan4: { min: 6.25, max: 6.25 },
    plan5: { min: 0, max: 0 },
  },
  2024: {
    plan1: { min: 4.3, max: 4.3 },
    plan1NI: { min: 4.3, max: 4.3 },
    plan2: { min: 3.2, max: 6.2 },
    plan4: { min: 4.3, max: 4.3 },
    plan5: { min: 4.3, max: 4.3 },
  },
  2025: {
    plan1: { min: 4.3, max: 4.3 },
    plan1NI: { min: 4.3, max: 4.3 },
    plan2: { min: 3.2, max: 6.2 },
    plan4: { min: 4.3, max: 4.3 },
    plan5: { min: 4.3, max: 4.3 },
  },
};

/**
 * Postgrad Plan 3 interest after graduation – single flat rate per year.
 * This is effectively the same as POSTGRAD_INTEREST_RATES (RPI+3%).
 */
export const POSTGRAD_PLAN3_INTEREST_REPAYMENT: {
  [year: number]: number;
} = {
  2018: 6.3,
  2019: 5.4,
  2020: 5.6,
  2021: 4.5,
  2022: 6.9,
  2023: 7.7,
  2024: 7.3,
};

export const getInterestRateAtRepayment = (
  year: number,
  plan: CalcPlan,
  annualIncome: number
): number => {
  if (plan === "postgrad") {
    const years = Object.keys(POSTGRAD_PLAN3_INTEREST_REPAYMENT)
      .map(Number)
      .sort((a, b) => b - a);
    const exact = POSTGRAD_PLAN3_INTEREST_REPAYMENT[year];
    if (exact !== undefined) return exact;
    // Fallback: last known or long-term forecast
    return (
      POSTGRAD_PLAN3_INTEREST_REPAYMENT[years[0]] ??
      LONG_TERM_FORECAST.postgrad.min
    );
  }

  const ratesForYear = POSTGRAD_INTEREST_RATES_REPAYMENT[year];
  const planRates = ratesForYear
    ? ratesForYear[plan]
    : LONG_TERM_FORECAST[plan];

  if (plan === "plan2") {
    const lowerThreshold = getRepaymentThreshold(year, plan);
    const upperThreshold = getUpperInterestThreshold(year, plan);

    if (annualIncome <= lowerThreshold) {
      return planRates.min;
    }
    if (annualIncome >= upperThreshold) {
      return planRates.max;
    }

    const incomeAboveLower = annualIncome - lowerThreshold;
    const incomeRange = upperThreshold - lowerThreshold;
    const rateRange = planRates.max - planRates.min;

    return planRates.min + (incomeAboveLower / incomeRange) * rateRange;
  }

  // Other undergrad plans: single rate regardless of income
  return planRates.min;
};
