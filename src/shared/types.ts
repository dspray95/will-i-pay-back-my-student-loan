import type { STAGES } from "./constants/stages";

export type RepaymentBreakdown = Array<{
  year: number;
  startingBalance: number;
  interestAccrued: number;
  repayment: number;
  endingBalance: number;
  income: number;
}>;

export type RepaymentPlan = {
  finalBalance: number;
  totalRepaid: number;
  yearByYearBreakdown: RepaymentBreakdown;
};

export type LoanFormValues = {
  courseStartYear: number;
  courseLength: number;
  country: string;
  loanPlan: LoanPlan;
  tutionFeeLoan: number;
  mastersTutionFeeLoan: number;
  maintenanceLoan: number;
  maintenanceGrant: number;
  postgrad: string;
  mastersStartYear: number;
  mastersLength: number;
};

export type LoanPlan =
  | "plan1"
  | "plan1NI"
  | "plan2"
  | "plan4"
  | "plan5"
  | "postgrad";

export type Stage = (typeof STAGES)[keyof typeof STAGES];
