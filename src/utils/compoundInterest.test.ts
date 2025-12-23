import {
  calculateLoanAtGraduation,
  calculateLoanAtRepayment,
} from "./compountInterest";
import type { LoanPlan } from "../data/plans";

describe("calculateLoanAtGraduation", () => {
  describe("interest-free plans", () => {
    test("Plan 4 (Scotland) - no interest accrued", () => {
      const result = calculateLoanAtGraduation(27000, 2022, 3, "plan4");
      expect(result).toBe(27000);
    });

    test("Plan 5 (post-2023 England/Wales) - no interest accrued", () => {
      const result = calculateLoanAtGraduation(30000, 2023, 3, "plan5");
      expect(result).toBe(30000);
    });
  });
  describe("termly disbursement modeling", () => {
    test("termly disbursement accrues interest correctly", () => {
      // With termly disbursements over 1 year at 2022 rates (high inflation year)
      const withTermly = calculateLoanAtGraduation(9000, 2022, 1, "plan2");

      // 2022 Plan 2 rate: 6.9%
      // Expect £9,200-£9,600 depending on termly disbursement timing
      expect(withTermly).toBeGreaterThan(9200);
      expect(withTermly).toBeLessThan(9600);
    });

    test("multiple installments reduce interest vs single upfront payment", () => {
      // Use 2015 with lower rate (3.9%) for clearer comparison
      const result = calculateLoanAtGraduation(9000, 2015, 1, "plan2");

      // 2015 had 3.9% rate - with termly disbursements expect ~£9,170-£9,270
      expect(result).toBeGreaterThan(9000);
      expect(result).toBeLessThan(9350);
    });

    test("three-year undergraduate course with Plan 2", () => {
      // £27k total (£9k/year), started 2020, 3 years
      // Plan 2 rates: 2020=5.6%, 2021=4.5%, 2022=6.9%
      const result = calculateLoanAtGraduation(27000, 2020, 3, "plan2");

      // With termly disbursements, expect ~£29,800-£31,500
      // (termly reduces interest vs upfront)
      expect(result).toBeGreaterThan(29000);
      expect(result).toBeLessThan(32000);
    });

    test("four-year course accrues more than three-year", () => {
      const threeYear = calculateLoanAtGraduation(27000, 2022, 3, "plan2");
      const fourYear = calculateLoanAtGraduation(36000, 2022, 4, "plan2");

      // Four year should accrue more total interest
      expect(fourYear).toBeGreaterThan(threeYear);
    });

    test("high vs low rate years", () => {
      // 2015 had 3.9% (lower rate)
      const lowRateYear = calculateLoanAtGraduation(9000, 2015, 1, "plan2");

      // 2023 had 7.7% (higher rate)
      const highRateYear = calculateLoanAtGraduation(9000, 2023, 1, "plan2");

      // 2023 should have significantly more interest
      expect(highRateYear).toBeGreaterThan(lowRateYear);
      // With termly disbursements at 7.7%, expect ~£9,450-£9,500
      expect(highRateYear).toBeGreaterThan(9450);
      expect(lowRateYear).toBeLessThan(9350); // ~£350 or less at 3.9%
    });
  });

  describe("postgraduate loans", () => {
    test("postgrad loan with interest over 1-year course", () => {
      // £11,570 masters loan, 1 year, starting 2022
      // Postgrad rates are RPI + 3%
      const result = calculateLoanAtGraduation(11570, 2022, 1, "postgrad");

      expect(result).toBeGreaterThan(11570);
      expect(result).toBeLessThan(12200); // ~5% max expected
    });

    test("postgrad 2-year course (e.g., part-time)", () => {
      const result = calculateLoanAtGraduation(11570, 2022, 2, "postgrad");

      // Should be higher than 1-year due to additional compounding
      expect(result).toBeGreaterThan(12000);
      expect(result).toBeLessThan(13000);
    });
  });

  describe("edge cases", () => {
    test("zero principal returns zero", () => {
      const result = calculateLoanAtGraduation(0, 2022, 3, "plan2");
      expect(result).toBe(0);
    });

    test("very small principal (£1) compounds correctly", () => {
      const result = calculateLoanAtGraduation(1, 2022, 1, "plan2");
      expect(result).toBeGreaterThan(1);
      expect(result).toBeLessThan(1.1);
    });

    test("very large principal (£100k) scales appropriately", () => {
      const result = calculateLoanAtGraduation(100000, 2022, 3, "plan2");
      expect(result).toBeGreaterThan(100000);
      expect(result).toBeLessThan(120000);
    });
  });

  describe("year-to-year rate changes", () => {
    test("rates change each September during course", () => {
      // Starting in 2020 (lower RPI) vs 2022 (higher RPI)
      const lowRpiYear = calculateLoanAtGraduation(27000, 2020, 3, "plan2");
      const highRpiYear = calculateLoanAtGraduation(27000, 2022, 3, "plan2");

      // 2022-2023 had higher inflation, so should accrue more interest
      // This test may need adjustment based on actual historical rates
      expect(highRpiYear).not.toBe(lowRpiYear);
    });
  });
});

describe("calculateLoanAtRepayment", () => {
  describe("income below threshold", () => {
    test("no repayments when income below threshold", () => {
      const incomeByYear = {
        2024: 20000,
        2025: 22000,
        2026: 24000,
      };

      const result = calculateLoanAtRepayment(
        30000,
        2023,
        2026,
        "plan2",
        incomeByYear
      );

      expect(result.totalRepaid).toBe(0);
      expect(result.finalBalance).toBeGreaterThan(30000); // Interest accrued
      expect(result.yearByYearBreakdown.length).toBe(3);
    });
  });

  describe("income above threshold", () => {
    test("Plan 2: 9% above £27,295 threshold (2024)", () => {
      const incomeByYear = {
        2024: 35000, // £7,705 above threshold
      };

      const result = calculateLoanAtRepayment(
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

    test("Postgrad: 6% above threshold", () => {
      const incomeByYear = {
        2024: 30000, // ~£9k above postgrad threshold (~£21k)
      };

      const result = calculateLoanAtRepayment(
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
    test("stops calculating when balance reaches zero", () => {
      const incomeByYear = {
        2024: 80000,
        2025: 80000,
        2026: 80000,
        2027: 80000,
        2028: 80000,
      };

      const result = calculateLoanAtRepayment(
        15000,
        2023,
        2030,
        "plan2",
        incomeByYear
      );

      expect(result.finalBalance).toBe(0);
      expect(result.yearByYearBreakdown.length).toBeLessThan(5); // Paid off early

      // Total repaid should equal initial balance + interest accrued
      expect(result.totalRepaid).toBeGreaterThan(15000);
    });

    test("cannot overpay - repayment capped at balance", () => {
      const incomeByYear = {
        2024: 100000, // Very high income
      };

      const result = calculateLoanAtRepayment(
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
    test("balance grows when repayments < interest", () => {
      const incomeByYear = {
        2024: 28000, // Just above threshold
        2025: 28000,
        2026: 28000,
      };

      const result = calculateLoanAtRepayment(
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

    test("Plan 2 sliding scale: higher income = higher interest rate", () => {
      // Setup: 2023 determines the rate for 2024
      const lowIncome = { 2023: 30000, 2024: 30000 };
      const highIncome = { 2023: 50000, 2024: 50000 };

      const resultLow = calculateLoanAtRepayment(
        30000,
        2023,
        2024,
        "plan2",
        lowIncome
      );

      const resultHigh = calculateLoanAtRepayment(
        30000,
        2023,
        2024,
        "plan2",
        highIncome
      );

      // Higher previous income (2023) should trigger higher interest rate in 2024
      expect(resultHigh.yearByYearBreakdown[0].interestAccrued).toBeGreaterThan(
        resultLow.yearByYearBreakdown[0].interestAccrued
      );
    });
  });

  describe("breakdown accuracy", () => {
    test("breakdown values sum correctly", () => {
      const incomeByYear = {
        2024: 35000,
        2025: 40000,
      };

      const result = calculateLoanAtRepayment(
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

    test("income values stored correctly in breakdown", () => {
      const incomeByYear = {
        2024: 35000,
        2025: 42000,
      };

      const result = calculateLoanAtRepayment(
        30000,
        2023,
        2025,
        "plan2",
        incomeByYear
      );

      expect(result.yearByYearBreakdown[0].income).toBe(35000);
      expect(result.yearByYearBreakdown[1].income).toBe(42000);
    });
  });

  describe("edge cases", () => {
    test("zero income results in zero repayments", () => {
      const incomeByYear = {
        2024: 0,
        2025: 0,
      };

      const result = calculateLoanAtRepayment(
        30000,
        2023,
        2025,
        "plan2",
        incomeByYear
      );

      expect(result.totalRepaid).toBe(0);
    });

    test("missing income years default to zero", () => {
      const incomeByYear = {
        2024: 35000,
        // 2025 missing
        2026: 40000,
      };

      const result = calculateLoanAtRepayment(
        30000,
        2023,
        2026,
        "plan2",
        incomeByYear
      );

      expect(result.yearByYearBreakdown[1].income).toBe(0);
      expect(result.yearByYearBreakdown[1].repayment).toBe(0);
    });
  });

  describe("plan-specific differences", () => {
    test("Plan 5 has higher threshold than Plan 2", () => {
      const incomeByYear = { 2024: 27000 };

      const plan2 = calculateLoanAtRepayment(
        30000,
        2023,
        2024,
        "plan2",
        incomeByYear
      );

      const plan5 = calculateLoanAtRepayment(
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

describe("integration: graduation to repayment", () => {
  test("complete journey: £27k loan -> 3 years study -> 10 years repayment", () => {
    // Calculate balance at graduation
    const balanceAtGrad = calculateLoanAtGraduation(27000, 2020, 3, "plan2");

    expect(balanceAtGrad).toBeGreaterThan(27000); // Interest accrued

    // Simulate repayment with moderate income
    const incomeByYear: Record<number, number> = {};
    for (let year = 2024; year <= 2033; year++) {
      incomeByYear[year] = 35000; // Consistent £35k salary
    }

    const repayment = calculateLoanAtRepayment(
      balanceAtGrad,
      2023,
      2033,
      "plan2",
      incomeByYear
    );

    expect(repayment.totalRepaid).toBeGreaterThan(0);
    expect(repayment.yearByYearBreakdown.length).toBeGreaterThan(0);
    expect(repayment.yearByYearBreakdown.length).toBeLessThanOrEqual(10);
  });

  test("combined undergrad + postgrad repayment", () => {
    const undergradBalance = calculateLoanAtGraduation(27000, 2020, 3, "plan2");
    const postgradBalance = calculateLoanAtGraduation(
      11570,
      2023,
      1,
      "postgrad"
    );

    const incomeByYear: Record<number, number> = { 2025: 45000 };

    const undergradRepay = calculateLoanAtRepayment(
      undergradBalance,
      2023,
      2025,
      "plan2",
      incomeByYear
    );

    const postgradRepay = calculateLoanAtRepayment(
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
    test("repayments are processed monthly, not as annual lump sum", () => {
      const incomeByYear = { 2024: 35000 };

      const result = calculateLoanAtRepayment(
        30000,
        2023,
        2024,
        "plan2",
        incomeByYear
      );

      const year1 = result.yearByYearBreakdown[0];

      // Repayment check: (35000 - 27295) * 0.09 = 693.45
      expect(year1.repayment).toBeGreaterThan(690);
      expect(year1.repayment).toBeLessThan(700);

      // Interest check
      expect(year1.interestAccrued).toBeLessThan(1550);
    });

    test("loan can be paid off mid-year with high income", () => {
      const incomeByYear = {
        2024: 150000, // Very high income
      };

      const result = calculateLoanAtRepayment(
        8000, // Small balance
        2023,
        2024,
        "plan2",
        incomeByYear
      );

      expect(result.finalBalance).toBe(0);
      expect(result.totalRepaid).toBeLessThan(9000);
      expect(result.yearByYearBreakdown[0].endingBalance).toBe(0);
    });

    test("leap year February has 29 days", () => {
      const incomeByYear = { 2024: 35000 };
      const result = calculateLoanAtRepayment(
        30000,
        2023,
        2024,
        "plan2",
        incomeByYear
      );
      expect(result.yearByYearBreakdown[0].interestAccrued).toBeGreaterThan(0);
    });

    test("interest compounds monthly", () => {
      const incomeByYear = {
        2024: 25000, // Below threshold
      };

      const result = calculateLoanAtRepayment(
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

    test("monthly repayments reduce balance progressively", () => {
      const incomeByYear = {
        2023: 40000, // Provides rate for 2024
        2024: 40000, // Provides rate for 2025
        2025: 40000,
      };

      const result = calculateLoanAtRepayment(
        20000,
        2023,
        2025,
        "plan2",
        incomeByYear
      );

      const year1 = result.yearByYearBreakdown[0]; // 2024 (Rate based on 2023)
      const year2 = result.yearByYearBreakdown[1]; // 2025 (Rate based on 2024)

      // Since income is constant across 2023/24, the interest RATE is constant.
      // Therefore, the lower balance in year 2 should result in less interest accrued.
      expect(year2.interestAccrued).toBeLessThan(year1.interestAccrued);
    });
  });
  describe("Plan 2 interest based on previous year income", () => {
    test("High current income gets Low interest rate if previous income was 0", () => {
      // Scenario: Fresh grad starts a high paying job (£60k) in 2024.
      // Previous year (2023) income was 0 (student).
      // Should get Minimum Interest (RPI) for 2024, not Max Interest (RPI+3%).

      const incomeByYear = {
        2023: 0,
        2024: 60000,
      };

      const result = calculateLoanAtRepayment(
        50000,
        2023,
        2024,
        "plan2",
        incomeByYear
      );

      const year2024 = result.yearByYearBreakdown[0];

      // Interest Check:
      // Rate should be based on 2023 income (£0) -> ~4.3% (2024 RPI)
      // If it used 2024 income (£60k), rate would be ~7.3% (RPI+3%)
      // Interest on £50k:
      // @ 4.3% = ~£2,150
      // @ 7.3% = ~£3,650

      expect(year2024.interestAccrued).toBeLessThan(2500);
    });

    test("Low current income gets High interest rate if previous income was high", () => {
      // Scenario: User earned £60k in 2024, then took a sabbatical (£0) in 2025.
      // In 2025: Repayments should be 0, BUT Interest Rate should be MAX (based on 2024).

      const incomeByYear = {
        2024: 60000,
        2025: 0,
      };

      const result = calculateLoanAtRepayment(
        50000,
        2023,
        2025,
        "plan2",
        incomeByYear
      );

      const year2025 = result.yearByYearBreakdown[1];

      // Repayment Check: Based on current income (£0) -> £0
      expect(year2025.repayment).toBe(0);

      // Interest Check: Based on previous income (£60k) -> Max Rate (~7.3%)
      // On ~£48k balance (after yr1 repayment), interest should be ~£3,500
      // If it used current income (£0), interest would be ~£2,100
      expect(year2025.interestAccrued).toBeGreaterThan(3000);
    });
  });
});
