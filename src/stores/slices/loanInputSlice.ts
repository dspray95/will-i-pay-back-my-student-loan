import type { StateCreator } from "zustand";
import type { RepaymentPlan } from "../../shared/types";
import type { LoanFormValues } from "../../shared/schemas/LoanFormSchema";
import {
  calculateLoanAtGraduation,
  calculateStudyYearBalances,
} from "../../domain/loan/calculateLoanAtGraduation";
import type { LoanCalculatorState } from "../loanCalculatorStore";

export interface LoanInputSlice {
  loanFormValues?: LoanFormValues;
  totalUndergradLoan: number;
  totalMaintenanceLoan: number;
  totalMastersLoan: number;
  undergraduateLoanAtGraduation: number;
  postgraduateLoanAtGraduation: number;
  undergraduateStudyYearBalances: Array<{ year: number; balance: number }>;
  postgraduateStudyYearBalances: Array<{ year: number; balance: number }>;
  setLoanFormValues: (values: LoanFormValues) => void;
  setTotalUndergradLoan: (amount: number) => void;
  setTotalMaintenanceLoan: (amount: number) => void;
  setTotalMastersLoan: (amount: number) => void;
  calculatePrincipalAtGraduation: (loanFormValues: LoanFormValues) => void;
}

export const loanInputInitialState = {
  loanFormValues: undefined as LoanFormValues | undefined,
  totalUndergradLoan: 0,
  totalMaintenanceLoan: 0,
  totalMastersLoan: 0,
  undergraduateLoanAtGraduation: 0,
  postgraduateLoanAtGraduation: 0,
  undergraduateStudyYearBalances: [] as Array<{ year: number; balance: number }>,
  postgraduateStudyYearBalances: [] as Array<{ year: number; balance: number }>,
};

export const createLoanInputSlice: StateCreator<
  LoanCalculatorState,
  [],
  [],
  LoanInputSlice
> = (set, get) => ({
  ...loanInputInitialState,

  setLoanFormValues: (values) => set({ loanFormValues: values }),
  setTotalUndergradLoan: (amount) => set({ totalUndergradLoan: amount }),
  setTotalMaintenanceLoan: (amount) => set({ totalMaintenanceLoan: amount }),
  setTotalMastersLoan: (amount) => set({ totalMastersLoan: amount }),

  calculatePrincipalAtGraduation: (loanFormValues) => {
    const state = get();
    const totalLoan = state.totalUndergradLoan + state.totalMaintenanceLoan;

    // Split total evenly across course years
    const courseLength = loanFormValues.courseLength;
    const perYear = totalLoan / courseLength;
    const undergradYearlyAmounts = Array.from({ length: courseLength }, () => perYear);

    const undergradLoanAtGraduation = calculateLoanAtGraduation(
      undergradYearlyAmounts,
      loanFormValues.courseStartYear,
      loanFormValues.loanPlan,
    );

    const undergradStudyBalances = calculateStudyYearBalances(
      undergradYearlyAmounts,
      loanFormValues.courseStartYear,
      loanFormValues.loanPlan,
    );

    const hasMasters =
      state.totalMastersLoan > 0 &&
      loanFormValues.mastersStartYear !== undefined &&
      loanFormValues.mastersLength !== undefined;

    const mastersLength = hasMasters ? loanFormValues.mastersLength! : 0;
    const mastersPerYear = hasMasters ? state.totalMastersLoan / mastersLength : 0;
    const mastersYearlyAmounts = Array.from({ length: mastersLength }, () => mastersPerYear);

    const mastersLoanAtGraduation = hasMasters
      ? calculateLoanAtGraduation(
          mastersYearlyAmounts,
          loanFormValues.mastersStartYear!,
          "postgrad",
        )
      : 0;

    const mastersStudyBalances = hasMasters
      ? calculateStudyYearBalances(
          mastersYearlyAmounts,
          loanFormValues.mastersStartYear!,
          "postgrad",
        )
      : [];

    set({
      undergraduateLoanAtGraduation: undergradLoanAtGraduation,
      postgraduateLoanAtGraduation: mastersLoanAtGraduation,
      undergraduateStudyYearBalances: undergradStudyBalances,
      postgraduateStudyYearBalances: mastersStudyBalances,
      ...(hasMasters
        ? {}
        : { postgraduateRepaymentPlan: undefined as RepaymentPlan | undefined }),
    });
  },
});
