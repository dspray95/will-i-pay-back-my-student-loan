import { RepaymentPlot } from "./RepaymentPlot";
import { useLoanCalculatorStore } from "../../../../stores/loanCalculatorStore";
import {
  useIsMobile,
  useIsTablet,
} from "../../../../shared/hooks/useIsMobile";
import type { VoluntaryRepayment } from "../../../../stores/slices/voluntaryRepaymentsSlice";

/**
 * Sum voluntary repayment amounts by academic year (Sep–Aug).
 */
const sumRepaymentsByAcademicYear = (
  repayments: VoluntaryRepayment[],
): Map<number, number> => {
  const byYear = new Map<number, number>();
  for (const vr of repayments) {
    const d = new Date(vr.date);
    const month = d.getMonth();
    // Academic year starts in September
    const academicYear = month >= 8 ? d.getFullYear() : d.getFullYear() - 1;
    byYear.set(academicYear, (byYear.get(academicYear) ?? 0) + vr.amount);
  }
  return byYear;
};

export const RepaymentPlots: React.FC = () => {
  const {
    undergraduateRepaymentPlan: baseUndergraduatePlan,
    postgraduateRepaymentPlan: basePostgraduatePlan,
    undergraduateRepaymentPlanWithVoluntaryRepayments,
    postgraduateRepaymentPlanWithVoluntaryRepayments,
    undergraduateStudyYearBalances,
    postgraduateStudyYearBalances,
    voluntaryRepayments,
    loanFormValues,
  } = useLoanCalculatorStore();

  const undergraduateRepaymentPlan =
    undergraduateRepaymentPlanWithVoluntaryRepayments ?? baseUndergraduatePlan;
  const postgraduateRepaymentPlan =
    postgraduateRepaymentPlanWithVoluntaryRepayments ?? basePostgraduatePlan;

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

  const undergradVoluntaryByYear = sumRepaymentsByAcademicYear(
    voluntaryRepayments.filter(
      (vr) => vr.type === "undergraduate" || vr.type === undefined,
    ),
  );
  const postgradVoluntaryByYear = sumRepaymentsByAcademicYear(
    voluntaryRepayments.filter((vr) => vr.type === "postgraduate"),
  );

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
          studyYearRepayments={undergradVoluntaryByYear}
          title="Undergraduate Repayments"
          yDomain={hasPostgrad ? sharedYDomain : undefined}
          compact={!!hasPostgrad}
          containerHeight={containerHeight}
          alternateBreakdown={
            undergraduateRepaymentPlanWithVoluntaryRepayments
              ? baseUndergraduatePlan?.yearByYearBreakdown
              : undefined
          }
        />
      </div>
      {hasPostgrad && loanFormValues.mastersLength && (
        <div className="w-full">
          <RepaymentPlot
            repaymentBreakdown={postgraduateRepaymentPlan.yearByYearBreakdown}
            courseLength={loanFormValues.mastersLength}
            studyYearBalances={postgraduateStudyYearBalances}
            studyYearRepayments={postgradVoluntaryByYear}
            title="Postgraduate Repayments"
            yDomain={sharedYDomain}
            compact
            containerHeight={containerHeight}
            alternateBreakdown={
              postgraduateRepaymentPlanWithVoluntaryRepayments
                ? basePostgraduatePlan?.yearByYearBreakdown
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
};
