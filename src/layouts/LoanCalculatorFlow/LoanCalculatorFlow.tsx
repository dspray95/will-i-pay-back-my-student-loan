import { IncomeProjectionSection } from "../../sections/IncomeProjectionSection/IncomeProjectionSection";
import type { LoanPlan } from "../../shared/types";
import { LoanDetailsSection } from "../../sections/LoanDetailsSection/LoanDetailsSection";
import { RepaymentResultsSplashSection } from "../../sections/RepaymentResultsSplashSection/RepaymentResultsSplashSection";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";
import { STAGES } from "../../shared/constants/stages";
import { useState } from "react";
import clsx from "clsx";
import { BorderWrappers } from "./components/BorderWrappers";

export const LoanCalculatorFlow = () => {
  const { stage, loanFormValues } = useLoanCalculatorStore();
  // Local state
  const [showBottomBorder, setShowBottomBorder] = useState(false);

  let undergradEndYear = 2018;
  let undergradStartYear = 2015;
  if (loanFormValues) {
    undergradEndYear =
      loanFormValues.courseStartYear + loanFormValues.courseLength;
    undergradStartYear = loanFormValues.courseStartYear;
  }

  if (stage >= STAGES.repaymentResultsSplash) setShowBottomBorder(true);

  return (
    <BorderWrappers showBottomBorder={showBottomBorder}>
      <div className="w-full md:max-w-1/3">
        {stage >= STAGES.loanDetails && <LoanDetailsSection isActive={true} />}

        {stage >= STAGES.incomeProjection && (
          <IncomeProjectionSection
            undergradStartYear={undergradStartYear}
            undergradEndYear={undergradEndYear}
            isActive={true}
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
