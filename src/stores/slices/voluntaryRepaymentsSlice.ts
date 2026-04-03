import { format } from "date-fns";
import type { StateCreator } from "zustand";
import type { LoanCalculatorState } from "../loanCalculatorStore";

export interface VoluntaryRepayment {
  date: string; // ISO date string (YYYY-MM-DD)
  amount: number;
}

export interface VoluntaryRepaymentsSlice {
  voluntaryRepayments: VoluntaryRepayment[];
  addVoluntaryRepayment: () => void;
  updateVoluntaryRepayment: (
    index: number,
    updates: Partial<VoluntaryRepayment>,
  ) => void;
  removeVoluntaryRepayment: (index: number) => void;
  clearAllVoluntaryRepayments: () => void;
}

export const voluntaryRepaymentsInitialState = {
  voluntaryRepayments: [] as VoluntaryRepayment[],
};

export const createVoluntaryRepaymentsSlice: StateCreator<
  LoanCalculatorState,
  [],
  [],
  VoluntaryRepaymentsSlice
> = (set) => ({
  ...voluntaryRepaymentsInitialState,
  addVoluntaryRepayment: () =>
    set((state) => ({
      voluntaryRepayments: [
        ...state.voluntaryRepayments,
        {
          date: format(new Date(), "yyyy-MM-dd"),
          amount: 0,
        },
      ],
    })),
  updateVoluntaryRepayment: (index, updates) =>
    set((state) => ({
      voluntaryRepayments: state.voluntaryRepayments.map((r, i) =>
        i === index ? { ...r, ...updates } : r,
      ),
    })),
  removeVoluntaryRepayment: (index) =>
    set((state) => ({
      voluntaryRepayments: state.voluntaryRepayments.filter((_, i) => i !== index),
    })),
  clearAllVoluntaryRepayments: () => {
    set({ voluntaryRepayments: [] });
  },
});
