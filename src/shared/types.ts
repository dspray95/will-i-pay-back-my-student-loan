import type z from "zod";
import type { STAGES } from "./constants/stages";
import type { LoanFormSchema } from "./schemas/LoanFormSchema";

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

export type LoanPlan = z.infer<typeof LoanFormSchema>["loanPlan"] & {};

export type Stage = (typeof STAGES)[keyof typeof STAGES];
