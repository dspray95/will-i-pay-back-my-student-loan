import type { StateCreator } from "zustand";
import type { RepaymentPlan } from "../../shared/types";
import type { LoanFormValues } from "../../shared/schemas/LoanFormSchema";
import { calculateLoanAtGraduation } from "../../domain/loan/calculateLoanAtGraduation";
import { getForgivenessPlanForYear } from "../../domain/loan/forgiveness";
import { calculateRepaymentPlan } from "../../domain/repayment/calculateRepaymentPlan";
import type { LoanCalculatorState } from "../loanCalculatorStore";
import type { VoluntaryRepayment } from "./voluntaryRepaymentsSlice";

const EMPTY_PLAN: RepaymentPlan = {
  finalBalance: 0,
  totalRepaid: 0,
  yearByYearBreakdown: [],
};

export interface ResultsSlice {
  undergraduateRepaymentPlan?: RepaymentPlan;
  postgraduateRepaymentPlan?: RepaymentPlan;
  undergraduateRepaymentPlanWithVoluntaryRepayments?: RepaymentPlan;
  postgraduateRepaymentPlanWithVoluntaryRepayments?: RepaymentPlan;
  calculateRepaymentWithIncome: (
    incomeByYear: Record<number, number>,
    loanFormValues: LoanFormValues,
    voluntaryRepayments?: VoluntaryRepayment[],
  ) => void;
}

export const resultsInitialState = {
  undergraduateRepaymentPlan: undefined as RepaymentPlan | undefined,
  postgraduateRepaymentPlan: undefined as RepaymentPlan | undefined,
  undergraduateRepaymentPlanWithVoluntaryRepayments: undefined as
    | RepaymentPlan
    | undefined,
  postgraduateRepaymentPlanWithVoluntaryRepayments: undefined as
    | RepaymentPlan
    | undefined,
};

export const createResultsSlice: StateCreator<
  LoanCalculatorState,
  [],
  [],
  ResultsSlice
> = (set, get) => ({
  ...resultsInitialState,

  calculateRepaymentWithIncome: (
    incomeByYear,
    loanFormValues,
    voluntaryRepayments = [],
  ) => {
    if (!loanFormValues) return;

    const state = get();

    const undergradVoluntaryRepayments = voluntaryRepayments.filter(
      (voluntaryRepayment) =>
        voluntaryRepayment.type === "undergraduate" ||
        voluntaryRepayment.type === undefined,
    );

    const postgradVoluntaryRepayments = voluntaryRepayments.filter(
      (voluntaryRepayment) => voluntaryRepayment.type === "postgraduate",
    );

    const repaymentEnd = getForgivenessPlanForYear(
      loanFormValues.courseStartYear,
      loanFormValues.loanPlan,
    );

    const graduationYear =
      loanFormValues.courseStartYear + loanFormValues.courseLength;
    const repaymentEndYear = graduationYear + repaymentEnd;

    const undergraduateRepaymentPlan = calculateRepaymentPlan(
      state.undergraduateLoanAtGraduation,
      graduationYear,
      repaymentEndYear,
      loanFormValues.loanPlan,
      incomeByYear,
      state.projectedInflationRate,
    );

    // Recalculate graduation balance accounting for study-period voluntary repayments
    const totalUndergradLoan =
      state.totalUndergradLoan + state.totalMaintenanceLoan;
    const undergradPerYear = totalUndergradLoan / loanFormValues.courseLength;
    const undergradYearlyAmounts = Array.from(
      { length: loanFormValues.courseLength },
      () => undergradPerYear,
    );
    const undergradLoanWithRepayments = calculateLoanAtGraduation(
      undergradYearlyAmounts,
      loanFormValues.courseStartYear,
      loanFormValues.loanPlan,
      undergradVoluntaryRepayments,
    );

    const undergraduateRepaymentPlanWithVoluntaryRepayments =
      calculateRepaymentPlan(
        undergradLoanWithRepayments,
        graduationYear,
        repaymentEndYear,
        loanFormValues.loanPlan,
        incomeByYear,
        state.projectedInflationRate,
        undergradVoluntaryRepayments,
      );

    const mastersStartYear =
      typeof loanFormValues.mastersStartYear === "number"
        ? loanFormValues.mastersStartYear
        : 0;
    const mastersLength =
      typeof loanFormValues.mastersLength === "number"
        ? loanFormValues.mastersLength
        : 0;

    const postgradGraduationYear = mastersStartYear + mastersLength;
    const postgradWriteoffYear = postgradGraduationYear + 30;

    const postgraduateRepaymentPlan =
      state.totalMastersLoan > 0
        ? calculateRepaymentPlan(
            state.postgraduateLoanAtGraduation,
            postgradGraduationYear,
            postgradWriteoffYear,
            "postgrad",
            incomeByYear,
            state.projectedInflationRate,
          )
        : EMPTY_PLAN;

    let postgraduateRepaymentPlanWithVoluntaryRepayments = EMPTY_PLAN;
    if (state.totalMastersLoan > 0) {
      const postgradPerYear = state.totalMastersLoan / mastersLength;
      const postgradYearlyAmounts = Array.from(
        { length: mastersLength },
        () => postgradPerYear,
      );
      const postgradLoanWithRepayments = calculateLoanAtGraduation(
        postgradYearlyAmounts,
        mastersStartYear,
        "postgrad",
        postgradVoluntaryRepayments,
      );

      postgraduateRepaymentPlanWithVoluntaryRepayments = calculateRepaymentPlan(
        postgradLoanWithRepayments,
        postgradGraduationYear,
        postgradWriteoffYear,
        "postgrad",
        incomeByYear,
        state.projectedInflationRate,
        postgradVoluntaryRepayments,
      );
    }

    set({
      undergraduateRepaymentPlan,
      postgraduateRepaymentPlan,
      undergraduateRepaymentPlanWithVoluntaryRepayments,
      postgraduateRepaymentPlanWithVoluntaryRepayments,
    });
  },
});
