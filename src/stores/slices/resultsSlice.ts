import type { StateCreator } from "zustand";
import type { RepaymentPlan } from "../../shared/types";
import type { LoanFormValues } from "../../shared/schemas/LoanFormSchema";
import { getForgivenessPlanForYear } from "../../domain/loan/forgiveness";
import { calculateRepaymentPlan } from "../../domain/repayment/calculateRepaymentPlan";
import type { LoanCalculatorState } from "../loanCalculatorStore";

export interface ResultsSlice {
  undergraduateRepaymentPlan?: RepaymentPlan;
  postgraduateRepaymentPlan?: RepaymentPlan;
  calculateRepaymentWithIncome: (
    incomeByYear: Record<number, number>,
    loanFormValues: LoanFormValues,
  ) => void;
}

export const resultsInitialState = {
  undergraduateRepaymentPlan: undefined as RepaymentPlan | undefined,
  postgraduateRepaymentPlan: undefined as RepaymentPlan | undefined,
};

export const createResultsSlice: StateCreator<
  LoanCalculatorState,
  [],
  [],
  ResultsSlice
> = (set, get) => ({
  ...resultsInitialState,

  calculateRepaymentWithIncome: (incomeByYear, loanFormValues) => {
    if (!loanFormValues) return;

    const state = get();
    const repaymentEnd = getForgivenessPlanForYear(
      loanFormValues.courseStartYear,
      loanFormValues.loanPlan,
    );

    const graduationYear =
      loanFormValues.courseStartYear + loanFormValues.courseLength;
    const repaymentEndYear = graduationYear + repaymentEnd;

    const undergraduateRepayment = calculateRepaymentPlan(
      state.undergraduateLoanAtGraduation,
      graduationYear,
      repaymentEndYear,
      loanFormValues.loanPlan,
      incomeByYear,
      state.projectedInflationRate,
    );

    const mastersStartYear =
      typeof loanFormValues.mastersStartYear === "number"
        ? loanFormValues.mastersStartYear
        : 0;
    const mastersLength =
      typeof loanFormValues.mastersLength === "number"
        ? loanFormValues.mastersLength
        : 0;

    const postgraduateRepayment =
      state.totalMastersLoan > 0
        ? calculateRepaymentPlan(
            state.postgraduateLoanAtGraduation,
            mastersStartYear + mastersLength,
            mastersStartYear + mastersLength + 30,
            "postgrad",
            incomeByYear,
            state.projectedInflationRate,
          )
        : {
            finalBalance: 0,
            totalRepaid: 0,
            yearByYearBreakdown: [],
          };

    set({
      undergraduateRepaymentPlan: undergraduateRepayment,
      postgraduateRepaymentPlan: postgraduateRepayment,
    });
  },
});
