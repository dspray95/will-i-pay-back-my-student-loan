import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "../../shared/components/Button";
import { IncomeTimeline } from "./components/IncomeTimeline";
import type { LoanPlan } from "../../shared/types";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";
import { STAGES } from "../../shared/constants/stages";
import { Font } from "../../shared/components/Text";
import { useState } from "react";

export const IncomeProjectionSection: React.FC<{
  undergradStartYear: number;
  undergradEndYear: number;
  repaymentPlan: LoanPlan;
}> = ({ undergradStartYear, undergradEndYear, repaymentPlan }) => {
  const {
    incomeByYear,
    setStage,
    loanFormValues,
    calculateRepaymentWithIncome,
  } = useLoanCalculatorStore();

  const [futureIncomeMode, setFutureIncomeMode] = useState<"auto" | "manual" | undefined>();

  const handleResultsClick = () => {
    if (!loanFormValues) return;
    calculateRepaymentWithIncome(incomeByYear, loanFormValues);
    setStage(STAGES.repaymentResultsSplash);
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center py-12">
      <div className="relative w-full flex flex-col items-center justify-center mb-4 text-center">
        <Font.H1>INCOME</Font.H1>
        <Font.Body small>
          Set your income from graduation to now using the sliders below. Then choose how to estimate your future income — either set it manually year-by-year, or let us calculate it automatically based on 3% annual inflation.
        </Font.Body>
      </div>
      <div className="w-full md:max-w-4/5 mx-3">
        <IncomeTimeline
          undergradStartYear={undergradStartYear}
          undergradEndYear={undergradEndYear}
          repaymentPlan={repaymentPlan}
          onFutureIncomeModeChange={setFutureIncomeMode}
        />
      </div>
      {futureIncomeMode && (
        <Button
          className="w-full"
          type="submit"
          onClick={handleResultsClick}
        >
          <Font.Body className="text-beck-beige text-2xl pt-1 pl-2">
            RESULTS
          </Font.Body>
          <FontAwesomeIcon className="text-base" icon={faArrowDown} />
        </Button>
      )}
    </div>
  );
};
