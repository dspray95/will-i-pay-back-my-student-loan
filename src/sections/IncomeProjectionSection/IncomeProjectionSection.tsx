import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "../../shared/components/Button";
import { IncomeTimeline } from "./components/IncomeTimeline";
import { AssumptionsPanel } from "./components/AssumptionsPanel";
import type { LoanPlan } from "../../shared/types";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";
import { STAGES } from "../../shared/constants/stages";
import { Font } from "../../shared/components/Text";
import { useEffect } from "react";

export const IncomeProjectionSection: React.FC<{
  undergradStartYear: number;
  undergradEndYear: number;
  repaymentPlan: LoanPlan;
}> = ({ undergradStartYear, undergradEndYear, repaymentPlan }) => {
  const {
    stage,
    incomeByYear,
    setStage,
    loanFormValues,
    calculateRepaymentWithIncome,
    futureIncomeMode,
    setFutureIncomeMode,
    salaryGrowthRate,
    projectedInflationRate,
    setSalaryGrowthRate,
    setProjectedInflationRate,
  } = useLoanCalculatorStore();

  // Revert to income projection when income changes after results are showing
  useEffect(() => {
    if (stage < STAGES.repaymentResultsSplash) return;
    setStage(STAGES.incomeProjection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomeByYear]);

  const handleResultsClick = () => {
    if (!loanFormValues) return;
    calculateRepaymentWithIncome(incomeByYear, loanFormValues);
    setStage(STAGES.repaymentResultsSplash);
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center py-12">
      <div className="relative w-full flex flex-col items-center justify-center mb-4 text-center">
        <Font.H1>INCOME</Font.H1>
        <Font.Body className="text-left md:text-center my-2">
          Set your income from graduation to now using the sliders below, then
          choose how to estimate your future income. You can set it manually
          year-by-year, or let us calculate it automatically based on predicted
          salary growth.
        </Font.Body>
        <Font.Subtle className="text-left md:text-center" small>
          Consider if you have any plans to take a career break or parental
          leave, or plan to relocate to a city with different salary
          expectations.
        </Font.Subtle>
      </div>
      <div className="w-full md:max-w-4/5 mx-3">
        <AssumptionsPanel
          salaryGrowthRate={salaryGrowthRate}
          projectedInflationRate={projectedInflationRate}
          onSalaryGrowthRateChange={setSalaryGrowthRate}
          onProjectedInflationRateChange={setProjectedInflationRate}
        />
      </div>
      <div className="w-full md:max-full md:max-w-full mx-3">
        <IncomeTimeline
          undergradStartYear={undergradStartYear}
          undergradEndYear={undergradEndYear}
          repaymentPlan={repaymentPlan}
          salaryGrowthRate={salaryGrowthRate}
          onFutureIncomeModeChange={setFutureIncomeMode}
        />
      </div>
      {futureIncomeMode && (
        <Button className="w-full" type="submit" onClick={handleResultsClick}>
          <Font.Body className="text-beck-beige text-2xl pt-1 pl-2">
            RESULTS
          </Font.Body>
          <FontAwesomeIcon className="text-base" icon={faArrowDown} />
        </Button>
      )}
    </div>
  );
};
