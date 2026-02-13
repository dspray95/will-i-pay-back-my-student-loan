import { create } from "zustand";
import type { LoanFormValues, RepaymentPlan, Stage } from "../shared/types";
import { getForgivenessPlanForYear } from "../domain/loan/forgiveness";
import {
  calculateLoanAtGraduation,
  calculateStudyYearBalances,
} from "../domain/loan/calculateLoanAtGraduation";
import { calculateRepaymentPlan } from "../domain/repayment/calculateRepaymentPlan";
import { STAGES } from "../shared/constants/stages";

interface LoanCalculatorState {
  // State
  stage: Stage;
  resetCount: number;
  loanFormValues?: LoanFormValues;
  totalUndergradLoan: number;
  totalMaintenanceLoan: number;
  totalMastersLoan: number;
  undergraduateLoanAtGraduation: number;
  postgraduateLoanAtGraduation: number;
  undergraduateStudyYearBalances: Array<{ year: number; balance: number }>;
  postgraduateStudyYearBalances: Array<{ year: number; balance: number }>;
  incomeByYear: Record<number, number>;
  futureIncomeMode?: "auto" | "manual";
  undergraduateRepaymentPlan?: RepaymentPlan;
  postgraduateRepaymentPlan?: RepaymentPlan;
  salaryGrowthRate: number;
  projectedInflationRate: number;

  // Actions
  setStage: (stage: Stage) => void;
  setFutureIncomeMode: (mode: "auto" | "manual") => void;
  setLoanFormValues: (values: LoanFormValues) => void;
  setTotalUndergradLoan: (amount: number) => void;
  setTotalMaintenanceLoan: (amount: number) => void;
  setTotalMastersLoan: (amount: number) => void;
  setIncomeByYear: (income: Record<number, number>) => void;
  setSalaryGrowthRate: (rate: number) => void;
  setProjectedInflationRate: (rate: number) => void;
  calculatePrincipalAtGraduation: (loanFormValues: LoanFormValues) => void;
  calculateRepaymentWithIncome: (
    incomeByYear: Record<number, number>,
    loanFormValues: LoanFormValues,
  ) => void;
  reset: () => void;
}

const initialState = {
  stage: STAGES.loanDetails,
  resetCount: 0,
  loanFormValues: undefined,
  totalUndergradLoan: 0,
  totalMaintenanceLoan: 0,
  totalMastersLoan: 0,
  undergraduateLoanAtGraduation: 0,
  postgraduateLoanAtGraduation: 0,
  undergraduateStudyYearBalances: [],
  postgraduateStudyYearBalances: [],
  incomeByYear: {},
  futureIncomeMode: undefined,
  undergraduateRepaymentPlan: undefined,
  postgraduateRepaymentPlan: undefined,
  salaryGrowthRate: 3.0,
  projectedInflationRate: 2.5,
};

export const useLoanCalculatorStore = create<LoanCalculatorState>(
  (set, get) => ({
    ...initialState,

    setStage: (stage) => set({ stage }),

    setLoanFormValues: (values) => set({ loanFormValues: values }),

    setTotalUndergradLoan: (amount) => set({ totalUndergradLoan: amount }),

    setTotalMaintenanceLoan: (amount) => set({ totalMaintenanceLoan: amount }),

    setTotalMastersLoan: (amount) => set({ totalMastersLoan: amount }),

    setIncomeByYear: (income) => {
      set({ incomeByYear: income });
    },

    setFutureIncomeMode: (mode) => set({ futureIncomeMode: mode }),

    setSalaryGrowthRate: (rate) => set({ salaryGrowthRate: rate }),

    setProjectedInflationRate: (rate) => set({ projectedInflationRate: rate }),

    calculatePrincipalAtGraduation: (loanFormValues) => {
      const state = get();
      const totalLoan = state.totalUndergradLoan + state.totalMaintenanceLoan;

      const undergradLoanAtGraduation = calculateLoanAtGraduation(
        totalLoan,
        loanFormValues.courseStartYear,
        loanFormValues.courseLength,
        loanFormValues.loanPlan,
      );

      const undergradStudyBalances = calculateStudyYearBalances(
        totalLoan,
        loanFormValues.courseStartYear,
        loanFormValues.courseLength,
        loanFormValues.loanPlan,
      );

      const hasMasters =
        state.totalMastersLoan > 0 &&
        loanFormValues.mastersStartYear !== undefined &&
        loanFormValues.mastersLength !== undefined;

      const mastersLoanAtGraduation = hasMasters
        ? calculateLoanAtGraduation(
            state.totalMastersLoan,
            loanFormValues.mastersStartYear!,
            loanFormValues.mastersLength!,
            "postgrad",
          )
        : 0;

      const mastersStudyBalances = hasMasters
        ? calculateStudyYearBalances(
            state.totalMastersLoan,
            loanFormValues.mastersStartYear!,
            loanFormValues.mastersLength!,
            "postgrad",
          )
        : [];

      set({
        undergraduateLoanAtGraduation: undergradLoanAtGraduation,
        postgraduateLoanAtGraduation: mastersLoanAtGraduation,
        undergraduateStudyYearBalances: undergradStudyBalances,
        postgraduateStudyYearBalances: mastersStudyBalances,
        ...(hasMasters ? {} : { postgraduateRepaymentPlan: undefined }),
      });
    },

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

      const postgraduateRepayment =
        state.totalMastersLoan > 0
          ? calculateRepaymentPlan(
              state.postgraduateLoanAtGraduation,
              loanFormValues.mastersStartYear + loanFormValues.mastersLength,
              loanFormValues.mastersStartYear +
                loanFormValues.mastersLength +
                30,
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

    reset: () =>
      set((state) => ({ ...initialState, resetCount: state.resetCount + 1 })),
  }),
);
