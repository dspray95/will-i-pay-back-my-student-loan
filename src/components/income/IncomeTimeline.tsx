import { useMemo, type JSX } from "react";
import { IncomeSlider } from "./Slider";
import { getForgivenessPlanForYear, type LoanPlan } from "../../data";
import { Button } from "../button";

export const IncomeTimeline: React.FC<{
  incomeByYear: Record<number, number>;
  handleIncomeChange: (year: number, value: number) => void;
  undergradStartYear: number;
  undergradEndYear: number;
  repaymentPlan: LoanPlan;
}> = ({
  incomeByYear,
  handleIncomeChange,
  undergradStartYear,
  undergradEndYear,
  repaymentPlan,
}) => {
  const sliders = useMemo<JSX.Element[]>(() => {
    const forgivenessPlan = getForgivenessPlanForYear(
      undergradStartYear,
      repaymentPlan
    );

    // Repayments start the april after graduation
    const repaymentStartYear = undergradEndYear + 1;
    const loanForgivenessYear = repaymentStartYear + forgivenessPlan;

    const currentYear = new Date().getFullYear();
    const sliders: JSX.Element[] = [];
    sliders.push(
      <div className="flex flex-row items-center justify-center gap-2 w-full text-text-muted">
        <div className="flex-grow border-b border-text-muted min-w-24 border-dashed" />
        <div className="text-sm">
          Repayment starts the april after graduation
        </div>
        <div className="flex-grow border-b border-text-muted  min-w-24 border-dashed" />
      </div>
    );
    for (let year = repaymentStartYear; year <= loanForgivenessYear; year++) {
      sliders.push(
        <IncomeSlider
          key={year}
          year={year}
          value={incomeByYear[year] || 0}
          onChange={handleIncomeChange}
        />
      );
      if (year === currentYear) {
        sliders.push(
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-center gap-2 w-full text-text-muted">
              <div className="flex-grow border-b border-text-muted min-w-24 border-dashed" />
              <Button variant="no-bg">
                {"set future income based on inflation"}
              </Button>
              <div className="flex-grow border-b border-text-muted  min-w-24 border-dashed" />
            </div>
          </div>
        );
      }
      if (year === loanForgivenessYear) {
        sliders.push(
          <div className="flex flex-row items-center justify-center gap-2 w-full text-text-muted">
            <div className="flex-grow border-b border-text-muted min-w-24 border-dashed" />
            <div className="text-sm">loan written off</div>
            <div className="flex-grow border-b border-text-muted  min-w-24 border-dashed" />
          </div>
        );
      }
    }
    return sliders;
  }, [
    incomeByYear,
    handleIncomeChange,
    undergradEndYear,
    undergradStartYear,
    repaymentPlan,
  ]);

  return <div className="pb-4">{sliders}</div>;
};
