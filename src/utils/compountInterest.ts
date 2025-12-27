import { getInterestRateDuringStudy, type LoanPlan } from "../data/plans";
import {
  getInterestRateAtRepayment,
  getRepaymentThreshold,
} from "../data/repaymentThresholds";
import type { RepaymentPlan } from "../shared/types";
import { getDaysInMonth } from "date-fns";

/**
 * Calculate loan balance at graduation, accounting for termly disbursements.
 * UK loans are paid in 3 installments: Sept, Jan, Apr.
 */
export const calculateLoanAtGraduation = (
  principal: number,
  startYear: number,
  courseLength: number,
  plan: LoanPlan
): number => {
  // If interest-free, return principal
  if (plan === "plan4" || plan === "plan5") {
    return principal;
  }

  // Split annual loan into 3 equal termly installments
  const annualLoanAmount = principal / courseLength;
  const termlyInstallment = annualLoanAmount / 3;

  let balance = 0;

  // Process each academic year
  for (let year = 0; year < courseLength; year++) {
    const academicYear = startYear + year;
    const annualRate = getInterestRateDuringStudy(academicYear, plan);

    if (annualRate === 0) {
      // Interest-free year, just add the annual loan amount
      balance += annualLoanAmount;
      continue;
    }

    const dailyRate = annualRate / 100 / 365;

    // September disbursement (day 0) - compounds for ~365 days
    balance += termlyInstallment;
    balance *= Math.pow(1 + dailyRate, 122); // ~Sept to Jan (122 days)

    // January disbursement - compounds for ~243 days
    balance += termlyInstallment;
    balance *= Math.pow(1 + dailyRate, 121); // ~Jan to Apr (121 days)

    // April disbursement - compounds for ~122 days
    balance += termlyInstallment;
    balance *= Math.pow(1 + dailyRate, 122); // ~Apr to Sept (122 days)
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

  const repaymentStartYear = graduationYear + 1;

  for (let year = repaymentStartYear; year <= repaymentEndYear; year++) {
    const annualIncome = incomeByYear[year] || 0;

    // For Plan 2, the interest rate sliding scale is determined by the
    // PREVIOUS tax year's income, not the current one.
    // If no previous year data exists (e.g., first year), it defaults to 0 (RPI only).
    const previousYearIncome = incomeByYear[year - 1] || 0;

    const startingBalance = balance;

    // Use previousYearIncome to determine the interest rate tier
    const annualInterestRate = getInterestRateAtRepayment(
      year,
      plan,
      previousYearIncome
    );

    const threshold = getRepaymentThreshold(year, plan);

    // Repayments are still based on CURRENT year income
    let annualRepayment = 0;
    if (annualIncome > threshold) {
      const repaymentRate = plan === "postgrad" ? 0.06 : 0.09;
      annualRepayment = (annualIncome - threshold) * repaymentRate;
    }

    const monthlyRepayment = annualRepayment / 12;
    const dailyRate = annualInterestRate / 100 / 365;

    let yearInterestAccrued = 0;
    let yearTotalRepaid = 0;

    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const month = (3 + monthOffset) % 12;
      const calendarYear = month < 3 ? year + 1 : year;
      const daysInMonth = getDaysInMonth(new Date(calendarYear, month));

      const monthInterest =
        balance * (Math.pow(1 + dailyRate, daysInMonth) - 1);
      balance += monthInterest;
      yearInterestAccrued += monthInterest;

      let actualMonthlyRepayment = monthlyRepayment;

      if (actualMonthlyRepayment > balance) {
        actualMonthlyRepayment = balance;
      }

      balance -= actualMonthlyRepayment;
      yearTotalRepaid += actualMonthlyRepayment;
      totalRepaid += actualMonthlyRepayment;

      if (balance <= 0) {
        balance = 0;
        break;
      }
    }

    breakdown.push({
      year,
      startingBalance,
      interestAccrued: parseFloat(yearInterestAccrued.toFixed(2)),
      repayment: parseFloat(yearTotalRepaid.toFixed(2)),
      endingBalance: parseFloat(balance.toFixed(2)),
      income: annualIncome,
    });

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
