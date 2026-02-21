import { z } from "zod";

const LoanResultSchema = z.object({
  willRepay: z.boolean(),
  totalPaid: z.number(),
  amountForgiven: z.number(),
  interestAccrued: z.number(),
});

export const ResultsSubmissionSchema = z.object({
  results: z.object({
    undergraduate: LoanResultSchema,
    postgraduate: LoanResultSchema,
  }),
  config: z.object({
    loanPlan: z.string(),
    courseStartYear: z.number(),
    courseLength: z.number(),
    salaryGrowthRate: z.number(),
    projectedInflationRate: z.number(),
    futureIncomeMode: z.enum(["auto", "manual"]),
    hasPostgradLoan: z.boolean(),
  }),
});

export type ResultsSubmission = z.infer<typeof ResultsSubmissionSchema>;
