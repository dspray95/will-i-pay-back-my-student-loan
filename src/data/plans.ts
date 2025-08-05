export type LoanPlan = "plan1" | "plan1NI" | "plan2" | "plan4" | "plan5";

export const LOAN_PLANS: {
  [key in LoanPlan]: { id: LoanPlan; label: string };
} = {
  plan1: {
    id: "plan1",
    label: "Plan 1 (England + Wales pre-2012)",
  },
  plan1NI: {
    id: "plan1NI",
    label: "Plan 1 (Northern Ireland)",
  },
  plan2: {
    id: "plan2",
    label: "Plan 2  (England 2012-2022, Wales 2012+)",
  },
  plan4: {
    id: "plan4",
    label: "Plan 4 (Scotland)",
  },
  plan5: {
    id: "plan5",
    label: "Plan 5 (England 2023+)",
  },
};

type LoanPlanByBeforeYearAndCountry = {
  [year: number]: {
    [country: string]: keyof typeof LOAN_PLANS;
  };
};

export const LOAN_PLANS_BY_BEFORE_YEAR_AND_COUNTRY: LoanPlanByBeforeYearAndCountry =
  {
    1998: {
      ENGLAND: "plan1",
      NORTHERN_IRELAND: "plan1NI",
      SCOTLAND: "plan4",
      WALES: "plan1",
    },
    2011: {
      ENGLAND: "plan2",
      NORTHERN_IRELAND: "plan1NI",
      SCOTLAND: "plan4",
      WALES: "plan2",
    },
    2023: {
      ENGLAND: "plan5",
      NORTHERN_IRELAND: "plan1NI",
      SCOTLAND: "plan4",
      WALES: "plan2",
    },
  };
