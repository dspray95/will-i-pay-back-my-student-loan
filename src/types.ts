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
