import { describe, it, expect } from "vitest";
import { formatCurrency } from "./formatCurrency";

describe("formatMoney", () => {
  it("formats whole numbers with two decimal places", () => {
    expect(formatCurrency(1000)).toBe("£1,000.00");
  });

  it("preserves trailing zero in decimals", () => {
    expect(formatCurrency(28600.2)).toBe("£28,600.20");
  });

  it("rounds to two decimal places", () => {
    expect(formatCurrency(1234.567)).toBe("£1,234.57");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("£0.00");
  });

  it("formats large numbers with commas", () => {
    expect(formatCurrency(1234567.89)).toBe("£1,234,567.89");
  });

  it("formats small decimals", () => {
    expect(formatCurrency(0.5)).toBe("£0.50");
  });

  it("abbreviates thousands", () => {
    expect(formatCurrency(100000, { abbreviated: true })).toBe("£100k");
  });

  it("abbreviates and rounds to nearest thousand", () => {
    expect(formatCurrency(28600, { abbreviated: true })).toBe("£29k");
  });

  it("does not abbreviate values below 1000", () => {
    expect(formatCurrency(500, { abbreviated: true })).toBe("£500.00");
  });

  it("abbreviates zero as normal", () => {
    expect(formatCurrency(0, { abbreviated: true })).toBe("£0.00");
  });
});
