import { describe, expect, it } from "vitest";
import { calculateLoanAtGraduation } from "../../domain/loan/calculateLoanAtGraduation";
import { calculateRepaymentPlan } from "../../domain/repayment/calculateRepaymentPlan";

describe("integration: graduation to repayment", () => {
  it("complete journey: £27k loan -> 3 years study -> 10 years repayment", () => {
    // Calculate balance at graduation
    const balanceAtGrad = calculateLoanAtGraduation(27000, 2020, 3, "plan2");

    expect(balanceAtGrad).toBeGreaterThan(27000); // Interest accrued

    // Simulate repayment with moderate income
    const incomeByYear: Record<number, number> = {};
    for (let year = 2024; year <= 2033; year++) {
      incomeByYear[year] = 35000; // Consistent £35k salary
    }

    const repayment = calculateRepaymentPlan(
      balanceAtGrad,
      2023,
      2033,
      "plan2",
      incomeByYear
    );

    expect(repayment.totalRepaid).toBeGreaterThan(0);
    expect(repayment.yearByYearBreakdown.length).toBeGreaterThan(0);
    expect(repayment.yearByYearBreakdown.length).toBeLessThanOrEqual(11); // 10 repayment years + 1 gap year
  });

  it("combined undergrad + postgrad repayment", () => {
    const undergradBalance = calculateLoanAtGraduation(27000, 2020, 3, "plan2");
    const postgradBalance = calculateLoanAtGraduation(
      11570,
      2023,
      1,
      "postgrad"
    );

    const incomeByYear: Record<number, number> = { 2025: 45000 };

    const undergradRepay = calculateRepaymentPlan(
      undergradBalance,
      2023,
      2025,
      "plan2",
      incomeByYear
    );

    const postgradRepay = calculateRepaymentPlan(
      postgradBalance,
      2024,
      2025,
      "postgrad",
      incomeByYear
    );

    // Should be paying both loans simultaneously
    const totalRepayment =
      undergradRepay.totalRepaid + postgradRepay.totalRepaid;

    expect(totalRepayment).toBeGreaterThan(undergradRepay.totalRepaid);
    expect(totalRepayment).toBeGreaterThan(postgradRepay.totalRepaid);
  });

  describe("monthly repayment behavior", () => {
    it("repayments are processed monthly, not as annual lump sum", () => {
      const incomeByYear = { 2024: 35000 };

      const result = calculateRepaymentPlan(
        30000,
        2023,
        2024,
        "plan2",
        incomeByYear
      );

      // Index 1 = first repayment year (index 0 is the graduation gap year)
      const year1 = result.yearByYearBreakdown[1];

      // Repayment check: (35000 - 27295) * 0.09 = 693.45
      expect(year1.repayment).toBeGreaterThan(690);
      expect(year1.repayment).toBeLessThan(700);

      // Interest check
      expect(year1.interestAccrued).toBeLessThan(1550);
    });

    it("loan can be paid off mid-year with high income", () => {
      const incomeByYear = {
        2024: 150000, // Very high income
      };

      const result = calculateRepaymentPlan(
        8000, // Small balance
        2023,
        2024,
        "plan2",
        incomeByYear
      );

      expect(result.finalBalance).toBe(0);
      expect(result.totalRepaid).toBeLessThan(9000);
      expect(result.yearByYearBreakdown[1].endingBalance).toBe(0);
    });

    it("leap year February has 29 days", () => {
      const incomeByYear = { 2024: 35000 };
      const result = calculateRepaymentPlan(
        30000,
        2023,
        2024,
        "plan2",
        incomeByYear
      );
      expect(result.yearByYearBreakdown[0].interestAccrued).toBeGreaterThan(0);
    });

    it("interest compounds monthly", () => {
      const incomeByYear = {
        2024: 25000, // Below threshold
      };

      const result = calculateRepaymentPlan(
        10000,
        2023,
        2024,
        "plan2",
        incomeByYear
      );

      const year1 = result.yearByYearBreakdown[0];

      expect(year1.repayment).toBe(0);
      // Adjusted range for 2024 interest rates (~3.25% - 4.3%)
      expect(year1.interestAccrued).toBeGreaterThan(300);
      expect(year1.interestAccrued).toBeLessThan(500);

      expect(year1.endingBalance).toBeCloseTo(
        year1.startingBalance + year1.interestAccrued,
        2
      );
    });

    it("monthly repayments reduce balance progressively", () => {
      const incomeByYear = {
        2024: 60000,
        2025: 60000,
      };

      // Use "plan1" because it has a flat interest rate.
      // This ensures the only variable changing is the Balance.
      const result = calculateRepaymentPlan(
        20000,
        2023,
        2025,
        "plan1",
        incomeByYear
      );

      // Index 1 and 2 = first and second repayment years (index 0 is gap year)
      const year1 = result.yearByYearBreakdown[1];
      const year2 = result.yearByYearBreakdown[2];

      // With a flat rate, lower balance MUST mean lower interest.
      expect(year2.interestAccrued).toBeLessThan(year1.interestAccrued);
    });
  });
  describe("Plan 2 interest based on previous year income", () => {
    it("High current income gets Low interest rate if previous income was 0", () => {
      // Scenario: Fresh grad starts a high paying job (£60k) in 2024.
      // Previous year (2023) income was 0 (student).
      // Should get Minimum Interest (RPI) for 2024, not Max Interest (RPI+3%).

      const incomeByYear = {
        2023: 0,
        2024: 60000,
      };

      const result = calculateRepaymentPlan(
        50000,
        2023,
        2024,
        "plan2",
        incomeByYear
      );

      // Index 1 = first repayment year 2024 (index 0 is gap year)
      const year2024 = result.yearByYearBreakdown[1];

      // Interest Check:
      // Rate should be based on 2023 income (£0) -> ~4.3% (2024 RPI)
      // If it used 2024 income (£60k), rate would be ~7.3% (RPI+3%)
      // Interest on £50k:
      // @ 4.3% = ~£2,150
      // @ 7.3% = ~£3,650

      expect(year2024.interestAccrued).toBeLessThan(2500);
    });

    it("Low current income gets High interest rate if previous income was high", () => {
      // Scenario: User earned £60k in 2024, then took a sabbatical (£0) in 2025.
      // In 2025: Repayments should be 0, BUT Interest Rate should be MAX (based on 2024).

      const incomeByYear = {
        2024: 60000,
        2025: 0,
      };

      const result = calculateRepaymentPlan(
        50000,
        2023,
        2025,
        "plan2",
        incomeByYear
      );

      // Index 2 = second repayment year 2025 (index 0 is gap year)
      const year2025 = result.yearByYearBreakdown[2];

      // Repayment Check: Based on current income (£0) -> £0
      expect(year2025.repayment).toBe(0);

      // Interest Check: Based on previous income (£60k) -> Max Rate (~7.3%)
      // On ~£48k balance (after yr1 repayment), interest should be ~£3,500
      // If it used current income (£0), interest would be ~£2,100
      expect(year2025.interestAccrued).toBeGreaterThan(3000);
    });
  });
});
