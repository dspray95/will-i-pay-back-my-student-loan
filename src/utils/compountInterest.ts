import { getInterestRateDuringStudy, type LoanPlan } from "../data/plans";
import {
  getInterestRateAtRepayment,
  getRepaymentThreshold,
} from "../data/repaymentThresholds";
import type { RepaymentPlan } from "../types";

export const calculateLoanAtGraduation = (
  principal: number,
  startYear: number,
  courseLength: number,
  plan: LoanPlan,
  isPostgrad?: boolean
): number => {
  // If interest-free, return principal
  if (plan === "plan4" || plan === "plan5") {
    return principal;
  }

  let balance = principal;

  // Compound year-by-year to account for rate changes each September
  for (let year = 0; year < courseLength; year++) {
    const academicYear = startYear + year;
    const annualRate = getInterestRateDuringStudy(
      academicYear,
      plan,
      isPostgrad
    );

    if (annualRate === 0) {
      // Interest-free year, skip compounding
      continue;
    }

    const dailyRate = annualRate / 100 / 365;
    const daysInYear = 365;
    const yearEndBalance = balance * Math.pow(1 + dailyRate, daysInYear);
    balance = yearEndBalance;
  }

  return parseFloat(balance.toFixed(2));
};

export const calculateLoanAtRepayment = (
  loanBalanceAtGraduation: number,
  graduationYear: number,
  repaymentEndYear: number,
  plan: LoanPlan,
  incomeByYear: Record<number, number>
): RepaymentPlan => {
  let balance = loanBalanceAtGraduation;
  let totalRepaid = 0;
  const breakdown: Array<{
    year: number;
    startingBalance: number;
    interestAccrued: number;
    repayment: number;
    endingBalance: number;
    income: number;
  }> = [];

  // Repayment starts April after graduation
  const repaymentStartYear = graduationYear + 1;

  for (let year = repaymentStartYear; year <= repaymentEndYear; year++) {
    const annualIncome = incomeByYear[year] || 0;
    const startingBalance = balance;

    // Get interest rate for this year based on income
    const annualInterestRate = getInterestRateAtRepayment(
      year,
      plan,
      annualIncome
    );

    // Calculate daily accrued interest
    const dailyRate = annualInterestRate / 100 / 365;
    const interestAccrued = balance * (Math.pow(1 + dailyRate, 365) - 1);
    balance += interestAccrued;

    // Get repayment threshold for this year
    const threshold = getRepaymentThreshold(year, plan);

    // Calculate repayment
    let repayment = 0;
    if (annualIncome > threshold) {
      const repaymentRate = 0.09; // Statutory repayment rate for all UK student loans
      repayment = (annualIncome - threshold) * repaymentRate;

      // Can't repay more than balance
      if (repayment > balance) {
        repayment = balance;
      }
    }

    balance -= repayment;
    totalRepaid += repayment;

    // Cap balance at 0
    if (balance < 0) {
      repayment += balance; // Adjust for overpayment
      balance = 0;
    }

    breakdown.push({
      year,
      startingBalance,
      interestAccrued: parseFloat(interestAccrued.toFixed(2)),
      repayment: parseFloat(repayment.toFixed(2)),
      endingBalance: parseFloat(balance.toFixed(2)),
      income: annualIncome,
    });

    // Stop if loan is repaid
    if (balance <= 0) {
      break;
    }
  }

  return {
    finalBalance: parseFloat(balance.toFixed(2)),
    totalRepaid: parseFloat(totalRepaid.toFixed(2)),
    yearByYearBreakdown: breakdown,
  };
};
