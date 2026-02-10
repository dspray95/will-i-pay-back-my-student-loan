import { RepaymentPlot } from "../RepaymentResultsSplashSection/components/RepaymentPlot";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";

export const RepaymentBreakdownSection: React.FC = () => {
  const {
    undergraduateRepaymentPlan,
    postgraduateRepaymentPlan,
    loanFormValues,
  } = useLoanCalculatorStore();

  if (!undergraduateRepaymentPlan || !loanFormValues) {
    return null;
  }

  const hasPostgrad =
    postgraduateRepaymentPlan &&
    postgraduateRepaymentPlan.yearByYearBreakdown.length > 0;

  return (
    <div className="flex flex-col gap-2 items-center justify-center py-12">
      <div className="w-full md:max-w-4/5">
        <RepaymentPlot
          repaymentBreakdown={
            undergraduateRepaymentPlan.yearByYearBreakdown
          }
          courseLength={loanFormValues.courseLength}
          title="Undergraduate Repayments"
        />
      </div>
      {hasPostgrad && loanFormValues.mastersLength && (
        <div className="w-full md:max-w-4/5">
          <RepaymentPlot
            repaymentBreakdown={
              postgraduateRepaymentPlan.yearByYearBreakdown
            }
            courseLength={loanFormValues.mastersLength}
            title="Postgraduate Repayments"
          />
        </div>
      )}
    </div>
  );
};
