import { describe, expect, it } from "vitest";
import { processResults } from "../processResults";
import type { RepaymentPlan } from "../../../shared/types";

const makeRepaymentPlan = (overrides: Partial<RepaymentPlan> = {}): RepaymentPlan => ({
  finalBalance: 0,
  totalRepaid: 10000,
  yearByYearBreakdown: [
    {
      year: 2024,
      startingBalance: 30000,
      interestAccrued: 1500,
      repayment: 5000,
      endingBalance: 26500,
      income: 40000,
    },
    {
      year: 2025,
      startingBalance: 26500,
      interestAccrued: 1200,
      repayment: 5000,
      endingBalance: 22700,
      income: 42000,
    },
  ],
  ...overrides,
});

describe("processResults", () => {
  it("correctly identifies when loans will be repaid", () => {
    const undergradPlan = makeRepaymentPlan({ finalBalance: 0 });
    const postgradPlan = makeRepaymentPlan({ finalBalance: 0 });

    const result = processResults(undergradPlan, postgradPlan, 30000, 11000);

    expect(result.willRepayUndergraduateLoan).toBe(true);
    expect(result.willRepayPostgraduateLoan).toBe(true);
  });

  it("correctly identifies when loans will not be repaid", () => {
    const undergradPlan = makeRepaymentPlan({ finalBalance: 5000 });
    const postgradPlan = makeRepaymentPlan({ finalBalance: 3000 });

    const result = processResults(undergradPlan, postgradPlan, 30000, 11000);

    expect(result.willRepayUndergraduateLoan).toBe(false);
    expect(result.willRepayPostgraduateLoan).toBe(false);
  });

  it("calculates total interest accrued across all years", () => {
    const undergradPlan = makeRepaymentPlan();
    const postgradPlan = makeRepaymentPlan({
      yearByYearBreakdown: [
        {
          year: 2025,
          startingBalance: 11000,
          interestAccrued: 500,
          repayment: 300,
          endingBalance: 11200,
          income: 40000,
        },
      ],
    });

    const result = processResults(undergradPlan, postgradPlan, 30000, 11000);

    // Undergrad: 1500 + 1200 = 2700
    expect(result.totalUndergraduateInterestAccrued).toBe(2700);
    // Postgrad: 500
    expect(result.totalPostgraduateInterestAccrued).toBe(500);
  });

  it("calculates forgiven amounts from final balance", () => {
    const undergradPlan = makeRepaymentPlan({ finalBalance: 12000 });
    const postgradPlan = makeRepaymentPlan({ finalBalance: 4000 });

    const result = processResults(undergradPlan, postgradPlan, 30000, 11000);

    expect(result.undergraduateAmountForgiven).toBe(12000);
    expect(result.postgraduateAmountForgiven).toBe(4000);
  });

  it("calculates total debt paid from breakdown repayments", () => {
    const undergradPlan = makeRepaymentPlan();

    const result = processResults(
      undergradPlan,
      makeRepaymentPlan({ finalBalance: 0, totalRepaid: 0, yearByYearBreakdown: [] }),
      30000,
      0
    );

    // 5000 + 5000 from the two years in makeRepaymentPlan
    expect(result.totalUndergraduateDebtPaid).toBe(10000);
  });

  it("returns zero postgrad totals when no postgrad loan", () => {
    const undergradPlan = makeRepaymentPlan();
    const emptyPostgradPlan: RepaymentPlan = {
      finalBalance: 0,
      totalRepaid: 0,
      yearByYearBreakdown: [],
    };

    const result = processResults(undergradPlan, emptyPostgradPlan, 30000, 0);

    expect(result.totalPostgraduateDebtPaid).toBe(0);
    expect(result.totalPostgraduateInterestAccrued).toBe(0);
    expect(result.totalPostgraduateLoanAmount).toBe(0);
  });
});
