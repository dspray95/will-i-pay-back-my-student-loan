import { IncomeTimeline } from "./components/IncomeTimeline";
import { AssumptionsPanel } from "./components/AssumptionsPanel";
import type { LoanPlan } from "../../shared/types";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";
import { STAGES } from "../../shared/constants/stages";
import { Font } from "../../shared/components/Text";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { RadioButtonSet } from "../../shared/components/RadioButtonSet";
import { ResultsButton } from "../../shared/components/ResultsButton";

export const IncomeProjectionSection: React.FC<{
  undergradStartYear: number;
  undergradEndYear: number;
  repaymentPlan: LoanPlan;
  setShowVoluntaryRepayments: Dispatch<SetStateAction<boolean>>;
}> = ({
  undergradStartYear,
  undergradEndYear,
  repaymentPlan,
  setShowVoluntaryRepayments,
}) => {
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
  const [showVoluntaryRepaymentsValue, setShowVoluntaryRepaymentsValue] =
    useState<string | undefined>(undefined);
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
          choose how to estimate your future income.
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
        <div className="flex flex-col gap-6 pb-12">
          <Font.H2>
            ARE YOU PLANNING ON MAKING ANY VOLUNTARY REPAYMENTS?
          </Font.H2>
          <div className="w-full md:w-3/5 lg:w-2/5">
            <RadioButtonSet
              options={[
                { value: "yes", label: "YES" },
                { value: "no", label: "NO" },
              ]}
              value={showVoluntaryRepaymentsValue}
              onChange={(value) => {
                if (value === "yes") {
                  setShowVoluntaryRepayments(true);
                  setStage(STAGES.voluntaryRepatments);
                } else {
                  setShowVoluntaryRepayments(false);
                }
                setShowVoluntaryRepaymentsValue(value);
              }}
              className="gap-12"
            />
          </div>
        </div>
      )}
      {showVoluntaryRepaymentsValue &&
        showVoluntaryRepaymentsValue !== "yes" && (
          <ResultsButton onClick={handleResultsClick} />
        )}
    </div>
  );
};
