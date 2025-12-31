import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useState } from "react";
import { Button } from "../../shared/components/Button";
import { IncomeTimeline } from "./components/IncomeTimeline";
import type { LoanPlan } from "../../shared/types";
import { getForgivenessPlanForYear } from "../../domain/loan/forgiveness";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";

export const IncomeProjectionSection: React.FC<{
  undergradStartYear: number;
  undergradEndYear: number;
  repaymentPlan: LoanPlan;
  isActive: boolean;
}> = ({ undergradStartYear, undergradEndYear, isActive, repaymentPlan }) => {
  const {
    incomeByYear,
    setIncomeByYear,
    setStage,
    loanFormValues,
    calculateRepaymentWithIncome,
  } = useLoanCalculatorStore();

  const [userSetYears, setUserSetYears] = useState<Record<number, boolean>>({});

  const loanForgivenessYear =
    undergradEndYear +
    getForgivenessPlanForYear(undergradStartYear, repaymentPlan) +
    1;

  const handleIncomeChange = (year: number, value: number) => {
    setUserSetYears((prev) => ({ ...prev, [year]: true }));

    // Create the updated income object
    const updatedIncome = { ...incomeByYear };
    updatedIncome[year] = value;

    // Update future years if the new value is higher than their current value
    for (let y = year + 1; y <= loanForgivenessYear; y++) {
      if (!updatedIncome[y] || !userSetYears[y]) {
        updatedIncome[y] = value;
      }
    }

    // Pass the final object to Zustand
    setIncomeByYear(updatedIncome);
  };

  return (
    <div
      className={classNames(
        "flex flex-col items-center justify-center transform transition-all ease-in-out overflow-hidden",
        {
          " translate-x-0 pointer-events-auto duration-300": isActive,
          "translate-x-full pointer-events-none duration-200 h-dvh": !isActive,
        }
      )}
    >
      <div className="relative w-full flex items-center justify-center mb-4">
        <Button
          className="absolute top-2 left-0"
          onClick={() => setStage("loanForm")}
        >
          back <FontAwesomeIcon icon={faArrowLeft} />
        </Button>

        <h1>income</h1>
      </div>
      <div className="w-full md:max-w-4/5 mx-3">
        <IncomeTimeline
          incomeByYear={incomeByYear}
          handleIncomeChange={handleIncomeChange}
          undergradStartYear={undergradStartYear}
          undergradEndYear={undergradEndYear}
          repaymentPlan={repaymentPlan}
        />
      </div>
      <Button
        type="submit"
        onClick={() => {
          if (loanFormValues)
            calculateRepaymentWithIncome(incomeByYear, loanFormValues);
          setStage("finish");
        }}
      >
        results <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </div>
  );
};
