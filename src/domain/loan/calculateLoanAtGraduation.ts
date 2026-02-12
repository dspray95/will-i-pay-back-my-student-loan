import type { LoanPlan } from "../../shared/types";
import { getInterestRateDuringStudy } from "./plans";

/**
 * Calculate loan balance at graduation, accounting for termly disbursements.
 */
export const calculateLoanAtGraduation = (
  principal: number,
  startYear: number,
  courseLength: number,
  plan: LoanPlan
): number => {
  const annualLoanAmount = principal / courseLength;
  const termlyInstallment = annualLoanAmount / 3;
  let balance = 0;

  for (let year = 0; year < courseLength; year++) {
    const academicYear = startYear + year;
    const annualRate = getInterestRateDuringStudy(academicYear, plan);

    if (annualRate === 0) {
      balance += annualLoanAmount;
      continue;
    }

    const dailyRate = annualRate / 100 / 365;

    // Process 3 installments per year
    balance += termlyInstallment;
    balance *= Math.pow(1 + dailyRate, 122);
    balance += termlyInstallment;
    balance *= Math.pow(1 + dailyRate, 121);
    balance += termlyInstallment;
    balance *= Math.pow(1 + dailyRate, 122);
  }

  return parseFloat(balance.toFixed(2));
};

/**
 * Calculate the loan balance at the end of each study year,
 * using the same termly disbursement + compound interest logic.
 */
export const calculateStudyYearBalances = (
  principal: number,
  startYear: number,
  courseLength: number,
  plan: LoanPlan
): Array<{ year: number; balance: number }> => {
  const annualLoanAmount = principal / courseLength;
  const termlyInstallment = annualLoanAmount / 3;
  let balance = 0;
  const result: Array<{ year: number; balance: number }> = [];

  for (let year = 0; year < courseLength; year++) {
    const academicYear = startYear + year;
    const annualRate = getInterestRateDuringStudy(academicYear, plan);

    if (annualRate === 0) {
      balance += annualLoanAmount;
      result.push({ year: academicYear, balance: parseFloat(balance.toFixed(2)) });
      continue;
    }

    const dailyRate = annualRate / 100 / 365;

    // Process 3 installments per year
    balance += termlyInstallment;
    balance *= Math.pow(1 + dailyRate, 122);
    balance += termlyInstallment;
    balance *= Math.pow(1 + dailyRate, 121);
    balance += termlyInstallment;
    balance *= Math.pow(1 + dailyRate, 122);

    result.push({ year: academicYear, balance: parseFloat(balance.toFixed(2)) });
  }

  return result;
};
