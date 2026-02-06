import { IncomeProjectionSection } from "../../sections/IncomeProjectionSection/IncomeProjectionSection";
import type { LoanPlan } from "../../shared/types";
import { LoanDetailsSection } from "../../sections/LoanDetailsSection/LoanDetailsSection";
import { RepaymentResultsSplashSection } from "../../sections/RepaymentResultsSplashSection/RepaymentResultsSplashSection";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";
import { STAGES } from "../../shared/constants/stages";
import { BorderWrappers } from "./components/BorderWrappers";
import { PageHeader } from "./components/PageHeader";

export const LoanCalculatorFlow = () => {
  const { stage, loanFormValues } = useLoanCalculatorStore();

  let undergradEndYear = 2018;
  let undergradStartYear = 2015;
  if (loanFormValues) {
    undergradEndYear =
      loanFormValues.courseStartYear + loanFormValues.courseLength;
    undergradStartYear = loanFormValues.courseStartYear;
  }

  const showBottomBorder = stage >= STAGES.repaymentResultsSplash;

  return (
    <BorderWrappers showBottomBorder={showBottomBorder}>
      <div className="w-full md:max-w-2/3 xl:max-w-1/3">
        <PageHeader />

        {stage >= STAGES.loanDetails && <LoanDetailsSection />}

        {stage >= STAGES.incomeProjection && (
          <IncomeProjectionSection
            undergradStartYear={undergradStartYear}
            undergradEndYear={undergradEndYear}
            repaymentPlan={(loanFormValues?.loanPlan as LoanPlan) || "plan1"}
          />
        )}

        {stage >= STAGES.repaymentResultsSplash && (
          <RepaymentResultsSplashSection />
        )}
      </div>
    </BorderWrappers>
  );
};
