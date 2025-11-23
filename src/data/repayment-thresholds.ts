import type { LoanPlan } from "./plans";

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
  const thresholds = UPPER_INTEREST_THRESHOLD_BY_YEAR[year];
  if (thresholds) {
    return thresholds[plan];
  }

  // Use 2025 values for any year beyond our data
  return UPPER_INTEREST_THRESHOLD_BY_YEAR[2025][plan];
};

// data/repaymentThresholds.ts
export const REPAYMENT_THRESHOLDS_BY_YEAR: {
  [year: number]: {
    [key in LoanPlan]: number;
  };
} = {
  2018: {
    plan1: 17775,
    plan1NI: 17775,
    plan2: 25000,
    plan4: 17775,
    plan5: 0,
  },
  2019: {
    plan1: 18330,
    plan1NI: 18330,
    plan2: 25725,
    plan4: 18330,
    plan5: 0,
  },
  2020: {
    plan1: 18935,
    plan1NI: 18935,
    plan2: 26575,
    plan4: 18935,
    plan5: 0,
  },
  2021: {
    plan1: 19895,
    plan1NI: 19895,
    plan2: 27295,
    plan4: 25000,
    plan5: 0,
  },
  2022: {
    plan1: 20195,
    plan1NI: 20195,
    plan2: 27295,
    plan4: 25375,
    plan5: 0,
  },
  2023: {
    plan1: 22015,
    plan1NI: 22015,
    plan2: 27295,
    plan4: 27660,
    plan5: 0,
  },
  2024: {
    plan1: 24990,
    plan1NI: 24990,
    plan2: 27295,
    plan4: 31395,
    plan5: 25000,
  },
  2025: {
    plan1: 26065,
    plan1NI: 26065,
    plan2: 28470,
    plan4: 32745,
    plan5: 25000,
  },
};

// Post-graduation interest rates by plan
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

export const getRepaymentThreshold = (year: number, plan: LoanPlan): number => {
  const thresholds = REPAYMENT_THRESHOLDS_BY_YEAR[year];
  if (thresholds) {
    return thresholds[plan];
  }

  // Use latest values for any year beyond our data
  return REPAYMENT_THRESHOLDS_BY_YEAR[2025][plan];
};

export const getInterestRateAtRepayment = (
  year: number,
  plan: LoanPlan,
  annualIncome: number
): number => {
  const rates = POSTGRAD_INTEREST_RATES_REPAYMENT[year];
  const planRates = rates
    ? rates[plan]
    : POSTGRAD_INTEREST_RATES_REPAYMENT[2025][plan];

  // Only Plan 2 has income-dependent interest
  if (plan === "plan2") {
    const lowerThreshold = getRepaymentThreshold(year, plan);
    const upperThreshold = getUpperInterestThreshold(year, plan);

    if (annualIncome <= lowerThreshold) {
      return planRates.min;
    }
    if (annualIncome >= upperThreshold) {
      return planRates.max;
    }

    const incomeAboveThreshold = annualIncome - lowerThreshold;
    const incomeRange = upperThreshold - lowerThreshold;
    const rateRange = planRates.max - planRates.min;
    return planRates.min + (incomeAboveThreshold / incomeRange) * rateRange;
  }

  // All other plans use fixed rate regardless of income
  return planRates.min;
};
