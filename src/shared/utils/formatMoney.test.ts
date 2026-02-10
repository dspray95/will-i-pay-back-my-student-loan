import { describe, it, expect } from "vitest";
import { formatMoney } from "./formatMoney";

describe("formatMoney", () => {
  it("formats whole numbers with two decimal places", () => {
    expect(formatMoney(1000)).toBe("£1,000.00");
  });

  it("preserves trailing zero in decimals", () => {
    expect(formatMoney(28600.2)).toBe("£28,600.20");
  });

  it("rounds to two decimal places", () => {
    expect(formatMoney(1234.567)).toBe("£1,234.57");
  });

  it("formats zero", () => {
    expect(formatMoney(0)).toBe("£0.00");
  });

  it("formats large numbers with commas", () => {
    expect(formatMoney(1234567.89)).toBe("£1,234,567.89");
  });

  it("formats small decimals", () => {
    expect(formatMoney(0.5)).toBe("£0.50");
  });
});
