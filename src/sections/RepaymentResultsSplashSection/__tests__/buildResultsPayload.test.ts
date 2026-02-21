import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { buildResultsPayload } from "../hooks/useSubmitResults";
import type { CalculationResults } from "../types";
import type { LoanFormValues } from "../../../shared/schemas/LoanFormSchema";

const makeCalculationResults = (
  overrides: Partial<CalculationResults> = {},
): CalculationResults => ({
  willRepayUndergraduateLoan: false,
  willRepayPostgraduateLoan: false,
  totalUndergraduateDebtPaid: 25000,
  totalPostgraduateDebtPaid: 8000,
  undergraduateAmountForgiven: 12000,
  postgraduateAmountForgiven: 3000,
  totalUndergraduateInterestAccrued: 15000,
  totalPostgraduateInterestAccrued: 4000,
  undergraduateRepayments: [5000, 5000],
  postgraduateRepayments: [4000, 4000],
  totalUndergraduateLoanAmount: 40000,
  totalPostgraduateLoanAmount: 12000,
  ...overrides,
});

const makeLoanFormValues = (
  overrides: Partial<LoanFormValues> = {},
): LoanFormValues => ({
  loanPlan: "plan2",
  courseStartYear: 2020,
  courseLength: 3,
  country: "england",
  tutionFeeLoan: 9250,
  mastersTutionFeeLoan: 0,
  maintenanceLoan: 5000,
  maintenanceGrant: 0,
  postgrad: "no",
  ...overrides,
});

describe("buildResultsPayload", () => {
  it("builds a valid payload with correct structure", () => {
    const payload = buildResultsPayload(
      makeCalculationResults(),
      makeLoanFormValues(),
      3.5,
      2.0,
      "auto",
      false,
    );

    expect(payload).toEqual({
      results: {
        undergraduate: {
          willRepay: false,
          totalPaid: 25000,
          amountForgiven: 12000,
          interestAccrued: 15000,
        },
        postgraduate: {
          willRepay: false,
          totalPaid: 8000,
          amountForgiven: 3000,
          interestAccrued: 4000,
        },
      },
      config: {
        loanPlan: "plan2",
        courseStartYear: 2020,
        courseLength: 3,
        salaryGrowthRate: 3.5,
        projectedInflationRate: 2.0,
        futureIncomeMode: "auto",
        hasPostgradLoan: false,
      },
    });
  });

  it("maps willRepay correctly when loans are repaid", () => {
    const payload = buildResultsPayload(
      makeCalculationResults({
        willRepayUndergraduateLoan: true,
        willRepayPostgraduateLoan: true,
      }),
      makeLoanFormValues(),
      3.5,
      2.0,
      "manual",
      true,
    );

    expect(payload.results.undergraduate.willRepay).toBe(true);
    expect(payload.results.postgraduate.willRepay).toBe(true);
    expect(payload.config.futureIncomeMode).toBe("manual");
    expect(payload.config.hasPostgradLoan).toBe(true);
  });

  it("throws ZodError for invalid futureIncomeMode", () => {
    expect(() =>
      buildResultsPayload(
        makeCalculationResults(),
        makeLoanFormValues(),
        3.5,
        2.0,
        "invalid" as string,
        false,
      ),
    ).toThrow(ZodError);
  });

  it("throws ZodError when numeric fields are strings", () => {
    expect(() =>
      buildResultsPayload(
        makeCalculationResults({
          totalUndergraduateDebtPaid: "not a number" as unknown as number,
        }),
        makeLoanFormValues(),
        3.5,
        2.0,
        "auto",
        false,
      ),
    ).toThrow(ZodError);
  });
});
