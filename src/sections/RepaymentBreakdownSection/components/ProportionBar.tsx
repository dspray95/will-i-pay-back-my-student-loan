import { useLoanCalculatorStore } from "../../../stores/loanCalculatorStore";
import { Font } from "../../../shared/components/Text";
import { formatCurrency } from "../../../shared/utils/formatCurrency";

export const ProportionBar: React.FC = () => {
  const { undergraduateRepaymentPlan, postgraduateRepaymentPlan } =
    useLoanCalculatorStore();
  if (!undergraduateRepaymentPlan) return null;

  const totalWrittenOff =
    undergraduateRepaymentPlan.finalBalance +
    (postgraduateRepaymentPlan?.finalBalance ?? 0);

  const totalRepaid =
    undergraduateRepaymentPlan.totalRepaid +
    (postgraduateRepaymentPlan?.totalRepaid ?? 0);

  const totalOwed = totalWrittenOff + totalRepaid;

  const repaidPct = (totalRepaid / totalOwed) * 100;
  const writtenOffPct = (totalWrittenOff / totalOwed) * 100;

  const showRepaid = repaidPct > 0;
  const showWrittenOff = writtenOffPct > 0;

  return (
    <div className="w-full md:max-w-3/5">
      <Font.H4 small className="mb-1 text-center">
        TOTAL OWED:{" "}
        <span className="text-district-green">{formatCurrency(totalOwed)}</span>
      </Font.H4>
      <div className="flex w-full h-12 rounded-xs overflow-hidden">
        {showRepaid && (
          <div
            className="bg-district-green"
            style={{ width: `${repaidPct}%` }}
          />
        )}
        {showWrittenOff && (
          <div
            className="bg-central-red"
            style={{ width: `${writtenOffPct}%` }}
          />
        )}
      </div>
      <div className="flex justify-between mt-1">
        {showRepaid && (
          <Font.H4 small className="text-district-green">
            {repaidPct.toFixed(1)}% Repaid
          </Font.H4>
        )}
        {showWrittenOff && (
          <Font.H4 small className="text-central-red ml-auto">
            {writtenOffPct.toFixed(1)}% Written Off
          </Font.H4>
        )}
      </div>
    </div>
  );
};
