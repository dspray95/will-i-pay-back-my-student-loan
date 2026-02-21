import { forwardRef } from "react";
import { Font } from "../../../shared/components/Text";
import { OutlineText } from "../../../shared/components/OutlineText";
import { RepaymentSummary } from "./RepaymentSummary";
import { useLoanCalculatorStore } from "../../../stores/loanCalculatorStore";
import { processResults } from "../processResults";
import { RESULTS_TEXT_NOT_REPAID, RESULTS_TEXT_REPAID } from "../ResultText";
import type { RepaymentPlan } from "../../../shared/types";

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

  const subheading = copyText.subheading
    .replace("YOU", "I")
    .replace("YOUR", "MY");
  const snark = copyText.snark.replace("YOU", "I");

  return (
    <div
      ref={ref}
      style={{ fontFamily: "var(--font-railway)" }}
      className="absolute left-0 top-0 w-110 bg-beck-beige p-2.5 -z-1 pointer-events-none opacity-0"
    >
      <div className="border-20 border-piccadilly-blue p-1">
        <div className="border-[5px] border-piccadilly-blue px-6 py-10 flex flex-col items-center">
          {/* Header */}
          <div className="flex flex-col items-center justify-center gap-2 pb-6">
            <div className="text-piccadilly-blue flex flex-col py-1 items-center w-fit px-6 justify-center border-[1.5px] border-piccadilly-blue max-w-2/3">
              <span className="text-sm -mb-3">THE GREAT BRITISH</span>
              <OutlineText fontSize="28px" height={36} strokeWidth={1.5}>
                WRITE-OFF
              </OutlineText>
            </div>
            <Font.Body
              small
              className="text-center text-piccadilly-blue font-semibold"
            >
              WILL I REPAY MY STUDENT LOAN?
            </Font.Body>
          </div>

          {/* Result */}
          <div className="w-full flex flex-col gap-4 items-center justify-center mb-8 text-center">
            <OutlineText fontSize="72px" height={90}>
              {copyText.result}
            </OutlineText>
            <Font.Body>{subheading}</Font.Body>
            <Font.Subtle small>{snark}</Font.Subtle>
          </div>

          {/* Summary */}
          <div className="w-full flex flex-row gap-12 items-start justify-center">
            <RepaymentSummary
              title={hasPostgradLoan ? "Undergraduate" : undefined}
              totalPaid={calculationResults.totalUndergraduateDebtPaid}
              amountForgiven={calculationResults.undergraduateAmountForgiven}
              interestAccrued={
                calculationResults.totalUndergraduateInterestAccrued
              }
              willRepay={willRepayUndergraduateLoan}
              alignLeft={hasPostgradLoan}
              useFirstPerson
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
                alignLeft
                useFirstPerson
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
