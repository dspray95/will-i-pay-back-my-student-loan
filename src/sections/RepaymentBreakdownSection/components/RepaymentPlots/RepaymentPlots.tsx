import { RepaymentPlot } from "./RepaymentPlot";
import { useLoanCalculatorStore } from "../../../../stores/loanCalculatorStore";
import {
  useIsMobile,
  useIsTablet,
} from "../../../../shared/hooks/useIsMobile";

export const RepaymentPlots: React.FC = () => {
  const {
    undergraduateRepaymentPlan,
    postgraduateRepaymentPlan,
    undergraduateStudyYearBalances,
    postgraduateStudyYearBalances,
    loanFormValues,
  } = useLoanCalculatorStore();

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (!undergraduateRepaymentPlan || !loanFormValues) {
    return null;
  }

  const hasPostgrad =
    postgraduateRepaymentPlan &&
    postgraduateRepaymentPlan.yearByYearBreakdown.length > 0;

  const containerHeight = isMobile
    ? 300
    : isTablet
      ? hasPostgrad
        ? 300
        : 400
      : hasPostgrad
        ? 400
        : 500;

  const getMaxValue = (
    breakdown: typeof undergraduateRepaymentPlan.yearByYearBreakdown,
    studyBalances?: typeof undergraduateStudyYearBalances,
  ) => {
    const breakdownMax = Math.max(
      ...breakdown.map((e) =>
        Math.max(e.endingBalance, e.startingBalance, e.repayment),
      ),
    );
    const studyMax = studyBalances
      ? Math.max(...studyBalances.map((s) => s.balance))
      : 0;
    return Math.max(breakdownMax, studyMax);
  };

  const undergradMax = getMaxValue(
    undergraduateRepaymentPlan.yearByYearBreakdown,
    undergraduateStudyYearBalances,
  );
  const postgradMax = hasPostgrad
    ? getMaxValue(
        postgraduateRepaymentPlan.yearByYearBreakdown,
        postgraduateStudyYearBalances,
      )
    : 0;

  const sharedYDomain: [number, number] = [
    0,
    Math.ceil(Math.max(undergradMax, postgradMax) / 10_000) * 10_000,
  ];

  return (
    <div className="flex gap-6 items-center justify-center flex-col md:flex-row w-full">
      <div className="w-full">
        <RepaymentPlot
          repaymentBreakdown={undergraduateRepaymentPlan.yearByYearBreakdown}
          courseLength={loanFormValues.courseLength}
          studyYearBalances={undergraduateStudyYearBalances}
          title="Undergraduate Repayments"
          yDomain={hasPostgrad ? sharedYDomain : undefined}
          compact={!!hasPostgrad}
          containerHeight={containerHeight}
        />
      </div>
      {hasPostgrad && loanFormValues.mastersLength && (
        <div className="w-full">
          <RepaymentPlot
            repaymentBreakdown={postgraduateRepaymentPlan.yearByYearBreakdown}
            courseLength={loanFormValues.mastersLength}
            studyYearBalances={postgraduateStudyYearBalances}
            title="Postgraduate Repayments"
            yDomain={sharedYDomain}
            compact
            containerHeight={containerHeight}
          />
        </div>
      )}
    </div>
  );
};
