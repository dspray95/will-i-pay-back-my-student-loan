import { describe, expect, it } from "vitest";
import { calculateRepaymentPlan } from "../calculateRepaymentPlan";

describe("calculateLoanAtRepayment", () => {
  describe("income below threshold", () => {
    it("no repayments when income below threshold", () => {
      const incomeByYear = {
        2024: 20000,
        2025: 22000,
        2026: 24000,
      };

      const result = calculateRepaymentPlan(
        30000,
        2023,
        2026,
        "plan2",
        incomeByYear
      );

      expect(result.totalRepaid).toBe(0);
      expect(result.finalBalance).toBeGreaterThan(30000); // Interest accrued
      expect(result.yearByYearBreakdown.length).toBe(4); // 1 gap year + 3 repayment years
    });
  });

  describe("income above threshold", () => {
    it("Plan 2: 9% above £27,295 threshold (2024)", () => {
      const incomeByYear = {
        2024: 35000, // £7,705 above threshold
      };

      const result = calculateRepaymentPlan(
        30000,
        2023,
        2024,
        "plan2",
        incomeByYear
      );

      // Expected repayment: ~£693 (9% of £7,705)
      expect(result.totalRepaid).toBeGreaterThan(650);
      expect(result.totalRepaid).toBeLessThan(750);
    });

    it("Postgrad: 6% above threshold", () => {
      const incomeByYear = {
        2024: 30000, // ~£9k above postgrad threshold (~£21k)
      };

      const result = calculateRepaymentPlan(
        11570,
        2023,
        2024,
        "postgrad",
        incomeByYear
      );

      // Expected: 6% of ~£9k = ~£540
      expect(result.totalRepaid).toBeGreaterThan(450);
      expect(result.totalRepaid).toBeLessThan(650);
    });
  });

  describe("loan fully repaid", () => {
    it("stops calculating when balance reaches zero", () => {
      const incomeByYear = {
        2024: 80000,
        2025: 80000,
        2026: 80000,
        2027: 80000,
        2028: 80000,
      };

      const result = calculateRepaymentPlan(
        15000,
        2023,
        2030,
        "plan2",
        incomeByYear
      );

      expect(result.finalBalance).toBe(0);
      expect(result.yearByYearBreakdown.length).toBeLessThan(6); // Paid off early (includes gap year)

      // Total repaid should equal initial balance + interest accrued
      expect(result.totalRepaid).toBeGreaterThan(15000);
    });

    it("cannot overpay - repayment capped at balance", () => {
      const incomeByYear = {
        2024: 100000, // Very high income
      };

      const result = calculateRepaymentPlan(
        5000, // Small balance
        2023,
        2024,
        "plan2",
        incomeByYear
      );

      expect(result.finalBalance).toBe(0);
      // Should repay balance + interest, not 9% of (£100k - £27k)
      expect(result.totalRepaid).toBeLessThan(6000);
    });
  });

  describe("interest accrual during repayment", () => {
    it("balance grows when repayments < interest", () => {
      const incomeByYear = {
        2024: 28000, // Just above threshold
        2025: 28000,
        2026: 28000,
      };

      const result = calculateRepaymentPlan(
        50000, // Large balance
        2023,
        2026,
        "plan2",
        incomeByYear
      );

      // Small repayments won't cover interest on £50k
      expect(result.finalBalance).toBeGreaterThan(50000);
      expect(result.totalRepaid).toBeLessThan(2000); // Minimal repayments
    });

    it("Plan 2 sliding scale: higher income = higher interest rate", () => {
      // Setup: 2023 determines the rate for 2024
      const lowIncome = { 2023: 30000, 2024: 30000 };
      const highIncome = { 2023: 50000, 2024: 50000 };

      const resultLow = calculateRepaymentPlan(
        30000,
        2023,
        2024,
        "plan2",
        lowIncome
      );

      const resultHigh = calculateRepaymentPlan(
        30000,
        2023,
        2024,
        "plan2",
        highIncome
      );

      // Higher previous income (2023) should trigger higher interest rate in 2024
      // Index 1 = first repayment year (index 0 is the graduation gap year)
      expect(resultHigh.yearByYearBreakdown[1].interestAccrued).toBeGreaterThan(
        resultLow.yearByYearBreakdown[1].interestAccrued
      );
    });
  });

  describe("breakdown accuracy", () => {
    it("breakdown values sum correctly", () => {
      const incomeByYear = {
        2024: 35000,
        2025: 40000,
      };

      const result = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        incomeByYear
      );

      // Verify first year
      const year1 = result.yearByYearBreakdown[0];
      const expectedEndingBalance =
        year1.startingBalance + year1.interestAccrued - year1.repayment;

      expect(year1.endingBalance).toBeCloseTo(expectedEndingBalance, 2);

      // Verify ending balance of year N = starting balance of year N+1
      if (result.yearByYearBreakdown.length > 1) {
        const year2 = result.yearByYearBreakdown[1];
        expect(year2.startingBalance).toBeCloseTo(year1.endingBalance, 2);
      }
    });

    it("income values stored correctly in breakdown", () => {
      const incomeByYear = {
        2024: 35000,
        2025: 42000,
      };

      const result = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        incomeByYear
      );

      // Index 0 is the graduation gap year (income 0), repayment years start at index 1
      expect(result.yearByYearBreakdown[1].income).toBe(35000);
      expect(result.yearByYearBreakdown[2].income).toBe(42000);
    });
  });

  describe("edge cases", () => {
    it("zero income results in zero repayments", () => {
      const incomeByYear = {
        2024: 0,
        2025: 0,
      };

      const result = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        incomeByYear
      );

      expect(result.totalRepaid).toBe(0);
    });

    it("missing income years default to zero", () => {
      const incomeByYear = {
        2024: 35000,
        // 2025 missing
        2026: 40000,
      };

      const result = calculateRepaymentPlan(
        30000,
        2023,
        2026,
        "plan2",
        incomeByYear
      );

      // Index 0 is gap year, index 1 is 2024, index 2 is 2025 (missing income)
      expect(result.yearByYearBreakdown[2].income).toBe(0);
      expect(result.yearByYearBreakdown[2].repayment).toBe(0);
    });
  });

  describe("voluntary repayments", () => {
    const baseIncome = { 2024: 35000, 2025: 35000, 2026: 35000 };

    it("reduces the final balance", () => {
      const withoutVoluntary = calculateRepaymentPlan(
        30000,
        2023,
        2026,
        "plan2",
        baseIncome,
      );

      const withVoluntary = calculateRepaymentPlan(
        30000,
        2023,
        2026,
        "plan2",
        baseIncome,
        undefined,
        [{ date: "2024-06-15", amount: 5000 }],
      );

      expect(withVoluntary.finalBalance).toBeLessThan(withoutVoluntary.finalBalance);
    });

    it("voluntary repayment is included in totalRepaid", () => {
      const withoutVoluntary = calculateRepaymentPlan(
        30000,
        2023,
        2026,
        "plan2",
        baseIncome,
      );

      const withVoluntary = calculateRepaymentPlan(
        30000,
        2023,
        2026,
        "plan2",
        baseIncome,
        undefined,
        [{ date: "2024-06-15", amount: 5000 }],
      );

      expect(withVoluntary.totalRepaid).toBeGreaterThan(withoutVoluntary.totalRepaid);
    });

    it("reduces interest accrued in subsequent months", () => {
      const withoutVoluntary = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        baseIncome,
      );

      // Voluntary repayment early in the first repayment year
      const withVoluntary = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        baseIncome,
        undefined,
        [{ date: "2024-04-10", amount: 10000 }],
      );

      // Second repayment year (index 2) should accrue less interest
      expect(withVoluntary.yearByYearBreakdown[2].interestAccrued).toBeLessThan(
        withoutVoluntary.yearByYearBreakdown[2].interestAccrued,
      );
    });

    it("cannot overpay beyond the balance", () => {
      const result = calculateRepaymentPlan(
        5000,
        2023,
        2024,
        "plan2",
        { 2024: 35000 },
        undefined,
        [{ date: "2024-04-05", amount: 999999 }],
      );

      expect(result.finalBalance).toBe(0);
      // Total repaid should be roughly balance + small interest, not 999999
      expect(result.totalRepaid).toBeLessThan(6000);
    });

    it("can fully repay the loan early", () => {
      const result = calculateRepaymentPlan(
        10000,
        2023,
        2030,
        "plan2",
        baseIncome,
        undefined,
        [{ date: "2024-05-01", amount: 15000 }],
      );

      expect(result.finalBalance).toBe(0);
      // Should stop after the first repayment year
      expect(result.yearByYearBreakdown.length).toBe(2); // gap year + 2024
    });

    it("later repayment day accrues more interest before deduction", () => {
      const earlyInMonth = calculateRepaymentPlan(
        30000,
        2023,
        2024,
        "plan2",
        { 2024: 35000 },
        undefined,
        [{ date: "2024-06-01", amount: 5000 }],
      );

      const lateInMonth = calculateRepaymentPlan(
        30000,
        2023,
        2024,
        "plan2",
        { 2024: 35000 },
        undefined,
        [{ date: "2024-06-28", amount: 5000 }],
      );

      // Paying later means more interest accrued on the higher balance
      const earlyYear = earlyInMonth.yearByYearBreakdown[1];
      const lateYear = lateInMonth.yearByYearBreakdown[1];
      expect(lateYear.interestAccrued).toBeGreaterThan(earlyYear.interestAccrued);
    });

    it("handles multiple voluntary repayments in the same month", () => {
      const result = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        baseIncome,
        undefined,
        [
          { date: "2024-06-10", amount: 2000 },
          { date: "2024-06-20", amount: 3000 },
        ],
      );

      const withoutVoluntary = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        baseIncome,
      );

      expect(result.finalBalance).toBeLessThan(withoutVoluntary.finalBalance);
      expect(result.totalRepaid).toBeGreaterThan(withoutVoluntary.totalRepaid);
    });

    it("handles voluntary repayments across different years", () => {
      const result = calculateRepaymentPlan(
        30000,
        2023,
        2026,
        "plan2",
        baseIncome,
        undefined,
        [
          { date: "2024-07-15", amount: 3000 },
          { date: "2025-07-15", amount: 3000 },
        ],
      );

      const withoutVoluntary = calculateRepaymentPlan(
        30000,
        2023,
        2026,
        "plan2",
        baseIncome,
      );

      expect(result.finalBalance).toBeLessThan(withoutVoluntary.finalBalance);
    });

    it("no effect when voluntary repayments array is empty", () => {
      const withEmpty = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        baseIncome,
        undefined,
        [],
      );

      const withDefault = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        baseIncome,
      );

      expect(withEmpty.finalBalance).toBe(withDefault.finalBalance);
      expect(withEmpty.totalRepaid).toBe(withDefault.totalRepaid);
    });

    it("breakdown values still sum correctly with voluntary repayments", () => {
      const result = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        baseIncome,
        undefined,
        [{ date: "2024-06-15", amount: 5000 }],
      );

      for (let i = 0; i < result.yearByYearBreakdown.length - 1; i++) {
        const current = result.yearByYearBreakdown[i];
        const next = result.yearByYearBreakdown[i + 1];
        expect(next.startingBalance).toBeCloseTo(current.endingBalance, 2);
      }
    });
  });

  describe("voluntary repayments during gap period", () => {
    const baseIncome = { 2024: 35000, 2025: 35000 };

    it("reduces balance when paid in October of graduation year", () => {
      const withoutVoluntary = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        baseIncome,
      );

      const withVoluntary = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        baseIncome,
        undefined,
        [{ date: "2023-10-15", amount: 5000 }],
      );

      // Gap year (index 0) should show the repayment
      expect(withVoluntary.yearByYearBreakdown[0].repayment).toBeGreaterThan(0);
      expect(withVoluntary.finalBalance).toBeLessThan(withoutVoluntary.finalBalance);
    });

    it("reduces balance when paid in January after graduation", () => {
      const withoutVoluntary = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        baseIncome,
      );

      const withVoluntary = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        baseIncome,
        undefined,
        [{ date: "2024-02-15", amount: 5000 }],
      );

      expect(withVoluntary.yearByYearBreakdown[0].repayment).toBeGreaterThan(0);
      expect(withVoluntary.finalBalance).toBeLessThan(withoutVoluntary.finalBalance);
    });

    it("gap period repayment reduces interest in subsequent years", () => {
      const withoutVoluntary = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        baseIncome,
      );

      const withVoluntary = calculateRepaymentPlan(
        30000,
        2023,
        2025,
        "plan2",
        baseIncome,
        undefined,
        [{ date: "2023-09-15", amount: 10000 }],
      );

      // First repayment year (index 1) should accrue less interest
      expect(withVoluntary.yearByYearBreakdown[1].interestAccrued).toBeLessThan(
        withoutVoluntary.yearByYearBreakdown[1].interestAccrued,
      );
    });

    it("can fully repay during gap period", () => {
      const result = calculateRepaymentPlan(
        5000,
        2023,
        2030,
        "plan2",
        baseIncome,
        undefined,
        [{ date: "2023-09-05", amount: 10000 }],
      );

      expect(result.finalBalance).toBe(0);
      expect(result.yearByYearBreakdown[0].repayment).toBeGreaterThan(0);
    });
  });

  describe("plan-specific differences", () => {
    it("Plan 5 has higher threshold than Plan 2", () => {
      const incomeByYear = { 2024: 27000 };

      const plan2 = calculateRepaymentPlan(
        30000,
        2023,
        2024,
        "plan2",
        incomeByYear
      );

      const plan5 = calculateRepaymentPlan(
        30000,
        2023,
        2024,
        "plan5",
        incomeByYear
      );

      // Plan 5 threshold is ~£25k, Plan 2 is ~£27k
      // So at £27k income, Plan 5 should have repayments, Plan 2 might not
      expect(plan5.totalRepaid).toBeGreaterThan(plan2.totalRepaid);
    });
  });
});
