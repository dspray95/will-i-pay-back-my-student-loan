import { useLoanCalculatorStore } from "../../../../stores/loanCalculatorStore";
import { formatCurrency } from "../../../../shared/utils/formatCurrency";
import { StatCard } from "./StatCard";

export const SummaryStats: React.FC = () => {
  const {
    totalUndergradLoan,
    totalMaintenanceLoan,
    totalMastersLoan,
    undergraduateLoanAtGraduation,
    postgraduateLoanAtGraduation,
    undergraduateRepaymentPlan,
    postgraduateRepaymentPlan,
  } = useLoanCalculatorStore();

  if (!undergraduateRepaymentPlan) return null;

  const totalBorrowed =
    totalUndergradLoan + totalMaintenanceLoan + totalMastersLoan;

  const studyInterest =
    undergraduateLoanAtGraduation -
    (totalUndergradLoan + totalMaintenanceLoan) +
    (postgraduateLoanAtGraduation - totalMastersLoan);

  const repaymentInterest =
    undergraduateRepaymentPlan.yearByYearBreakdown.reduce(
      (sum, y) => sum + y.interestAccrued,
      0,
    ) +
    (postgraduateRepaymentPlan?.yearByYearBreakdown.reduce(
      (sum, y) => sum + y.interestAccrued,
      0,
    ) ?? 0);

  const totalInterest = studyInterest + repaymentInterest;

  const totalRepaid =
    undergraduateRepaymentPlan.totalRepaid +
    (postgraduateRepaymentPlan?.totalRepaid ?? 0);

  const totalWrittenOff =
    undergraduateRepaymentPlan.finalBalance +
    (postgraduateRepaymentPlan?.finalBalance ?? 0);

  return (
    <div className="flex flex-wrap justify-center items-stretch gap-6 w-full max-w-3xl">
      <StatCard label="Total Borrowed" value={formatCurrency(totalBorrowed)} />
      <StatCard
        label="Interest Accrued"
        value={formatCurrency(totalInterest)}
      />
      <StatCard label="Amount Repaid" value={formatCurrency(totalRepaid)} />
      <StatCard
        label="Amount Written Off"
        value={formatCurrency(totalWrittenOff)}
      />
    </div>
  );
};
