import type { LoanPlan } from "../data";

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
