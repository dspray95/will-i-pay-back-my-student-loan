import { forwardRef } from "react";
import { Font } from "../../../shared/components/Text";
import { OutlineText } from "../../../shared/components/OutlineText";
import { RepaymentSummary } from "./RepaymentSummary";
import { useLoanCalculatorStore } from "../../../stores/loanCalculatorStore";
import { processResults } from "../util/processResults";
import {
  RESULTS_TEXT_NOT_REPAID,
  RESULTS_TEXT_REPAID,
} from "../components/ResultText";
import type { RepaymentPlan } from "../../../shared/types";
import { cn } from "../../../shared/utils/ClassNames";

const defaultEmptyPlan: RepaymentPlan = {
  finalBalance: 0,
  totalRepaid: 0,
  yearByYearBreakdown: [],
};

export const ShareCard = forwardRef<HTMLDivElement>((_, ref) => {
  const {
    undergraduateRepaymentPlan,
    postgraduateRepaymentPlan,
    undergraduateLoanAtGraduation,
    postgraduateLoanAtGraduation,
  } = useLoanCalculatorStore();

  if (!undergraduateRepaymentPlan) return null;

  const calculationResults = processResults(
    undergraduateRepaymentPlan,
    postgraduateRepaymentPlan ?? defaultEmptyPlan,
    undergraduateLoanAtGraduation,
    postgraduateLoanAtGraduation,
  );

  const { willRepayUndergraduateLoan, willRepayPostgraduateLoan } =
    calculationResults;

  const hasPostgradLoan =
    postgraduateLoanAtGraduation > 0 &&
    !!postgraduateRepaymentPlan &&
    postgraduateRepaymentPlan.yearByYearBreakdown.length > 0;

  const copyText = willRepayUndergraduateLoan
    ? RESULTS_TEXT_REPAID
    : RESULTS_TEXT_NOT_REPAID;

  // We need to build a lot of this from scratch, rather than using components, because the html-to-img library
  // we're using won't play nicely with some of our components.
  return (
    <div
      ref={ref}
      style={{ fontFamily: "var(--font-railway)" }}
      className={cn(
        "absolute left-0 top-0 bg-beck-beige p-2.5 -z-1 pointer-events-none opacity-0",
        { "w-200": hasPostgradLoan, "w-110": !hasPostgradLoan },
      )}
    >
      <div className="border-20 border-piccadilly-blue p-1">
        <div className="border-[5px] border-piccadilly-blue px-6 py-10 flex flex-col items-center">
          {/* Result */}
          <div className="w-full flex flex-col gap-4 items-center justify-center mb-8 text-center">
            <OutlineText fontSize="72px" height={90}>
              {copyText.result}
            </OutlineText>
            <Font.Body>{copyText.subheading}</Font.Body>
            <Font.Subtle small>{copyText.snark}</Font.Subtle>
          </div>

          {/* Summary */}
          <div
            className={cn(
              "w-full flex flex-row gap-12 items-start justify-center",
              { "mx-20": hasPostgradLoan },
            )}
          >
            <RepaymentSummary
              title={hasPostgradLoan ? "Undergraduate" : undefined}
              totalPaid={calculationResults.totalUndergraduateDebtPaid}
              amountForgiven={calculationResults.undergraduateAmountForgiven}
              interestAccrued={
                calculationResults.totalUndergraduateInterestAccrued
              }
              willRepay={willRepayUndergraduateLoan}
            />
            {hasPostgradLoan && (
              <RepaymentSummary
                title="Postgraduate"
                totalPaid={calculationResults.totalPostgraduateDebtPaid}
                amountForgiven={calculationResults.postgraduateAmountForgiven}
                interestAccrued={
                  calculationResults.totalPostgraduateInterestAccrued
                }
                willRepay={willRepayPostgraduateLoan}
              />
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs opacity-60">
            greatbritishwriteoff.co.uk
          </div>
        </div>
      </div>
    </div>
  );
});

ShareCard.displayName = "ShareCard";
