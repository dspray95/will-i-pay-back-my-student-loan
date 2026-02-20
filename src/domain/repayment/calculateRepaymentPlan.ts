import { getDaysInMonth } from "date-fns";
import { getInterestRateAtRepayment } from "../loan/interest";
import { getInterestRateDuringStudy } from "../loan/plans";
import { getRepaymentThreshold } from "../loan/thresholds";
import type { LoanPlan, RepaymentPlan } from "../../shared/types";
import type { RepaymentYear } from "./types";

export const calculateRepaymentPlan = (
  loanBalanceAtGraduation: number,
  graduationYear: number,
  repaymentEndYear: number,
  plan: LoanPlan,
  incomeByYear: Record<number, number>,
  longTermRPI?: number
): RepaymentPlan => {
  let balance = loanBalanceAtGraduation;
  let totalRepaid = 0;
  const breakdown: RepaymentYear[] = [];

  // Apply interest for the gap period between end of study (~August)
  // and start of repayments (April of the following year).
  // SLC continues charging the study interest rate until the April after leaving.
  const gapStartingBalance = balance;
  const gapRate = getInterestRateDuringStudy(graduationYear - 1, plan);
  let gapInterest = 0;

  if (gapRate > 0) {
    const dailyRate = gapRate / 100 / 365;

    // September to December of graduation year
    for (let month = 8; month <= 11; month++) {
      const daysInMonth = getDaysInMonth(new Date(graduationYear, month));
      const monthInterest = balance * (Math.pow(1 + dailyRate, daysInMonth) - 1);
      balance += monthInterest;
      gapInterest += monthInterest;
    }

    // January to March of graduation year + 1
    for (let month = 0; month <= 2; month++) {
      const daysInMonth = getDaysInMonth(new Date(graduationYear + 1, month));
      const monthInterest = balance * (Math.pow(1 + dailyRate, daysInMonth) - 1);
      balance += monthInterest;
      gapInterest += monthInterest;
    }
  }

  breakdown.push({
    year: graduationYear,
    startingBalance: gapStartingBalance,
    interestAccrued: parseFloat(gapInterest.toFixed(2)),
    repayment: 0,
    endingBalance: parseFloat(balance.toFixed(2)),
    income: 0,
  });

  const repaymentStartYear = graduationYear + 1;

  for (let year = repaymentStartYear; year <= repaymentEndYear; year++) {
    const annualIncome = incomeByYear[year] || 0;
    const previousYearIncome = incomeByYear[year - 1] || 0;
    const startingBalance = balance;

    const threshold = getRepaymentThreshold(year, plan, longTermRPI);

    // Interest rates change each September, mid-tax-year.
    // April–August uses current year's rate; September–March uses the next.
    const rateAprilToAug = getInterestRateAtRepayment(
      year,
      plan,
      previousYearIncome,
      undefined,
      longTermRPI,
      longTermRPI
    );
    const rateSepToMar = getInterestRateAtRepayment(
      year + 1,
      plan,
      previousYearIncome,
      threshold,
      longTermRPI,
      longTermRPI
    );

    let annualRepayment = 0;
    if (annualIncome > threshold) {
      const repaymentRate = plan === "postgrad" ? 0.06 : 0.09;
      annualRepayment = (annualIncome - threshold) * repaymentRate;
    }

    const monthlyRepayment = annualRepayment / 12;
    let yearInterestAccrued = 0;
    let yearTotalRepaid = 0;

    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const month = (3 + monthOffset) % 12;
      const calendarYear = month < 3 ? year + 1 : year;
      const daysInMonth = getDaysInMonth(new Date(calendarYear, month));

      // September (monthOffset 5) is when SLC rates change
      const annualInterestRate =
        monthOffset < 5 ? rateAprilToAug : rateSepToMar;
      const dailyRate = annualInterestRate / 100 / 365;

      const monthInterest =
        balance * (Math.pow(1 + dailyRate, daysInMonth) - 1);
      balance += monthInterest;
      yearInterestAccrued += monthInterest;

      const actualMonthlyRepayment = Math.min(monthlyRepayment, balance);
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

    if (balance <= 0) break;
  }

  return {
    finalBalance: parseFloat(balance.toFixed(2)),
    totalRepaid: parseFloat(totalRepaid.toFixed(2)),
    yearByYearBreakdown: breakdown,
  };
};
