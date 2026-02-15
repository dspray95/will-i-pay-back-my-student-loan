import { getForgivenessPlanForYear } from "../forgiveness";
import { describe, it, expect } from "vitest";

describe("getForgivenessPlanForYear", () => {
  describe("Plan 1", () => {
    it("returns 25 years for all periods", () => {
      expect(getForgivenessPlanForYear(2000, "plan1")).toBe(25);
      expect(getForgivenessPlanForYear(2010, "plan1")).toBe(25);
      expect(getForgivenessPlanForYear(2020, "plan1")).toBe(25);
    });
  });

  describe("Plan 2", () => {
    it("returns 30 years for 2011+ courses", () => {
      expect(getForgivenessPlanForYear(2011, "plan2")).toBe(30);
      expect(getForgivenessPlanForYear(2020, "plan2")).toBe(30);
      expect(getForgivenessPlanForYear(2025, "plan2")).toBe(30);
    });
  });

  describe("Plan 4", () => {
    it("returns 30 years for all periods", () => {
      expect(getForgivenessPlanForYear(2000, "plan4")).toBe(30);
      expect(getForgivenessPlanForYear(2010, "plan4")).toBe(30);
      expect(getForgivenessPlanForYear(2020, "plan4")).toBe(30);
    });
  });

  describe("Plan 5", () => {
    it("returns 40 years for 2023+ courses", () => {
      expect(getForgivenessPlanForYear(2023, "plan5")).toBe(40);
      expect(getForgivenessPlanForYear(2024, "plan5")).toBe(40);
      expect(getForgivenessPlanForYear(2025, "plan5")).toBe(40);
    });
  });

  describe("Postgrad", () => {
    it("returns 30 years", () => {
      expect(getForgivenessPlanForYear(2016, "postgrad")).toBe(30);
      expect(getForgivenessPlanForYear(2025, "postgrad")).toBe(30);
    });
  });

  it("throws error for invalid plan", () => {
    expect(() => {
      getForgivenessPlanForYear(2020, "invalid" as any);
    }).toThrow("No forgiveness data found for plan: invalid");
  });

  it("uses fallback for years predating all rules", () => {
    // If somehow a year before 1998 is passed
    expect(getForgivenessPlanForYear(1990, "plan1")).toBe(25);
  });
});
