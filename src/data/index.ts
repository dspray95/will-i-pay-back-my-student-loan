import { getLatestDataForYear } from "../utils/getLatestDataForYear";
import {
  FEES_LOANS_AND_GRANTS_BY_YEAR,
  getFeesForYear,
  type FeesLoansAndGrants,
  type FeesLoansAndGrantsByYear,
} from "./fees";
import {
  LOAN_PLANS,
  LOAN_PLANS_BY_BEFORE_YEAR_AND_COUNTRY,
  type LoanPlan,
} from "./plans";
import {
  getForgivenessPlanForYear,
  LOAN_FORGIVENESS_ENG_WAL_POSTGRAD,
  LOAN_FORGIVENESS_NI_POSTGRAD,
  LOAN_FORGIVENESS_SCOT_POSTGRAD,
  LOAN_FORGIVENESS_TIME_YEARS,
} from "./forgiveness";

// functions
export { getLatestDataForYear, getFeesForYear, getForgivenessPlanForYear };

// constants
export {
  FEES_LOANS_AND_GRANTS_BY_YEAR,
  LOAN_PLANS,
  LOAN_PLANS_BY_BEFORE_YEAR_AND_COUNTRY,
  LOAN_FORGIVENESS_ENG_WAL_POSTGRAD,
  LOAN_FORGIVENESS_NI_POSTGRAD,
  LOAN_FORGIVENESS_SCOT_POSTGRAD,
  LOAN_FORGIVENESS_TIME_YEARS,
};

// types
export type { FeesLoansAndGrants, FeesLoansAndGrantsByYear, LoanPlan };
