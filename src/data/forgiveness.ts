import type { LOAN_PLANS, LoanPlan } from "./plans";

type LoanForgivenessYearsByPlan = {
  [key in keyof typeof LOAN_PLANS]: {
    [year: number]: number; // A year can map to either a single forgiveness criterion or an array of criteria
  };
};

// Object holding the loan forgiveness rules for each loan plan
export const LOAN_FORGIVENESS_TIME_YEARS: LoanForgivenessYearsByPlan = {
  // Plan 1: Loans written off 25 years after the first repayment date if taken on or after 2006
  // Loans taken before 2006 are written off at age 65.
  plan1: {
    1998: 25, // Loans taken before 2006 are written off at age 65
    2006: 25, // Loans taken in or after 2006 are written off 25 years after the April due to repay
  },
  // Plan 1 for Northern Ireland follows the same rules as Plan 1.
  plan1NI: {
    1998: 25, // Same as Plan 1 for loans before 2006
    2006: 25, // Same as Plan 1 for loans from 2006 onwards
  },

  // Plan 2: Loans written off 30 years after the first repayment due date
  // Loans taken from 2011 onwards follow this rule.
  plan2: {
    2011: 30, // Loans taken in or after 2011 are written off after 30 years
  },

  // Plan 4: Loans have two conditions depending on when they were first due to repay.
  // Before 2007, loans are written off at age 65 or 30 years after the April due to repay, whichever comes first.
  // After 2007, loans are written off 30 years after the first repayment due date.
  plan4: {
    1998: 30, // Before 2007: written off at age-65 OR 30 years after repayment (whichever comes first)
    2007: 30, // After 2007: written off 30 years after the first repayment due date
  },

  // Plan 5: Loans taken from 2023 onwards are written off after 40 years.
  plan5: {
    2023: 40, // Written off 40 years after the first repayment due date
  },
};

// Postgraduate loans in England and Wales are written off 30 years after the first repayment due date
export const LOAN_FORGIVENESS_ENG_WAL_POSTGRAD = 30;

// Northern Ireland students on postgraduate loans follow the Plan 1 forgiveness rules (written off at age 65 or after 25 years)
export const LOAN_FORGIVENESS_NI_POSTGRAD = 30; // Follows Plan 1 forgiveness for postgraduate loans

// Scottish postgraduate loans follow Plan 4 forgiveness rules (written off 30 years after the first repayment due date)
export const LOAN_FORGIVENESS_SCOT_POSTGRAD = 30; // Follows Plan 4 forgiveness for postgraduate loans

export const getForgivenessPlanForYear = (
  year: number,
  plan: LoanPlan
): number => {
  let data = LOAN_FORGIVENESS_TIME_YEARS[plan];
  if (!data) {
    throw new Error(`No forgiveness data found for plan: ${plan}`);
  }
  for (const [startYear, years] of Object.entries(data)) {
    if (year >= Number(startYear)) {
      return years;
    }
  }
  return FORGIVENESS_YEARS_FALLBACK;
};

const FORGIVENESS_YEARS_FALLBACK = 30;
