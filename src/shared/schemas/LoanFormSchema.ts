import { z } from "zod";

const optionalNumber = z.union([z.number(), z.literal("")]).optional();

export const LoanFormSchema = z.object({
  courseStartYear: optionalNumber,
  courseLength: optionalNumber,
  country: z.string(),
  loanPlan: z
    .enum(["plan1", "plan1NI", "plan2", "plan4", "plan5", "postgrad", ""])
    .optional(),
  tutionFeeLoan: z.number(),
  mastersTutionFeeLoan: z.number(),
  maintenanceLoan: z.number(),
  maintenanceGrant: z.number(),
  postgrad: z.string().optional(),
  mastersStartYear: optionalNumber,
  mastersLength: optionalNumber,
});

export type LoanFormInput = z.infer<typeof LoanFormSchema>;

export const ValidatedLoanFormSchema = z
  .object({
    courseStartYear: z.number({ error: "Please enter a valid year" }),
    courseLength: z.number({ error: "Please enter a valid course length" }),
    country: z.string().min(1, "Country is required"),
    loanPlan: z.enum(
      ["plan1", "plan1NI", "plan2", "plan4", "plan5", "postgrad"],
      { error: "Please select a loan plan" }
    ),
    tutionFeeLoan: z.number(),
    mastersTutionFeeLoan: z.number(),
    maintenanceLoan: z.number(),
    maintenanceGrant: z.number(),
    postgrad: z.string().min(1, "Please select yes or no"),
    mastersStartYear: optionalNumber,
    mastersLength: optionalNumber,
  })
  .refine(
    (data) => {
      if (data.postgrad === "yes") {
        return typeof data.mastersStartYear === "number";
      }
      return true;
    },
    {
      message: "Masters start year is required",
      path: ["mastersStartYear"],
    }
  )
  .refine(
    (data) => {
      if (data.postgrad === "yes") {
        return typeof data.mastersLength === "number";
      }
      return true;
    },
    {
      message: "Masters length is required",
      path: ["mastersLength"],
    }
  );

export type LoanFormValues = z.infer<typeof ValidatedLoanFormSchema>;
