import { getDaysInMonth } from "date-fns";
import { getInterestRateAtRepayment } from "../loan/interest";
import { getInterestRateDuringStudy } from "../loan/plans";
import { getRepaymentThreshold } from "../loan/thresholds";
import type { LoanPlan, RepaymentPlan } from "../../shared/types";
import type { RepaymentYear } from "./types";
import type { VoluntaryRepayment } from "../../stores/slices/voluntaryRepaymentsSlice";

const accrueMonthInterest = (
  balance: number,
  dailyRate: number,
  daysInMonth: number,
  voluntaryRepaymentsForMonth: VoluntaryRepayment[],
): { balance: number; interest: number; voluntaryRepaid: number } => {
  let interest = 0;
  let voluntaryRepaid = 0;

  if (voluntaryRepaymentsForMonth.length === 0) {
    interest = balance * (Math.pow(1 + dailyRate, daysInMonth) - 1);
    balance += interest;
  } else {
    let daysSoFar = 0;

    for (const voluntaryRepayment of voluntaryRepaymentsForMonth) {
      const repaymentDay = new Date(voluntaryRepayment.date).getDate();
      const daysInSegment = repaymentDay - daysSoFar;

      const segmentInterest =
        balance * (Math.pow(1 + dailyRate, daysInSegment) - 1);
      balance += segmentInterest;
      interest += segmentInterest;

      const actualRepayment = Math.min(voluntaryRepayment.amount, balance);
      balance -= actualRepayment;
      voluntaryRepaid += actualRepayment;

      daysSoFar = repaymentDay;

      if (balance <= 0) {
        balance = 0;
        break;
      }
    }

    if (balance > 0 && daysSoFar < daysInMonth) {
      const remainingInterest =
        balance * (Math.pow(1 + dailyRate, daysInMonth - daysSoFar) - 1);
      balance += remainingInterest;
      interest += remainingInterest;
    }
  }

  return { balance, interest, voluntaryRepaid };
};

export const calculateRepaymentPlan = (
  loanBalanceAtGraduation: number,
  graduationYear: number,
  repaymentEndYear: number,
  plan: LoanPlan,
  incomeByYear: Record<number, number>,
  longTermRPI?: number,
  voluntaryRepayments: VoluntaryRepayment[] = [],
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

  let gapTotalRepaid = 0;

  if (gapRate > 0) {
    const dailyRate = gapRate / 100 / 365;

    // Gap months: Sep-Dec of graduation year, then Jan-Mar of graduation+1
    const gapMonths = [
      { month: 8, year: graduationYear },
      { month: 9, year: graduationYear },
      { month: 10, year: graduationYear },
      { month: 11, year: graduationYear },
      { month: 0, year: graduationYear + 1 },
      { month: 1, year: graduationYear + 1 },
      { month: 2, year: graduationYear + 1 },
    ];

    for (const { month, year: calendarYear } of gapMonths) {
      const daysInMonth = getDaysInMonth(new Date(calendarYear, month));

      const voluntaryRepaymentsForMonth = voluntaryRepayments
        .filter((voluntaryRepayment) => {
          const repaymentDate = new Date(voluntaryRepayment.date);
          return (
            repaymentDate.getMonth() === month &&
            repaymentDate.getFullYear() === calendarYear
          );
        })
        .sort(
          (a, b) => new Date(a.date).getDate() - new Date(b.date).getDate(),
        );

      const result = accrueMonthInterest(
        balance,
        dailyRate,
        daysInMonth,
        voluntaryRepaymentsForMonth,
      );
      balance = result.balance;
      gapInterest += result.interest;
      gapTotalRepaid += result.voluntaryRepaid;
      totalRepaid += result.voluntaryRepaid;

      if (balance <= 0) {
        balance = 0;
        break;
      }
    }
  }

  breakdown.push({
    year: graduationYear,
    startingBalance: gapStartingBalance,
    interestAccrued: parseFloat(gapInterest.toFixed(2)),
    repayment: parseFloat(gapTotalRepaid.toFixed(2)),
    endingBalance: parseFloat(balance.toFixed(2)),
    income: 0,
  });

  const repaymentStartYear = graduationYear + 1;

  // Yearly loop
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
      longTermRPI,
    );
    const rateSepToMar = getInterestRateAtRepayment(
      year + 1,
      plan,
      previousYearIncome,
      threshold,
      longTermRPI,
      longTermRPI,
    );

    let annualRepayment = 0;
    if (annualIncome > threshold) {
      const repaymentRate = plan === "postgrad" ? 0.06 : 0.09;
      annualRepayment = (annualIncome - threshold) * repaymentRate;
    }

    const monthlyRepayment = annualRepayment / 12;
    let yearInterestAccrued = 0;
    let yearTotalRepaid = 0;

    // Monthly loop
    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const month = (3 + monthOffset) % 12;
      const calendarYear = month < 3 ? year + 1 : year;
      const daysInMonth = getDaysInMonth(new Date(calendarYear, month));

      // Voluntary repayments for the month, sorted by day
      const voluntaryRepaymentsForMonth = voluntaryRepayments
        .filter((voluntaryRepayment) => {
          const repaymentDate = new Date(voluntaryRepayment.date);
          return (
            repaymentDate.getMonth() === month &&
            repaymentDate.getFullYear() === calendarYear
          );
        })
        .sort(
          (a, b) => new Date(a.date).getDate() - new Date(b.date).getDate(),
        );

      // September (monthOffset 5) is when SLC rates change
      const annualInterestRate =
        monthOffset < 5 ? rateAprilToAug : rateSepToMar;
      const dailyRate = annualInterestRate / 100 / 365;

      const result = accrueMonthInterest(
        balance,
        dailyRate,
        daysInMonth,
        voluntaryRepaymentsForMonth,
      );
      balance = result.balance;
      yearInterestAccrued += result.interest;
      yearTotalRepaid += result.voluntaryRepaid;
      totalRepaid += result.voluntaryRepaid;

      if (balance <= 0) {
        balance = 0;
        break;
      }

      const actualMonthlyRepayment = Math.min(monthlyRepayment, balance);
      balance -= actualMonthlyRepayment;

      yearTotalRepaid += actualMonthlyRepayment;
      totalRepaid += actualMonthlyRepayment;

      // Final check to see if the loan is repaid
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
