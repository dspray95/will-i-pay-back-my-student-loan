import { useEffect, useRef } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../shared/firebase";
import { useLoanCalculatorStore } from "../../../stores/loanCalculatorStore";
import { processResults } from "../processResults";
import {
  ResultsSubmissionSchema,
  type ResultsSubmission,
} from "../../../shared/schemas/ResultsSubmissionSchema";
import type { CalculationResults } from "../types";
import type { RepaymentPlan } from "../../../shared/types";
import type { LoanFormValues } from "../../../shared/schemas/LoanFormSchema";

const defaultEmptyPlan: RepaymentPlan = {
  finalBalance: 0,
  totalRepaid: 0,
  yearByYearBreakdown: [],
};

export const buildResultsPayload = (
  calculationResults: CalculationResults,
  loanFormValues: LoanFormValues,
  salaryGrowthRate: number,
  projectedInflationRate: number,
  futureIncomeMode: string,
  hasPostgradLoan: boolean,
): ResultsSubmission =>
  ResultsSubmissionSchema.parse({
    results: {
      undergraduate: {
        willRepay: calculationResults.willRepayUndergraduateLoan,
        totalPaid: calculationResults.totalUndergraduateDebtPaid,
        amountForgiven: calculationResults.undergraduateAmountForgiven,
        interestAccrued: calculationResults.totalUndergraduateInterestAccrued,
      },
      postgraduate: {
        willRepay: calculationResults.willRepayPostgraduateLoan,
        totalPaid: calculationResults.totalPostgraduateDebtPaid,
        amountForgiven: calculationResults.postgraduateAmountForgiven,
        interestAccrued: calculationResults.totalPostgraduateInterestAccrued,
      },
    },
    config: {
      loanPlan: loanFormValues.loanPlan,
      courseStartYear: loanFormValues.courseStartYear,
      courseLength: loanFormValues.courseLength,
      salaryGrowthRate,
      projectedInflationRate,
      futureIncomeMode,
      hasPostgradLoan,
    },
  });

export const useSubmitResults = () => {
  const submitted = useRef(false);

  const {
    undergraduateRepaymentPlan,
    postgraduateRepaymentPlan,
    undergraduateLoanAtGraduation,
    postgraduateLoanAtGraduation,
    loanFormValues,
    salaryGrowthRate,
    projectedInflationRate,
    futureIncomeMode,
  } = useLoanCalculatorStore();

  const isProduction = true;
  const hasResults = !!undergraduateRepaymentPlan && !!loanFormValues;

  useEffect(() => {
    if (!isProduction || submitted.current || !hasResults) return;
    submitted.current = true;

    const calculationResults = processResults(
      undergraduateRepaymentPlan,
      postgraduateRepaymentPlan ?? defaultEmptyPlan,
      undergraduateLoanAtGraduation,
      postgraduateLoanAtGraduation,
    );

    const hasPostgradLoan =
      postgraduateLoanAtGraduation > 0 &&
      !!postgraduateRepaymentPlan &&
      postgraduateRepaymentPlan.yearByYearBreakdown.length > 0;

    const payload = buildResultsPayload(
      calculationResults,
      loanFormValues,
      salaryGrowthRate,
      projectedInflationRate,
      futureIncomeMode ?? "auto",
      hasPostgradLoan,
    );

    addDoc(collection(db, "results"), {
      ...payload,
      timestamp: serverTimestamp(),
    }).catch((err) => {
      console.error("Failed to submit results:", err);
    });
  }, [
    isProduction,
    hasResults,
    undergraduateRepaymentPlan,
    postgraduateRepaymentPlan,
    undergraduateLoanAtGraduation,
    postgraduateLoanAtGraduation,
    loanFormValues,
    salaryGrowthRate,
    projectedInflationRate,
    futureIncomeMode,
  ]);
};
