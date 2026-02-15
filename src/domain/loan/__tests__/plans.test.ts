import { describe, it, expect } from "vitest";
import { getLoanPlan, getInterestRateDuringStudy, LOAN_PLANS } from "../plans";

describe("LOAN_PLANS", () => {
  it("has correct structure for all plans", () => {
    expect(LOAN_PLANS.plan1).toEqual({
      id: "plan1",
      label: "Plan 1 (England + Wales pre-2012)",
    });
    expect(LOAN_PLANS.plan5).toEqual({
      id: "plan5",
      label: "Plan 5 (England 2023+)",
    });
  });
});

describe("getLoanPlan", () => {
  describe("England", () => {
    it("returns Plan 1 for pre-2012 courses", () => {
      expect(getLoanPlan(2000, "ENGLAND")).toBe("plan1");
      expect(getLoanPlan(2011, "ENGLAND")).toBe("plan1");
    });

    it("returns Plan 2 for 2012-2022 courses", () => {
      expect(getLoanPlan(2012, "ENGLAND")).toBe("plan2");
      expect(getLoanPlan(2020, "ENGLAND")).toBe("plan2");
      expect(getLoanPlan(2022, "ENGLAND")).toBe("plan2");
    });

    it("returns Plan 5 for 2023+ courses", () => {
      expect(getLoanPlan(2023, "ENGLAND")).toBe("plan5");
      expect(getLoanPlan(2025, "ENGLAND")).toBe("plan5");
    });
  });

  describe("Wales", () => {
    it("returns Plan 1 for pre-2012 courses", () => {
      expect(getLoanPlan(2010, "WALES")).toBe("plan1");
    });

    it("returns Plan 2 for 2012+ courses", () => {
      expect(getLoanPlan(2012, "WALES")).toBe("plan2");
      expect(getLoanPlan(2023, "WALES")).toBe("plan2");
      expect(getLoanPlan(2025, "WALES")).toBe("plan2");
    });
  });

  describe("Northern Ireland", () => {
    it("returns Plan 1 NI for all years", () => {
      expect(getLoanPlan(2000, "NORTHERN_IRELAND")).toBe("plan1NI");
      expect(getLoanPlan(2015, "NORTHERN_IRELAND")).toBe("plan1NI");
      expect(getLoanPlan(2025, "NORTHERN_IRELAND")).toBe("plan1NI");
    });
  });

  describe("Scotland", () => {
    it("returns Plan 4 for all years", () => {
      expect(getLoanPlan(2000, "SCOTLAND")).toBe("plan4");
      expect(getLoanPlan(2015, "SCOTLAND")).toBe("plan4");
      expect(getLoanPlan(2025, "SCOTLAND")).toBe("plan4");
    });
  });

  describe("Unknown country", () => {
    it("returns empty string for unknown country", () => {
      expect(getLoanPlan(2020, "UNKNOWN")).toBe("");
      expect(getLoanPlan(2020, "IRELAND")).toBe("");
    });
  });
});

describe("getInterestRateDuringStudy", () => {
  it("returns correct rates for known years", () => {
    expect(getInterestRateDuringStudy(2025, "plan2")).toBe(6.2);
    expect(getInterestRateDuringStudy(2024, "plan1")).toBe(4.3);
    expect(getInterestRateDuringStudy(2023, "plan5")).toBe(4.7);
  });

  it("returns RPI rate for Plan 5 during study", () => {
    expect(getInterestRateDuringStudy(2023, "plan5")).toBe(4.7);
    expect(getInterestRateDuringStudy(2024, "plan5")).toBe(4.3);
    expect(getInterestRateDuringStudy(2025, "plan5")).toBe(3.2);
  });

  it("falls back to earliest rate for years predating data", () => {
    // 1998 is earliest year for plan1
    expect(getInterestRateDuringStudy(1995, "plan1")).toBe(5.0);
  });

  it("uses most recent applicable rate for given year", () => {
    // 2020 should use 2020 rate, not 2019
    expect(getInterestRateDuringStudy(2020, "plan2")).toBe(5.6);
    expect(getInterestRateDuringStudy(2019, "plan2")).toBe(5.4);
  });

  it("throws error for invalid plan", () => {
    expect(() => {
      getInterestRateDuringStudy(2020, "invalid" as any);
    }).toThrow("No interest rate data for plan: invalid");
  });
});
