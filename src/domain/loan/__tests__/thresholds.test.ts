import { describe, it, expect } from "vitest";
import {
  getRepaymentThreshold,
  getUpperInterestThreshold,
} from "../thresholds";

describe("getRepaymentThreshold", () => {
  it("returns correct threshold for known years", () => {
    expect(getRepaymentThreshold(2025, "plan2")).toBe(28470);
    expect(getRepaymentThreshold(2024, "plan2")).toBe(27295);
    expect(getRepaymentThreshold(2025, "plan5")).toBe(25000);
  });

  it("handles different loan plans correctly", () => {
    expect(getRepaymentThreshold(2025, "plan1")).toBe(26065);
    expect(getRepaymentThreshold(2025, "plan4")).toBe(32745);
    expect(getRepaymentThreshold(2025, "postgrad")).toBe(21000);
  });

  it("falls back to most recent year for future years", () => {
    const future2030 = getRepaymentThreshold(2030, "plan2");
    const latest2026 = getRepaymentThreshold(2026, "plan2");
    expect(future2030).toBe(latest2026);
    expect(future2030).toBe(29385);
  });

  it("handles historical years correctly", () => {
    expect(getRepaymentThreshold(2018, "plan2")).toBe(25000);
    expect(getRepaymentThreshold(2020, "plan1")).toBe(19390);
  });
});

describe("getUpperInterestThreshold", () => {
  it("returns correct upper threshold for Plan 2", () => {
    expect(getUpperInterestThreshold(2025, "plan2")).toBe(51245);
    expect(getUpperInterestThreshold(2024, "plan2")).toBe(53312);
  });

  it("returns correct values for other plans", () => {
    expect(getUpperInterestThreshold(2025, "plan1")).toBe(55608);
    expect(getUpperInterestThreshold(2025, "postgrad")).toBe(21000);
  });

  it("falls back to 2026 data for future years", () => {
    expect(getUpperInterestThreshold(2030, "plan2")).toBe(52885);
  });
});
