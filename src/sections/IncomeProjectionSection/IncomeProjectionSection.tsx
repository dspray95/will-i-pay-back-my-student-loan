import { faArrowDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "../../shared/components/Button";
import { IncomeTimeline } from "./components/IncomeTimeline";
import type { LoanPlan } from "../../shared/types";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";
import { STAGES } from "../../shared/constants/stages";
import { Font } from "../../shared/components/Text";

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

  return (
    <div className="flex flex-col gap-2 items-center justify-center py-12 bg-pink-500">
      <div className="relative w-full flex flex-col items-center justify-center mb-4 text-center">
        <Font.H1>INCOME</Font.H1>
        <Font.Body>
          Explainer on how setting income works and why we need it. Add
          something about children ( i.e. falls below the threshold ) consider
          that.
        </Font.Body>
      </div>
      <div className="w-full md:max-w-4/5 mx-3">
        <IncomeTimeline
          undergradStartYear={undergradStartYear}
          undergradEndYear={undergradEndYear}
          repaymentPlan={repaymentPlan}
        />
      </div>
      =
      <Button
        className="w-full"
        type="submit"
        onClick={() => {
          if (loanFormValues)
            calculateRepaymentWithIncome(incomeByYear, loanFormValues);
          setStage(STAGES.repaymentResultsSplash);
        }}
      >
        <Font.Body className="text-beck-beige text-2xl pt-1 pl-2">
          RESULTS
        </Font.Body>
        <FontAwesomeIcon className="text-base" icon={faArrowDown} />
      </Button>
    </div>
  );
};
