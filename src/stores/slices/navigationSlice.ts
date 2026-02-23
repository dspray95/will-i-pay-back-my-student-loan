import type { StateCreator } from "zustand";
import type { Stage } from "../../shared/types";
import { STAGES } from "../../shared/constants/stages";
import type { LoanCalculatorState } from "../loanCalculatorStore";

export interface NavigationSlice {
  stage: Stage;
  resetCount: number;
  setStage: (stage: Stage) => void;
  reset: () => void;
}

export const navigationInitialState = {
  stage: STAGES.loanDetails as Stage,
  resetCount: 0,
};

export const createNavigationSlice: StateCreator<
  LoanCalculatorState,
  [],
  [],
  NavigationSlice
> = (set) => ({
  ...navigationInitialState,
  setStage: (stage) => set({ stage }),
  reset: () =>
    set((state) => ({
      ...navigationInitialState,
      ...loanInputInitialState,
      ...incomeInitialState,
      ...resultsInitialState,
      resetCount: state.resetCount + 1,
    })),
});

// Lazy imports to avoid circular deps — resolved at runtime inside reset
import { loanInputInitialState } from "./loanInputSlice";
import { incomeInitialState } from "./incomeSlice";
import { resultsInitialState } from "./resultsSlice";
