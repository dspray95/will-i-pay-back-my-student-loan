import type { LoanPlan } from "../../shared/types";
import type { VoluntaryRepayment } from "../../stores/slices/voluntaryRepaymentsSlice";
import { getInterestRateDuringStudy } from "./plans";

const TERM_DAYS = [122, 121, 122] as const;

/**
 * Map voluntary repayments to day offsets within an academic year (Sep 1 – Aug 31).
 * Sorted by day offset ascending.
 */
const getRepaymentsForAcademicYear = (
  voluntaryRepayments: VoluntaryRepayment[],
  academicYear: number,
): { dayOffset: number; amount: number }[] => {
  const sepFirst = new Date(academicYear, 8, 1);
  const nextSepFirst = new Date(academicYear + 1, 8, 1);

  return voluntaryRepayments
    .map((vr) => {
      const date = new Date(vr.date);
      if (date < sepFirst || date >= nextSepFirst) return null;
      const dayOffset = Math.floor(
        (date.getTime() - sepFirst.getTime()) / (1000 * 60 * 60 * 24),
      );
      return { dayOffset, amount: vr.amount };
    })
    .filter(
      (vr): vr is { dayOffset: number; amount: number } => vr !== null,
    )
    .sort((a, b) => a.dayOffset - b.dayOffset);
};

/**
 * Apply compound interest over a term segment, splitting at voluntary repayment
 * days to deduct them from the balance mid-term.
 */
const processTermWithRepayments = (
  startBalance: number,
  termDays: number,
  dailyRate: number,
  repayments: { dayOffset: number; amount: number }[],
): number => {
  let balance = startBalance;
  let daysSoFar = 0;

  for (const repayment of repayments) {
    const daysInSegment = repayment.dayOffset - daysSoFar;
    if (daysInSegment > 0) {
      balance *= Math.pow(1 + dailyRate, daysInSegment);
    }

    const actualRepayment = Math.min(repayment.amount, balance);
    balance -= actualRepayment;
    daysSoFar = repayment.dayOffset;

    if (balance <= 0) return 0;
  }

  const remainingDays = termDays - daysSoFar;
  if (remainingDays > 0) {
    balance *= Math.pow(1 + dailyRate, remainingDays);
  }

  return balance;
};

/**
 * Process one academic year: disburse 3 termly installments with compound interest,
 * applying any voluntary repayments mid-term.
 */
const processAcademicYear = (
  startBalance: number,
  termlyInstallment: number,
  dailyRate: number,
  repayments: { dayOffset: number; amount: number }[],
): number => {
  let balance = startBalance;
  let termStart = 0;

  for (const termDays of TERM_DAYS) {
    balance += termlyInstallment;

    const termRepayments = repayments
      .filter(
        (vr) =>
          vr.dayOffset >= termStart && vr.dayOffset < termStart + termDays,
      )
      .map((vr) => ({ dayOffset: vr.dayOffset - termStart, amount: vr.amount }));

    if (termRepayments.length > 0) {
      balance = processTermWithRepayments(
        balance,
        termDays,
        dailyRate,
        termRepayments,
      );
    } else if (balance > 0) {
      balance *= Math.pow(1 + dailyRate, termDays);
    }

    termStart += termDays;
  }

  return balance;
};

/**
 * Calculate loan balance at graduation, accounting for termly disbursements.
 * Accepts per-year loan amounts to support uneven distributions (e.g. placement years).
 * Optionally applies voluntary repayments made during the study period.
 */
export const calculateLoanAtGraduation = (
  yearlyAmounts: number[],
  startYear: number,
  plan: LoanPlan,
  voluntaryRepayments: VoluntaryRepayment[] = [],
): number => {
  let balance = 0;

  for (let year = 0; year < yearlyAmounts.length; year++) {
    const annualLoanAmount = yearlyAmounts[year];
    const termlyInstallment = annualLoanAmount / 3;
    const academicYear = startYear + year;
    const annualRate = getInterestRateDuringStudy(academicYear, plan);
    const yearRepayments = getRepaymentsForAcademicYear(
      voluntaryRepayments,
      academicYear,
    );

    if (annualRate === 0) {
      balance += annualLoanAmount;
      for (const vr of yearRepayments) {
        const actual = Math.min(vr.amount, balance);
        balance -= actual;
        if (balance <= 0) {
          balance = 0;
          break;
        }
      }
      continue;
    }

    const dailyRate = annualRate / 100 / 365;
    balance = processAcademicYear(
      balance,
      termlyInstallment,
      dailyRate,
      yearRepayments,
    );

    if (balance <= 0) break;
  }

  return parseFloat(balance.toFixed(2));
};

/**
 * Calculate the loan balance at the end of each study year,
 * using the same termly disbursement + compound interest logic.
 * Optionally applies voluntary repayments made during the study period.
 */
export const calculateStudyYearBalances = (
  yearlyAmounts: number[],
  startYear: number,
  plan: LoanPlan,
  voluntaryRepayments: VoluntaryRepayment[] = [],
): Array<{ year: number; balance: number }> => {
  let balance = 0;
  const result: Array<{ year: number; balance: number }> = [];

  for (let year = 0; year < yearlyAmounts.length; year++) {
    const annualLoanAmount = yearlyAmounts[year];
    const termlyInstallment = annualLoanAmount / 3;
    const academicYear = startYear + year;
    const annualRate = getInterestRateDuringStudy(academicYear, plan);
    const yearRepayments = getRepaymentsForAcademicYear(
      voluntaryRepayments,
      academicYear,
    );

    if (annualRate === 0) {
      balance += annualLoanAmount;
      for (const vr of yearRepayments) {
        const actual = Math.min(vr.amount, balance);
        balance -= actual;
        if (balance <= 0) {
          balance = 0;
          break;
        }
      }
      result.push({
        year: academicYear,
        balance: parseFloat(balance.toFixed(2)),
      });
      continue;
    }

    const dailyRate = annualRate / 100 / 365;
    const balanceBeforeYear = balance;
    balance = processAcademicYear(
      balance,
      termlyInstallment,
      dailyRate,
      yearRepayments,
    );

    result.push({
      year: academicYear,
      balance: parseFloat(balance.toFixed(2)),
    });

    // Only break early if a voluntary repayment zeroed the balance
    if (balance <= 0 && balanceBeforeYear + annualLoanAmount > 0) break;
  }

  return result;
};
