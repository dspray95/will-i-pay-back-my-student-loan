import { RepaymentPlot } from "../RepaymentResultsSplashSection/components/RepaymentPlot";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";

export const RepaymentBreakdownSection: React.FC = () => {
  const {
    undergraduateRepaymentPlan,
    loanFormValues,
  } = useLoanCalculatorStore();

  if (!undergraduateRepaymentPlan || !loanFormValues) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 items-center justify-center py-12">
      <div className="w-full md:max-w-4/5">
        <RepaymentPlot
          undergraduateRepaymentBreakdown={
            undergraduateRepaymentPlan.yearByYearBreakdown
          }
          courseLength={loanFormValues.courseLength}
        />
      </div>
    </div>
  );
};