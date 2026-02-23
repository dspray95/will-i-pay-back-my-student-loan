import type { StateCreator } from "zustand";
import type { LoanCalculatorState } from "../loanCalculatorStore";

export interface IncomeSlice {
  incomeByYear: Record<number, number>;
  futureIncomeMode?: "auto" | "manual";
  salaryGrowthRate: number;
  projectedInflationRate: number;
  setIncomeByYear: (income: Record<number, number>) => void;
  setFutureIncomeMode: (mode: "auto" | "manual") => void;
  setSalaryGrowthRate: (rate: number) => void;
  setProjectedInflationRate: (rate: number) => void;
}

export const incomeInitialState = {
  incomeByYear: {} as Record<number, number>,
  futureIncomeMode: undefined as "auto" | "manual" | undefined,
  salaryGrowthRate: 3.0,
  projectedInflationRate: 2.5,
};

export const createIncomeSlice: StateCreator<
  LoanCalculatorState,
  [],
  [],
  IncomeSlice
> = (set) => ({
  ...incomeInitialState,
  setIncomeByYear: (income) => set({ incomeByYear: income }),
  setFutureIncomeMode: (mode) => set({ futureIncomeMode: mode }),
  setSalaryGrowthRate: (rate) => set({ salaryGrowthRate: rate }),
  setProjectedInflationRate: (rate) => set({ projectedInflationRate: rate }),
});
