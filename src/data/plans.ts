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

type InterestRatesDuringStudy = {
  [key in LoanPlan]: {
    [startYear: number]: number; // Annual interest rate % for that cohort
  };
};

export const INTEREST_RATES_DURING_STUDY: InterestRatesDuringStudy = {
  // Plan 1: Lower of RPI or Bank Base Rate + 1%
  plan1: {
    1998: 5.0, // Historical average for older cohorts
    2012: 1.5, // Sep 2012-Aug 2013
    2013: 1.5, // Sep 2013-Aug 2014
    2014: 1.5, // Sep 2014-Aug 2015
    2015: 0.9, // Sep 2015-Aug 2016
    2016: 1.25, // Sep 2016-Aug 2017
    2017: 1.5, // Sep 2017-Aug 2018
    2018: 1.75, // Sep 2018-Aug 2019
    2019: 1.75, // Sep 2019-Aug 2020
    2020: 1.1, // Sep 2020-Aug 2021
    2021: 1.5, // Sep 2021-Aug 2022
    2022: 5.0, // Sep 2022-Aug 2023 (RPI cap applied)
    2023: 6.25, // Sep 2023-Aug 2024
    2024: 4.3, // Sep 2024-Aug 2025
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
  },

  // Plan 2: RPI + 3% (except where PMR cap applies)
  plan2: {
    2012: 6.6, // Sep 2012-Aug 2013 (RPI + 3%)
    2013: 6.3, // Sep 2013-Aug 2014
    2014: 5.5, // Sep 2014-Aug 2015
    2015: 3.9, // Sep 2015-Aug 2016
    2016: 4.6, // Sep 2016-Aug 2017
    2017: 6.1, // Sep 2017-Aug 2018
    2018: 6.3, // Sep 2018-Aug 2019
    2019: 5.4, // Sep 2019-Aug 2020
    2020: 5.6, // Sep 2020-Aug 2021
    2021: 4.5, // Sep 2021-Aug 2022
    2022: 6.9, // Sep 2022-Aug 2023 (PMR cap)
    2023: 7.7, // Sep 2023-Aug 2024 (PMR cap)
    2024: 7.3, // Sep 2024-Aug 2025 (RPI + 3%, capped at PMR)
  },

  // Plan 4: Interest-free during study in Scotland
  plan4: {
    1998: 0,
    2000: 0,
    2010: 0,
    2023: 0,
  },

  // Plan 5: Interest-free during study
  plan5: {
    2023: 0,
    2024: 0,
  },
};

// Postgraduate loan interest rates (Plan 3)
export const POSTGRAD_INTEREST_RATES: {
  [year: number]: number;
} = {
  2018: 6.3, // Sep 2018-Aug 2019 (RPI + 3%)
  2019: 5.4, // Sep 2019-Aug 2020
  2020: 5.6, // Sep 2020-Aug 2021
  2021: 4.1, // Oct 2021-Dec 2021 (interest cap)
  2022: 4.5, // Mar 2022-Aug 2022
  2023: 6.5, // Dec 2022-Feb 2023 (PMR cap)
  2024: 7.7, // Sep 2023-Aug 2024
  2025: 7.3, // Sep 2024-Aug 2025
};

export const getInterestRateDuringStudy = (
  startYear: number,
  plan: LoanPlan,
  isPostgrad?: boolean
): number => {
  if (isPostgrad) {
    const years = Object.keys(POSTGRAD_INTEREST_RATES)
      .map(Number)
      .sort((a, b) => b - a);

    for (const year of years) {
      if (startYear >= year) {
        return POSTGRAD_INTEREST_RATES[year];
      }
    }
    return 7.3; // default from plan 2 2024
  }

  const rates = INTEREST_RATES_DURING_STUDY[plan];
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

  return 0;
};
