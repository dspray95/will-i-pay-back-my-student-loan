import { IncomeProjectionSection } from "../../sections/IncomeProjectionSection/IncomeProjectionSection";
import { Carousel } from "../../shared/components/Carousel";
import type { LoanPlan } from "../../shared/types";
import { LoanDetailsSection } from "../../sections/LoanDetailsSection/LoanDetailsSection";
import { RepaymentResultsSplashSection } from "../../sections/RepaymentResultsSplashSection/RepaymentResultsSplashSection";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";

const STAGES = ["loanForm", "income", "finish"] as const;

export const LoanCalculatorFlow = () => {
  const { stage, loanFormValues } = useLoanCalculatorStore();

  const currentStepIndex = STAGES.indexOf(stage);

  let undergradEndYear = 2018;
  let undergradStartYear = 2015;
  if (loanFormValues) {
    undergradEndYear =
      loanFormValues.courseStartYear + loanFormValues.courseLength;
    undergradStartYear = loanFormValues.courseStartYear;
  }

  return (
    <Carousel currentStepIndex={currentStepIndex}>
      {stage === "loanForm" && <LoanDetailsSection isActive={true} />}

      {stage === "income" && (
        <IncomeProjectionSection
          undergradStartYear={undergradStartYear}
          undergradEndYear={undergradEndYear}
          isActive={true}
          repaymentPlan={(loanFormValues?.loanPlan as LoanPlan) || "plan1"}
        />
      )}

      {stage === "finish" && <RepaymentResultsSplashSection />}
    </Carousel>
  );
};
