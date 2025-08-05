import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useState } from "react";
import { IncomeTimeline } from "../components/income/IncomeTimeline";
import { getForgivenessPlanForYear, type LoanPlan } from "../data";
import { Button } from "../components/button";

export const IncomePage: React.FC<{
  undergradStartYear: number;
  undergradEndYear: number;
  repaymentPlan: LoanPlan;
  isActive: boolean;
  setStage: (stage: "loanForm" | "income" | "finish") => void;
}> = ({
  undergradStartYear,
  undergradEndYear,
  isActive,
  repaymentPlan,
  setStage,
}) => {
  const [incomeByYear, setIncomeByYear] = useState<Record<number, number>>({});
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
        "absolute top-0 left-1/2 -translate-x-1/2 w-1/3 pt-26",
        "h-max- mx-2 flex items-center justify-center flex-col",
        "transition-all duration-300 ease-in-out overflow-hidden",
        {
          "transform 2 -translate-x-1/2": isActive,
          "transform translate-x-[150%]": !isActive,
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
      <div className="w-full ml-3">
        <IncomeTimeline
          incomeByYear={incomeByYear}
          handleIncomeChange={handleIncomeChange}
          undergradStartYear={undergradStartYear}
          undergradEndYear={undergradEndYear}
          repaymentPlan={repaymentPlan}
        />
      </div>
      <Button type="submit" onClick={() => setStage("finish")}>
        results <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </div>
  );
};
