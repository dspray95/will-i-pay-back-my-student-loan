import { IncomeProjectionSection } from "../../sections/IncomeProjectionSection/IncomeProjectionSection";
import type { LoanPlan } from "../../shared/types";
import { LoanDetailsSection } from "../../sections/LoanDetailsSection/LoanDetailsSection";
import { RepaymentResultsSplashSection } from "../../sections/RepaymentResultsSplashSection/RepaymentResultsSplashSection";
import { RepaymentBreakdownSection } from "../../sections/RepaymentBreakdownSection/RepaymentBreakdownSection";
import { MethodologySection } from "../../sections/MethodologySection/MethodologySection";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";
import { STAGES } from "../../shared/constants/stages";
import { BorderWrappers } from "./components/BorderWrappers";
import { ScrollOnReveal } from "./components/ScrollOnReveal";
import { PageHeader } from "../../shared/components/PageHeader";

export const LoanCalculatorFlow = () => {
  const { stage, resetCount, loanFormValues } = useLoanCalculatorStore();

  let undergradStartYear = 2015;
  let undergradEndYear = 2018;

  if (loanFormValues) {
    undergradEndYear =
      loanFormValues.courseStartYear + loanFormValues.courseLength;
    undergradStartYear = loanFormValues.courseStartYear;
  }

  const showBottomBorder = stage >= STAGES.repaymentResultsSplash;

  return (
    <BorderWrappers key={resetCount} showBottomBorder={showBottomBorder}>
      <div className="w-full md:max-w-2/3 xl:max-w-3/5">
        <PageHeader />

        {stage >= STAGES.loanDetails && <LoanDetailsSection />}

        {stage >= STAGES.incomeProjection && (
          <ScrollOnReveal>
            <IncomeProjectionSection
              undergradStartYear={undergradStartYear}
              undergradEndYear={undergradEndYear}
              repaymentPlan={(loanFormValues?.loanPlan as LoanPlan) || "plan1"}
            />
          </ScrollOnReveal>
        )}

        {stage >= STAGES.repaymentResultsSplash && (
          <ScrollOnReveal>
            <RepaymentResultsSplashSection />
          </ScrollOnReveal>
        )}
      </div>
      {stage >= STAGES.repaymentResultsSplash && (
        <div className="w-full md:max-w-4/5" id="repayment-breakdown">
          <RepaymentBreakdownSection />
        </div>
      )}
      {stage >= STAGES.repaymentResultsSplash && (
        <div className="w-full mt-20">
          <MethodologySection />
        </div>
      )}
    </BorderWrappers>
  );
};
