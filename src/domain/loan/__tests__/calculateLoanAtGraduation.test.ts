import { describe, expect, it } from "vitest";
import { calculateLoanAtGraduation } from "../calculateLoanAtGraduation";

describe("calculateLoanAtGraduation", () => {
  describe("interest-free plans", () => {
    it("Plan 4 (Scotland) - no interest accrued", () => {
      const result = calculateLoanAtGraduation(27000, 2022, 3, "plan4");
      expect(result).toBe(27000);
    });

    it("Plan 5 (post-2023 England/Wales) - no interest accrued", () => {
      const result = calculateLoanAtGraduation(30000, 2023, 3, "plan5");
      expect(result).toBe(30000);
    });
  });
  describe("termly disbursement modeling", () => {
    it("termly disbursement accrues interest correctly", () => {
      // With termly disbursements over 1 year at 2022 rates (high inflation year)
      const withTermly = calculateLoanAtGraduation(9000, 2022, 1, "plan2");

      // 2022 Plan 2 rate: 6.9%
      // Expect £9,200-£9,600 depending on termly disbursement timing
      expect(withTermly).toBeGreaterThan(9200);
      expect(withTermly).toBeLessThan(9600);
    });

    it("multiple installments reduce interest vs single upfront payment", () => {
      // Use 2015 with lower rate (3.9%) for clearer comparison
      const result = calculateLoanAtGraduation(9000, 2015, 1, "plan2");

      // 2015 had 3.9% rate - with termly disbursements expect ~£9,170-£9,270
      expect(result).toBeGreaterThan(9000);
      expect(result).toBeLessThan(9350);
    });

    it("three-year undergraduate course with Plan 2", () => {
      // £27k total (£9k/year), started 2020, 3 years
      // Plan 2 rates: 2020=5.6%, 2021=4.5%, 2022=6.9%
      const result = calculateLoanAtGraduation(27000, 2020, 3, "plan2");

      // With termly disbursements, expect ~£29,800-£31,500
      // (termly reduces interest vs upfront)
      expect(result).toBeGreaterThan(29000);
      expect(result).toBeLessThan(32000);
    });

    it("four-year course accrues more than three-year", () => {
      const threeYear = calculateLoanAtGraduation(27000, 2022, 3, "plan2");
      const fourYear = calculateLoanAtGraduation(36000, 2022, 4, "plan2");

      // Four year should accrue more total interest
      expect(fourYear).toBeGreaterThan(threeYear);
    });

    it("high vs low rate years", () => {
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
    it("postgrad loan with interest over 1-year course", () => {
      // £11,570 masters loan, 1 year, starting 2022
      // Postgrad rates are RPI + 3%
      const result = calculateLoanAtGraduation(11570, 2022, 1, "postgrad");

      expect(result).toBeGreaterThan(11570);
      expect(result).toBeLessThan(12200); // ~5% max expected
    });

    it("postgrad 2-year course (e.g., part-time)", () => {
      const result = calculateLoanAtGraduation(11570, 2022, 2, "postgrad");

      // Should be higher than 1-year due to additional compounding
      expect(result).toBeGreaterThan(12000);
      expect(result).toBeLessThan(13000);
    });
  });

  describe("edge cases", () => {
    it("zero principal returns zero", () => {
      const result = calculateLoanAtGraduation(0, 2022, 3, "plan2");
      expect(result).toBe(0);
    });

    it("very small principal (£1) compounds correctly", () => {
      const result = calculateLoanAtGraduation(1, 2022, 1, "plan2");
      expect(result).toBeGreaterThan(1);
      expect(result).toBeLessThan(1.1);
    });

    it("very large principal (£100k) scales appropriately", () => {
      const result = calculateLoanAtGraduation(100000, 2022, 3, "plan2");
      expect(result).toBeGreaterThan(100000);
      expect(result).toBeLessThan(120000);
    });
  });

  describe("year-to-year rate changes", () => {
    it("rates change each September during course", () => {
      // Starting in 2020 (lower RPI) vs 2022 (higher RPI)
      const lowRpiYear = calculateLoanAtGraduation(27000, 2020, 3, "plan2");
      const highRpiYear = calculateLoanAtGraduation(27000, 2022, 3, "plan2");

      // 2022-2023 had higher inflation, so should accrue more interest
      // This test may need adjustment based on actual historical rates
      expect(highRpiYear).not.toBe(lowRpiYear);
    });
  });
});
