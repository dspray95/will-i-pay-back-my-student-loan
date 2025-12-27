import type { RepaymentPlan } from "../../shared/types";
import type { CalculationResults } from "./types";

export const processResults = (
  undergraduateRepaymentPlan: RepaymentPlan | undefined,
  postgraduateRepaymentPlan: RepaymentPlan | undefined,
  undergraduateLoanAtGraduation: number | undefined,
  postgraduateLoanAtGraduation: number | undefined
): CalculationResults | undefined => {
  if (
    undergraduateRepaymentPlan === undefined ||
    postgraduateRepaymentPlan === undefined ||
    undergraduateLoanAtGraduation === undefined ||
    postgraduateLoanAtGraduation === undefined
  ) {
    console.log("undergraduateRepaymentPlan", undergraduateRepaymentPlan);
    console.log("postgraduateRepaymentPlan", postgraduateRepaymentPlan);
    console.log("undergraduateLoanAtGraduation", undergraduateLoanAtGraduation);
    console.log("postgraduateLoanAtGraduation", postgraduateLoanAtGraduation);
    return undefined;
  }

  // Will they repay their loan?
  const willRepayUndergraduateLoan =
    undergraduateRepaymentPlan.finalBalance <= 0;
  const willRepayPostgraduateLoan = postgraduateRepaymentPlan.finalBalance <= 0;

  // Accrued interest
  let totalUndergraduateInterestAccrued = 0;
  undergraduateRepaymentPlan.yearByYearBreakdown.forEach((year) => {
    totalUndergraduateInterestAccrued += year.interestAccrued;
  });
  let totalPostgraduateInterestAccrued = 0;
  postgraduateRepaymentPlan.yearByYearBreakdown.forEach((year) => {
    totalPostgraduateInterestAccrued += year.interestAccrued;
  });

  // Repayments
  const undergraduateRepayments =
    undergraduateRepaymentPlan.yearByYearBreakdown.map(
      (year) => year.repayment
    );
  const postgraduateRepayments =
    postgraduateRepaymentPlan.yearByYearBreakdown.map((year) => year.repayment);

  // Forgiveness
  const undergraduateAmountForgiven = undergraduateRepaymentPlan.finalBalance;
  const postgraduateAmountForgiven = postgraduateRepaymentPlan.finalBalance;

  // Totals
  let totalUndergraduateLoanAmount = 0;
  let totalUndergraduateDebtPaid = 0;
  if (undergraduateLoanAtGraduation !== 0) {
    totalUndergraduateLoanAmount =
      undergraduateLoanAtGraduation +
      undergraduateRepaymentPlan.yearByYearBreakdown
        .map((year) => year.interestAccrued)
        .reduce((accumulator, currentValue) => accumulator + currentValue);

    totalUndergraduateDebtPaid =
      undergraduateRepaymentPlan.yearByYearBreakdown.reduce(
        (accumulator, year) => {
          return accumulator + year.repayment;
        },
        0
      );
  }

  let totalPostgraduateLoanAmount = 0;
  let totalPostgraduateDebtPaid = 0;

  if (totalPostgraduateLoanAmount !== 0) {
    totalPostgraduateLoanAmount =
      postgraduateLoanAtGraduation +
      postgraduateRepaymentPlan.yearByYearBreakdown
        .map((year) => year.interestAccrued)
        .reduce((accumulator, currentValue) => accumulator + currentValue);

    totalPostgraduateDebtPaid =
      postgraduateRepaymentPlan.yearByYearBreakdown.reduce(
        (accumulator, year) => {
          return accumulator + year.repayment;
        },
        0
      );
  }

  const results: CalculationResults = {
    willRepayUndergraduateLoan,
    willRepayPostgraduateLoan,
    totalUndergraduateInterestAccrued,
    totalPostgraduateInterestAccrued,
    totalUndergraduateLoanAmount,
    totalPostgraduateLoanAmount,
    undergraduateAmountForgiven,
    postgraduateAmountForgiven,
    undergraduateRepayments,
    postgraduateRepayments,
    totalUndergraduateDebtPaid,
    totalPostgraduateDebtPaid,
  };
  console.log(results);
  return results;
};
