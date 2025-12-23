import type { LoanPlan } from "./plans";

const LONG_TERM_RPI = 2.5;

const LONG_TERM_FORECAST: {
  [key in LoanPlan]: { min: number; max: number };
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
 * Sources: Gov.uk official announcements
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
    postgrad: 21000,
  },
  2019: {
    plan1: 41000,
    plan1NI: 41000,
    plan2: 41000,
    plan4: 41000,
    plan5: 0,
    postgrad: 21000,
  },
  2020: {
    plan1: 41725,
    plan1NI: 41725,
    plan2: 41725,
    plan4: 41725,
    plan5: 0,
    postgrad: 21000,
  },
  2021: {
    plan1: 43000,
    plan1NI: 43000,
    plan2: 43000,
    plan4: 43000,
    plan5: 0,
    postgrad: 21000,
  },
  2022: {
    plan1: 43125,
    plan1NI: 43125,
    plan2: 43125,
    plan4: 43125,
    plan5: 0,
    postgrad: 21000,
  },
  2023: {
    plan1: 46850,
    plan1NI: 46850,
    plan2: 46850,
    plan4: 46850,
    plan5: 0,
    postgrad: 21000,
  },
  2024: {
    plan1: 53312,
    plan1NI: 53312,
    plan2: 53312,
    plan4: 53312,
    plan5: 0,
    postgrad: 21000,
  },
  2025: {
    plan1: 55608,
    plan1NI: 55608,
    plan2: 52885,
    plan4: 55608,
    plan5: 0,
    postgrad: 21000,
  },
  2026: {
    plan1: 57487,
    plan1NI: 57487,
    plan2: 52885,
    plan4: 57487,
    plan5: 0,
    postgrad: 21000,
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
  return UPPER_INTEREST_THRESHOLD_BY_YEAR[2026][plan];
};

/**
 * Repayment thresholds by tax year (start year) and plan.
 * Sources: Gov.uk official announcements
 */
export const REPAYMENT_THRESHOLDS_BY_YEAR: {
  [taxYearStart: number]: {
    [key in LoanPlan]: number;
  };
} = {
  2018: {
    plan1: 18330,
    plan1NI: 18330,
    plan2: 25000,
    plan4: 18330,
    plan5: 0,
    postgrad: 0,
  },
  2019: {
    plan1: 18935,
    plan1NI: 18935,
    plan2: 25725,
    plan4: 18935,
    plan5: 0,
    postgrad: 21000,
  },
  2020: {
    plan1: 19390,
    plan1NI: 19390,
    plan2: 26575,
    plan4: 19390,
    plan5: 0,
    postgrad: 21000,
  },
  2021: {
    plan1: 19895,
    plan1NI: 19895,
    plan2: 27295,
    plan4: 25000,
    plan5: 0,
    postgrad: 21000,
  },
  2022: {
    plan1: 20195,
    plan1NI: 20195,
    plan2: 27295,
    plan4: 25375,
    plan5: 0,
    postgrad: 21000,
  },
  2023: {
    plan1: 22015,
    plan1NI: 22015,
    plan2: 27295,
    plan4: 27660,
    plan5: 0,
    postgrad: 21000,
  },
  2024: {
    plan1: 24990,
    plan1NI: 24990,
    plan2: 27295,
    plan4: 31395,
    plan5: 25000,
    postgrad: 21000,
  },
  2025: {
    plan1: 26065,
    plan1NI: 26065,
    plan2: 28470,
    plan4: 32745,
    plan5: 25000,
    postgrad: 21000,
  },
  2026: {
    plan1: 26900,
    plan1NI: 26900,
    plan2: 29385,
    plan4: 33802,
    plan5: 25000,
    postgrad: 21000,
  },
};

export const getRepaymentThreshold = (
  taxYearStart: number,
  plan: LoanPlan
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
 * Post-graduation interest rates by year and plan.
 * Sources: Gov.uk official statistics (verified Dec 2025)
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
    postgrad: { min: 6.3, max: 6.3 },
  },
  2019: {
    plan1: { min: 2.4, max: 2.4 },
    plan1NI: { min: 2.4, max: 2.4 },
    plan2: { min: 2.4, max: 5.4 },
    plan4: { min: 2.4, max: 2.4 },
    plan5: { min: 0, max: 0 },
    postgrad: { min: 5.4, max: 5.4 },
  },
  2020: {
    plan1: { min: 2.6, max: 2.6 },
    plan1NI: { min: 2.6, max: 2.6 },
    plan2: { min: 2.6, max: 5.6 },
    plan4: { min: 2.6, max: 2.6 },
    plan5: { min: 0, max: 0 },
    postgrad: { min: 5.6, max: 5.6 },
  },
  2021: {
    plan1: { min: 1.5, max: 1.5 },
    plan1NI: { min: 1.5, max: 1.5 },
    plan2: { min: 1.5, max: 4.5 },
    plan4: { min: 1.5, max: 1.5 },
    plan5: { min: 0, max: 0 },
    postgrad: { min: 4.5, max: 4.5 },
  },
  2022: {
    plan1: { min: 5.0, max: 5.0 },
    plan1NI: { min: 5.0, max: 5.0 },
    plan2: { min: 5.0, max: 6.9 },
    plan4: { min: 5.0, max: 5.0 },
    plan5: { min: 0, max: 0 },
    postgrad: { min: 6.9, max: 6.9 },
  },
  2023: {
    plan1: { min: 6.25, max: 6.25 },
    plan1NI: { min: 6.25, max: 6.25 },
    plan2: { min: 5.5, max: 7.7 },
    plan4: { min: 6.25, max: 6.25 },
    plan5: { min: 0, max: 0 },
    postgrad: { min: 7.7, max: 7.7 },
  },
  2024: {
    plan1: { min: 4.3, max: 4.3 },
    plan1NI: { min: 4.3, max: 4.3 },
    plan2: { min: 3.2, max: 6.2 },
    plan4: { min: 4.3, max: 4.3 },
    plan5: { min: 4.3, max: 4.3 },
    postgrad: { min: 7.3, max: 7.3 },
  },
  2025: {
    plan1: { min: 4.3, max: 4.3 },
    plan1NI: { min: 4.3, max: 4.3 },
    plan2: { min: 4.3, max: 7.3 },
    plan4: { min: 4.3, max: 4.3 },
    plan5: { min: 4.3, max: 4.3 },
    postgrad: { min: 7.3, max: 7.3 },
  },
  2026: {
    plan1: { min: 3.2, max: 3.2 },
    plan1NI: { min: 3.2, max: 3.2 },
    plan2: { min: 3.2, max: 6.2 },
    plan4: { min: 3.2, max: 3.2 },
    plan5: { min: 3.2, max: 3.2 },
    postgrad: { min: 6.2, max: 6.2 },
  },
};

export const getInterestRateAtRepayment = (
  year: number,
  plan: LoanPlan,
  annualIncome: number
): number => {
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

  return planRates.min;
};
