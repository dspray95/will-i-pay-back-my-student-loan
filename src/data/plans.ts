export type LoanPlan =
  | "plan1"
  | "plan1NI"
  | "plan2"
  | "plan4"
  | "plan5"
  | "postgrad";

export const LOAN_PLANS: {
  [key in LoanPlan]: { id: key; label: string };
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
    label: "Plan 2 (England 2012–2022, Wales 2012+)",
  },
  plan4: {
    id: "plan4",
    label: "Plan 4 (Scotland)",
  },
  plan5: {
    id: "plan5",
    label: "Plan 5 (England 2023+)",
  },
  postgrad: {
    id: "postgrad",
    label: "Postgraduate (Plan 3, England/Wales)",
  },
};

type LoanPlanByBeforeYearAndCountry = {
  [year: number]: {
    [country: string]: LoanPlan;
  };
};

/**
 * Undergrad plan mapping by cohort start and country.
 * Source: DfE / SLC rules:
 * - 1998–2011: Plan 1 (E/W), Plan 1 NI, Plan 4 Scotland.
 * - 2012–2022: Plan 2 (E/W), Plan 1 NI, Plan 4 Scotland.
 * - 2023+:     Plan 5 England, Plan 2 Wales, Plan 1 NI, Plan 4 Scotland.
 */
export const LOAN_PLANS_BY_BEFORE_YEAR_AND_COUNTRY: LoanPlanByBeforeYearAndCountry =
  {
    1998: {
      ENGLAND: "plan1",
      WALES: "plan1",
      NORTHERN_IRELAND: "plan1NI",
      SCOTLAND: "plan4",
    },
    2011: {
      ENGLAND: "plan2",
      WALES: "plan2",
      NORTHERN_IRELAND: "plan1NI",
      SCOTLAND: "plan4",
    },
    2023: {
      ENGLAND: "plan5",
      WALES: "plan2",
      NORTHERN_IRELAND: "plan1NI",
      SCOTLAND: "plan4",
    },
  };

export const getLoanPlan = (
  startYear: number,
  country: string
): LoanPlan | "" => {
  const years = Object.keys(LOAN_PLANS_BY_BEFORE_YEAR_AND_COUNTRY)
    .map(Number)
    .sort((a, b) => b - a);
  for (const year of years) {
    if (startYear >= year) {
      return LOAN_PLANS_BY_BEFORE_YEAR_AND_COUNTRY[year][country] ?? "";
    }
  }
  return "";
};

type InterestRatesDuringStudy = {
  [key in LoanPlan]: {
    [startYear: number]: number; // annual % while studying
  };
};

/**
 * Study-period interest rates by plan and cohort year.
 * Sources:
 * - DfE / SLC statistics "Income contingent repayment plans – interest rates…"
 * - Plan 2: RPI+3%, capped where PMR applies.
 * - Plan 1/Plan 4: lower of RPI or base+1 – approximated here with HE loan stats.
 * - Plan 5: interest-free while studying (England policy).
 * - Postgrad: RPI+3% flat rate (same during study and repayment).
 */
export const INTEREST_RATES_DURING_STUDY: InterestRatesDuringStudy = {
  // Plan 1: approximated by actual study-period rates (lower of RPI or base+1)
  plan1: {
    1998: 5.0,
    2012: 1.5, // Sep 2012–Aug 2013
    2013: 1.5, // 2013–14
    2014: 1.5, // 2014–15
    2015: 0.9, // 2015–16
    2016: 1.25, // 2016–17
    2017: 1.5, // 2017–18
    2018: 1.75, // 2018–19
    2019: 1.75, // 2019–20
    2020: 1.1, // 2020–21
    2021: 1.5, // 2021–22
    2022: 5.0, // 2022–23 (RPI capped)
    2023: 6.25, // 2023–24
    2024: 4.3, // 2024–25
    2025: 4.3, // 2025–26
  },

  plan1NI: {
    1998: 5.0,
    2012: 1.5,
    2013: 1.5,
    2014: 1.5,
    2015: 0.9,
    2016: 1.25,
    2017: 1.5,
    2018: 1.75,
    2019: 1.75,
    2020: 1.1,
    2021: 1.5,
    2022: 5.0,
    2023: 6.25,
    2024: 4.3,
    2025: 4.3,
  },

  // Plan 2: RPI+3%, subject to caps. This matches gov.uk stats table.
  plan2: {
    2012: 6.6, // 2012–13
    2013: 6.3, // 2013–14
    2014: 5.5, // 2014–15
    2015: 3.9, // 2015–16
    2016: 4.6, // 2016–17
    2017: 6.1, // 2017–18
    2018: 6.3, // 2018–19
    2019: 5.4, // 2019–20
    2020: 5.6, // 2020–21
    2021: 4.5, // 2021–22
    2022: 6.9, // 2022–23 (capped)
    2023: 7.7, // 2023–24 (capped)
    2024: 7.3, // 2024–25
    2025: 7.3, // 2025–26
  },

  // Plan 4: interest-free while studying (Scottish policy)
  plan4: {
    1998: 0,
    2000: 0,
    2010: 0,
    2023: 0,
    2024: 0,
    2025: 0,
  },

  // Plan 5: interest-free while studying (policy from 2023+)
  plan5: {
    2023: 0,
    2024: 0,
    2025: 0,
  },

  // Postgrad (Plan 3): RPI+3% flat rate while studying
  postgrad: {
    2016: 4.6,
    2017: 6.1,
    2018: 6.3,
    2019: 5.4,
    2020: 5.6,
    2021: 4.5,
    2022: 6.9,
    2023: 7.7,
    2024: 7.3,
    2025: 6.2, // ✅ Added from search
  },
};

/**
 * Get the interest rate during study for a given plan and year.
 * Now handles postgrad as part of the main type system.
 */
export const getInterestRateDuringStudy = (
  startYear: number,
  plan: LoanPlan
): number => {
  const rates = INTEREST_RATES_DURING_STUDY[plan];
  if (!rates) {
    throw new Error(`No interest rate data for plan: ${plan}`);
  }

  const years = Object.keys(rates)
    .map(Number)
    .sort((a, b) => b - a);

  for (const y of years) {
    if (startYear >= y) {
      return rates[y];
    }
  }

  // Fallback to earliest known rate
  const earliestYear = years[years.length - 1];
  return rates[earliestYear] ?? 0;
};
