import { describe, it, expect } from "vitest";
import { getInterestRateAtRepayment } from "../interest";

describe("getInterestRateAtRepayment", () => {
  describe("Plan 2 progressive rates", () => {
    it("returns minimum rate when income is at or below threshold", () => {
      const rate = getInterestRateAtRepayment(2025, "plan2", 28470);
      expect(rate).toBe(4.3);

      const rateBelowThreshold = getInterestRateAtRepayment(
        2025,
        "plan2",
        20000
      );
      expect(rateBelowThreshold).toBe(4.3);
    });

    it("returns maximum rate when income is at or above upper threshold", () => {
      const rate = getInterestRateAtRepayment(2025, "plan2", 51245);
      expect(rate).toBe(7.3);

      const rateAboveThreshold = getInterestRateAtRepayment(
        2025,
        "plan2",
        60000
      );
      expect(rateAboveThreshold).toBe(7.3);
    });

    it("interpolates rate for income between thresholds", () => {
      // Income exactly in the middle should give rate in the middle
      const lowerThreshold = 28470;
      const upperThreshold = 51245;
      const midIncome = (lowerThreshold + upperThreshold) / 2;

      const rate = getInterestRateAtRepayment(2025, "plan2", midIncome);

      // Expected: (4.3 + 7.3) / 2 = 5.8
      expect(rate).toBeCloseTo(5.8, 1);
    });

    it("calculates correct progressive rate for specific income", () => {
      // Income: £40,000
      // Lower threshold: £28,470, Upper threshold: £51,245
      // Min rate: 4.3%, Max rate: 7.3%
      // Income above lower: 40000 - 28470 = 11530
      // Range: 51245 - 28470 = 22775
      // Rate range: 7.3 - 4.3 = 3.0
      // Expected: 4.3 + (11530 / 22775) * 3.0 ≈ 5.82%

      const rate = getInterestRateAtRepayment(2025, "plan2", 40000);
      expect(rate).toBeCloseTo(5.82, 1);
    });
  });

  describe("Flat rate plans", () => {
    it("returns flat rate for Plan 1 regardless of income", () => {
      expect(getInterestRateAtRepayment(2025, "plan1", 20000)).toBe(4.3);
      expect(getInterestRateAtRepayment(2025, "plan1", 50000)).toBe(4.3);
      expect(getInterestRateAtRepayment(2025, "plan1", 100000)).toBe(4.3);
    });

    it("returns flat rate for Plan 5", () => {
      expect(getInterestRateAtRepayment(2024, "plan5", 30000)).toBe(4.3);
      expect(getInterestRateAtRepayment(2024, "plan5", 80000)).toBe(4.3);
    });

    it("returns flat rate for postgrad", () => {
      expect(getInterestRateAtRepayment(2025, "postgrad", 25000)).toBe(7.3);
      expect(getInterestRateAtRepayment(2025, "postgrad", 60000)).toBe(7.3);
    });
  });

  describe("Historical rates", () => {
    it("returns correct rates for past years", () => {
      expect(getInterestRateAtRepayment(2022, "plan1", 30000)).toBe(5.0);
      expect(getInterestRateAtRepayment(2023, "plan2", 20000)).toBe(5.5);
    });
  });

  describe("Future years fallback", () => {
    it("uses long-term forecast for years beyond data", () => {
      // Should fall back to LONG_TERM_FORECAST (RPI 2.5%)
      const rate = getInterestRateAtRepayment(2030, "plan1", 30000);
      expect(rate).toBe(2.5);

      const ratePlan2 = getInterestRateAtRepayment(2030, "plan2", 20000);
      expect(ratePlan2).toBe(2.5);
    });
  });
});
