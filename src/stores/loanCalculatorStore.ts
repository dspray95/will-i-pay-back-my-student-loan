import { create } from "zustand";
import {
  createNavigationSlice,
  type NavigationSlice,
} from "./slices/navigationSlice";
import {
  createLoanInputSlice,
  type LoanInputSlice,
} from "./slices/loanInputSlice";
import { createIncomeSlice, type IncomeSlice } from "./slices/incomeSlice";
import { createResultsSlice, type ResultsSlice } from "./slices/resultsSlice";

export type LoanCalculatorState = NavigationSlice &
  LoanInputSlice &
  IncomeSlice &
  ResultsSlice;

export const useLoanCalculatorStore = create<LoanCalculatorState>()((...a) => ({
  ...createNavigationSlice(...a),
  ...createLoanInputSlice(...a),
  ...createIncomeSlice(...a),
  ...createResultsSlice(...a),
}));
