import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useState, type Dispatch, type SetStateAction } from "react";
import { IncomeTimeline } from "../components/income/IncomeTimeline";
import { getForgivenessPlanForYear, type LoanPlan } from "../data";
import { Button } from "../components/button";
import type { LoanFormValues } from "../components/loan/LoanForm";

export const IncomePage: React.FC<{
  undergradStartYear: number;
  undergradEndYear: number;
  repaymentPlan: LoanPlan;
  isActive: boolean;
  incomeByYear: Record<number, number>;
  setIncomeByYear: Dispatch<SetStateAction<Record<number, number>>>;
  setStage: (stage: "loanForm" | "income" | "finish") => void;
  loanFormValues: LoanFormValues | undefined;
  calculateRepaymentWithIncome: (
    incomeByYear: Record<number, number>,
    loanFormValues: LoanFormValues
  ) => void;
}> = ({
  undergradStartYear,
  undergradEndYear,
  isActive,
  repaymentPlan,
  setStage,
  incomeByYear,
  setIncomeByYear,
  loanFormValues,
  calculateRepaymentWithIncome,
}) => {
  const [userSetYears, setUserSetYears] = useState<Record<number, boolean>>([]);
  const loanForgivenessYear =
    undergradStartYear +
    getForgivenessPlanForYear(undergradStartYear, repaymentPlan);

  const handleIncomeChange = (year: number, value: number) => {
    setUserSetYears((prev) => ({ ...prev, [year]: true }));
    setIncomeByYear((prev) => {
      const updatedIncome = { ...prev };

      // Update the selected year
      updatedIncome[year] = value;

      // Update future years if the new value is higher than their current value
      for (let y = year + 1; y <= loanForgivenessYear; y++) {
        if (!updatedIncome[y] || !userSetYears[y]) {
          updatedIncome[y] = value;
        }
      }

      return updatedIncome;
    });
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
