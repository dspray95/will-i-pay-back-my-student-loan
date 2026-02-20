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

  it("falls back to most recent year without growth rate", () => {
    const future2030 = getRepaymentThreshold(2030, "plan2");
    const latest2026 = getRepaymentThreshold(2026, "plan2");
    expect(future2030).toBe(latest2026);
    expect(future2030).toBe(29385);
  });

  it("projects forward with growth rate for Plan 2", () => {
    // 2026 Plan 2 threshold: 29385, projected 4 years at 2.5%
    // 29385 * (1.025)^4 = 32,424 (rounded)
    const projected = getRepaymentThreshold(2030, "plan2", 2.5);
    expect(projected).toBe(Math.round(29385 * Math.pow(1.025, 4)));
  });

  it("projects forward with growth rate for Plan 1", () => {
    // 2026 Plan 1 threshold: 26900, projected 4 years at 2.5%
    const projected = getRepaymentThreshold(2030, "plan1", 2.5);
    expect(projected).toBe(Math.round(26900 * Math.pow(1.025, 4)));
  });

  it("keeps Plan 5 threshold frozen even with growth rate", () => {
    expect(getRepaymentThreshold(2030, "plan5", 2.5)).toBe(25000);
    expect(getRepaymentThreshold(2050, "plan5", 3.0)).toBe(25000);
  });

  it("keeps Postgrad threshold frozen even with growth rate", () => {
    expect(getRepaymentThreshold(2030, "postgrad", 2.5)).toBe(21000);
    expect(getRepaymentThreshold(2050, "postgrad", 3.0)).toBe(21000);
  });

  it("does not apply growth for years within the data", () => {
    // 2025 is in the data, so growth rate should be ignored
    expect(getRepaymentThreshold(2025, "plan2", 2.5)).toBe(28470);
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

  it("falls back to most recent year without growth rate", () => {
    expect(getUpperInterestThreshold(2030, "plan2")).toBe(52885);
  });

  it("projects forward with growth rate for Plan 2", () => {
    // 2026 Plan 2 upper threshold: 52885, projected 4 years at 2.5%
    const projected = getUpperInterestThreshold(2030, "plan2", 2.5);
    expect(projected).toBe(Math.round(52885 * Math.pow(1.025, 4)));
  });

  it("keeps Postgrad upper threshold frozen even with growth rate", () => {
    expect(getUpperInterestThreshold(2030, "postgrad", 2.5)).toBe(21000);
  });
});
