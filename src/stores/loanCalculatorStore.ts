import { create } from "zustand";
import type { LoanFormValues, RepaymentPlan } from "../shared/types";
import { getForgivenessPlanForYear } from "../domain/loan/forgiveness";
import { calculateLoanAtGraduation } from "../domain/loan/calculateLoanAtGraduation";
import { calculateRepaymentPlan } from "../domain/repayment/calculateRepaymentPlan";

const STAGES = ["loanForm", "income", "finish"] as const;
type Stage = (typeof STAGES)[number];

interface LoanCalculatorState {
  // State
  stage: Stage;
  loanFormValues?: LoanFormValues;
  totalUndergradLoan: number;
  totalMaintenanceLoan: number;
  totalMastersLoan: number;
  undergraduateLoanAtGraduation: number;
  postgraduateLoanAtGraduation: number;
  incomeByYear: Record<number, number>;
  undergraduateRepaymentPlan?: RepaymentPlan;
  postgraduateRepaymentPlan?: RepaymentPlan;

  // Actions
  setStage: (stage: Stage) => void;
  setLoanFormValues: (values: LoanFormValues) => void;
  setTotalUndergradLoan: (amount: number) => void;
  setTotalMaintenanceLoan: (amount: number) => void;
  setTotalMastersLoan: (amount: number) => void;
  setIncomeByYear: (income: Record<number, number>) => void;
  calculatePrincipalAtGraduation: (loanFormValues: LoanFormValues) => void;
  calculateRepaymentWithIncome: (
    incomeByYear: Record<number, number>,
    loanFormValues: LoanFormValues
  ) => void;
  reset: () => void;
}

const initialState = {
  stage: "loanForm" as Stage,
  loanFormValues: undefined,
  totalUndergradLoan: 0,
  totalMaintenanceLoan: 0,
  totalMastersLoan: 0,
  undergraduateLoanAtGraduation: 0,
  postgraduateLoanAtGraduation: 0,
  incomeByYear: {},
  undergraduateRepaymentPlan: undefined,
  postgraduateRepaymentPlan: undefined,
};

export const useLoanCalculatorStore = create<LoanCalculatorState>(
  (set, get) => ({
    ...initialState,

    setStage: (stage) => set({ stage }),

    setLoanFormValues: (values) => set({ loanFormValues: values }),

    setTotalUndergradLoan: (amount) => set({ totalUndergradLoan: amount }),

    setTotalMaintenanceLoan: (amount) => set({ totalMaintenanceLoan: amount }),

    setTotalMastersLoan: (amount) => set({ totalMastersLoan: amount }),

    setIncomeByYear: (income) => set({ incomeByYear: income }),

    calculatePrincipalAtGraduation: (loanFormValues) => {
      const state = get();
      const totalLoan = state.totalUndergradLoan + state.totalMaintenanceLoan;

      console.log("total loan no interest: ", totalLoan);

      const undergradLoanAtGraduation = calculateLoanAtGraduation(
        totalLoan,
        loanFormValues.courseStartYear,
        loanFormValues.courseLength,
        loanFormValues.loanPlan
      );

      const mastersLoanAtGraduation = calculateLoanAtGraduation(
        state.totalMastersLoan,
        loanFormValues.mastersStartYear,
        loanFormValues.mastersLength,
        "postgrad"
      );

      console.log(
        "Undergrad balance at graduation:",
        undergradLoanAtGraduation
      );
      console.log("Masters balance at graduation:", mastersLoanAtGraduation);

      set({
        undergraduateLoanAtGraduation: undergradLoanAtGraduation,
        postgraduateLoanAtGraduation: mastersLoanAtGraduation,
      });
    },

    calculateRepaymentWithIncome: (incomeByYear, loanFormValues) => {
      if (!loanFormValues) return;

      const state = get();
      const repaymentEnd = getForgivenessPlanForYear(
        loanFormValues.courseStartYear,
        loanFormValues.loanPlan
      );

      const graduationYear =
        loanFormValues.courseStartYear + loanFormValues.courseLength;
      const repaymentEndYear = graduationYear + repaymentEnd;

      const undergraduateRepayment = calculateRepaymentPlan(
        state.undergraduateLoanAtGraduation,
        graduationYear,
        repaymentEndYear,
        loanFormValues.loanPlan,
        incomeByYear
      );

      const postgraduateRepayment =
        state.totalMastersLoan > 0
          ? calculateRepaymentPlan(
              state.postgraduateLoanAtGraduation,
              loanFormValues.mastersStartYear + loanFormValues.mastersLength,
              loanFormValues.mastersStartYear +
                loanFormValues.mastersLength +
                30,
              "postgrad",
              incomeByYear
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

    reset: () => set(initialState),
  })
);
