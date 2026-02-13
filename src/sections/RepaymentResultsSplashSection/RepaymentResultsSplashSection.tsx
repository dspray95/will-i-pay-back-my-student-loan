import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { RESULTS_TEXT_NOT_REPAID, RESULTS_TEXT_REPAID } from "./ResultText";
import { useEffect, useRef } from "react";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";
import { processResults } from "./processResults";
import { STAGES } from "../../shared/constants/stages";
import { Font } from "../../shared/components/Text";
import type { RepaymentPlan } from "../../shared/types";
import { RepaymentSummary } from "./components/RepaymentSummary";
import { ErrorSplash } from "./components/ErrorSplash";

export const RepaymentResultsSplashSection: React.FC = () => {
  const {
    undergraduateRepaymentPlan,
    postgraduateRepaymentPlan,
    undergraduateLoanAtGraduation,
    postgraduateLoanAtGraduation,
    loanFormValues,
    setStage,
  } = useLoanCalculatorStore();

  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stageAdvanced = false;

    const handleScroll = () => {
      const breakdownEl = document.getElementById("repayment-breakdown");
      if (!breakdownEl || !buttonRef.current) return;

      const rect = breakdownEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      let opacity: number;
      if (rect.top >= viewportHeight) {
        opacity = 1;
      } else if (rect.top <= viewportHeight * 0.5) {
        opacity = 0;
        if (!stageAdvanced) {
          stageAdvanced = true;
          setStage(STAGES.repaymentBreakdown);
        }
      } else {
        const progress = (viewportHeight - rect.top) / (viewportHeight * 0.5);
        opacity = 1 - progress;
      }

      buttonRef.current.style.opacity = String(opacity);
      buttonRef.current.style.pointerEvents = opacity === 0 ? "none" : "auto";
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setStage]);

  if (!undergraduateRepaymentPlan || !loanFormValues) {
    return <ErrorSplash />;
  }

  const defaultEmptyPlan: RepaymentPlan = {
    finalBalance: 0,
    totalRepaid: 0,
    yearByYearBreakdown: [],
  };

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

  return (
    <div className="relative flex flex-col gap-8 items-center justify-center py-12 min-h-svh">
      <div className="w-full flex flex-col gap-4 items-center justify-center mb-4 text-center">
        <Font.OutlineHeader>{copyText.result}</Font.OutlineHeader>
        <Font.Body>{copyText.subheading}</Font.Body>
        <Font.Subtle small>{copyText.snark}</Font.Subtle>
        {hasPostgradLoan &&
          !willRepayUndergraduateLoan &&
          willRepayPostgraduateLoan && (
            <Font.Subtle small>
              You will repay your postgrad loan though!
            </Font.Subtle>
          )}
      </div>
      <div className="w-full flex-col md:flex-row flex gap-12 items-start justify-center">
        <RepaymentSummary
          title={hasPostgradLoan ? "Undergraduate" : undefined}
          totalPaid={calculationResults.totalUndergraduateDebtPaid}
          amountForgiven={calculationResults.undergraduateAmountForgiven}
          interestAccrued={calculationResults.totalUndergraduateInterestAccrued}
          willRepay={willRepayUndergraduateLoan}
          alignLeft={hasPostgradLoan}
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
          />
        )}
      </div>
      <div
        ref={buttonRef}
        className="flex flex-col items-center justify-center cursor-pointer gap-1 pt-8 absolute bottom-10"
        onClick={() => {
          const el = document.getElementById("repayment-breakdown");
          el?.scrollIntoView({ behavior: "smooth" });
          setStage(STAGES.repaymentBreakdown);
        }}
      >
        <Font.Body small>More details</Font.Body>
        <FontAwesomeIcon
          className="animate-bounce text-northern-not-black"
          icon={faChevronDown}
        />
      </div>
    </div>
  );
};
