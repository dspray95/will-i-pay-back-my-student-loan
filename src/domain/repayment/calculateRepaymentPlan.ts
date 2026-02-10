import { getDaysInMonth } from "date-fns";
import { getInterestRateAtRepayment } from "../loan/interest";
import { getRepaymentThreshold } from "../loan/thresholds";
import type { LoanPlan, RepaymentPlan } from "../../shared/types";
import type { RepaymentYear } from "./types";

export const calculateRepaymentPlan = (
  loanBalanceAtGraduation: number,
  graduationYear: number,
  repaymentEndYear: number,
  plan: LoanPlan,
  incomeByYear: Record<number, number>
): RepaymentPlan => {
  let balance = loanBalanceAtGraduation;
  let totalRepaid = 0;
  const breakdown: RepaymentYear[] = [];

  const repaymentStartYear = graduationYear + 1;

  for (let year = repaymentStartYear; year <= repaymentEndYear; year++) {
    const annualIncome = incomeByYear[year] || 0;
    const previousYearIncome = incomeByYear[year - 1] || 0;
    const startingBalance = balance;

    const threshold = getRepaymentThreshold(year, plan);

    // Interest rates change each September, mid-tax-year.
    // April–August uses current year's rate; September–March uses the next.
    const rateAprilToAug = getInterestRateAtRepayment(
      year,
      plan,
      previousYearIncome
    );
    const rateSepToMar = getInterestRateAtRepayment(
      year + 1,
      plan,
      previousYearIncome,
      threshold
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
