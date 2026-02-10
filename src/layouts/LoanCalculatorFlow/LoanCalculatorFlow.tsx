import { IncomeProjectionSection } from "../../sections/IncomeProjectionSection/IncomeProjectionSection";
import type { LoanPlan } from "../../shared/types";
import { LoanDetailsSection } from "../../sections/LoanDetailsSection/LoanDetailsSection";
import { RepaymentResultsSplashSection } from "../../sections/RepaymentResultsSplashSection/RepaymentResultsSplashSection";
import { RepaymentBreakdownSection } from "../../sections/RepaymentBreakdownSection/RepaymentBreakdownSection";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";
import { STAGES } from "../../shared/constants/stages";
import { BorderWrappers } from "./components/BorderWrappers";
import { PageHeader } from "./components/PageHeader";
import { ScrollOnReveal } from "./components/ScrollOnReveal";

export const LoanCalculatorFlow = () => {
  const { stage, loanFormValues } = useLoanCalculatorStore();

  let undergradStartYear = 2015;
  let undergradEndYear = 2018;

  if (loanFormValues) {
    undergradEndYear =
      loanFormValues.courseStartYear + loanFormValues.courseLength;
    undergradStartYear = loanFormValues.courseStartYear;
  }

  const showBottomBorder = stage >= STAGES.repaymentBreakdown;

  return (
    <BorderWrappers showBottomBorder={showBottomBorder}>
      <div className="w-full md:max-w-2/3 xl:max-w-1/3">
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

        {stage >= STAGES.repaymentResultsSplash && (
          <div id="repayment-breakdown">
            <RepaymentBreakdownSection />
          </div>
        )}
      </div>
    </BorderWrappers>
  );
};
