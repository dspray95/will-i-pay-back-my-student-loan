import { describe, expect, it, beforeEach } from "vitest";
import { useLoanCalculatorStore } from "../loanCalculatorStore";
import type { LoanFormValues } from "../../shared/types";
import { STAGES } from "../../shared/constants/stages";

const baseLoanFormValues: LoanFormValues = {
  courseStartYear: 2020,
  courseLength: 3,
  country: "england",
  loanPlan: "plan2",
  tutionFeeLoan: 9250,
  mastersTutionFeeLoan: 0,
  maintenanceLoan: 4000,
  maintenanceGrant: 0,
  postgrad: "no",
  mastersStartYear: 2023,
  mastersLength: 1,
};

describe("loanCalculatorStore", () => {
  beforeEach(() => {
    useLoanCalculatorStore.getState().reset();
  });

  describe("calculateRepaymentWithIncome", () => {
    it("produces repayment plans from income and loan data", () => {
      const store = useLoanCalculatorStore.getState();

      store.setTotalUndergradLoan(27750);
      store.setTotalMaintenanceLoan(12000);
      store.setLoanFormValues(baseLoanFormValues);
      store.calculatePrincipalAtGraduation(baseLoanFormValues);

      const incomeByYear: Record<number, number> = {};
      for (let year = 2024; year <= 2053; year++) {
        incomeByYear[year] = 35000;
      }

      store.calculateRepaymentWithIncome(incomeByYear, baseLoanFormValues);

      const state = useLoanCalculatorStore.getState();
      expect(state.undergraduateRepaymentPlan).toBeDefined();
      expect(state.undergraduateRepaymentPlan!.yearByYearBreakdown.length).toBeGreaterThan(0);
      expect(state.undergraduateRepaymentPlan!.totalRepaid).toBeGreaterThan(0);
    });

    it("recalculates with different results when income changes", () => {
      const store = useLoanCalculatorStore.getState();

      store.setTotalUndergradLoan(27750);
      store.setTotalMaintenanceLoan(12000);
      store.setLoanFormValues(baseLoanFormValues);
      store.calculatePrincipalAtGraduation(baseLoanFormValues);

      // First calculation with low income
      const lowIncome: Record<number, number> = {};
      for (let year = 2024; year <= 2053; year++) {
        lowIncome[year] = 30000;
      }
      store.calculateRepaymentWithIncome(lowIncome, baseLoanFormValues);
      const lowIncomeResult = useLoanCalculatorStore.getState().undergraduateRepaymentPlan!;

      // Second calculation with high income
      const highIncome: Record<number, number> = {};
      for (let year = 2024; year <= 2053; year++) {
        highIncome[year] = 60000;
      }
      store.calculateRepaymentWithIncome(highIncome, baseLoanFormValues);
      const highIncomeResult = useLoanCalculatorStore.getState().undergraduateRepaymentPlan!;

      expect(highIncomeResult.totalRepaid).toBeGreaterThan(lowIncomeResult.totalRepaid);
    });

    it("recalculates when loan form values change", () => {
      const store = useLoanCalculatorStore.getState();

      const incomeByYear: Record<number, number> = {};
      for (let year = 2024; year <= 2053; year++) {
        incomeByYear[year] = 40000;
      }

      // First: short course, smaller loan
      store.setTotalUndergradLoan(27750);
      store.setTotalMaintenanceLoan(12000);
      store.setLoanFormValues(baseLoanFormValues);
      store.calculatePrincipalAtGraduation(baseLoanFormValues);
      store.calculateRepaymentWithIncome(incomeByYear, baseLoanFormValues);
      const shortCourseResult = useLoanCalculatorStore.getState().undergraduateRepaymentPlan!;

      // Second: longer course, larger loan
      const longerCourse: LoanFormValues = {
        ...baseLoanFormValues,
        courseLength: 4,
      };
      store.setTotalUndergradLoan(37000);
      store.setTotalMaintenanceLoan(16000);
      store.setLoanFormValues(longerCourse);
      store.calculatePrincipalAtGraduation(longerCourse);
      store.calculateRepaymentWithIncome(incomeByYear, longerCourse);
      const longCourseResult = useLoanCalculatorStore.getState().undergraduateRepaymentPlan!;

      // Larger loan should mean either more repaid or higher final balance
      const shortTotal = shortCourseResult.totalRepaid + shortCourseResult.finalBalance;
      const longTotal = longCourseResult.totalRepaid + longCourseResult.finalBalance;
      expect(longTotal).toBeGreaterThan(shortTotal);
    });

    it("produces postgraduate repayment plan when masters loan exists", () => {
      const store = useLoanCalculatorStore.getState();

      const formWithMasters: LoanFormValues = {
        ...baseLoanFormValues,
        postgrad: "yes",
        mastersStartYear: 2023,
        mastersLength: 1,
      };

      store.setTotalUndergradLoan(27750);
      store.setTotalMaintenanceLoan(12000);
      store.setTotalMastersLoan(11570);
      store.setLoanFormValues(formWithMasters);
      store.calculatePrincipalAtGraduation(formWithMasters);

      const incomeByYear: Record<number, number> = {};
      for (let year = 2024; year <= 2054; year++) {
        incomeByYear[year] = 40000;
      }

      store.calculateRepaymentWithIncome(incomeByYear, formWithMasters);

      const state = useLoanCalculatorStore.getState();
      expect(state.postgraduateRepaymentPlan).toBeDefined();
      expect(state.postgraduateRepaymentPlan!.totalRepaid).toBeGreaterThan(0);
    });

    it("postgraduate repayment is zero when no masters loan", () => {
      const store = useLoanCalculatorStore.getState();

      store.setTotalUndergradLoan(27750);
      store.setTotalMaintenanceLoan(12000);
      store.setTotalMastersLoan(0);
      store.setLoanFormValues(baseLoanFormValues);
      store.calculatePrincipalAtGraduation(baseLoanFormValues);

      const incomeByYear: Record<number, number> = {};
      for (let year = 2024; year <= 2053; year++) {
        incomeByYear[year] = 40000;
      }

      store.calculateRepaymentWithIncome(incomeByYear, baseLoanFormValues);

      const state = useLoanCalculatorStore.getState();
      expect(state.postgraduateRepaymentPlan).toBeDefined();
      expect(state.postgraduateRepaymentPlan!.totalRepaid).toBe(0);
      expect(state.postgraduateRepaymentPlan!.finalBalance).toBe(0);
    });
  });

  describe("reset", () => {
    it("clears all state back to initial values", () => {
      const store = useLoanCalculatorStore.getState();

      store.setStage(STAGES.repaymentResultsSplash);
      store.setTotalUndergradLoan(27750);
      store.setLoanFormValues(baseLoanFormValues);

      store.reset();

      const state = useLoanCalculatorStore.getState();
      expect(state.stage).toBe(STAGES.loanDetails);
      expect(state.loanFormValues).toBeUndefined();
      expect(state.totalUndergradLoan).toBe(0);
      expect(state.undergraduateRepaymentPlan).toBeUndefined();
    });
  });
});
