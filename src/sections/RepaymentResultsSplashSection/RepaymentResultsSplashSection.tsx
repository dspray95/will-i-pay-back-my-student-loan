import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { getCopyText } from "./text";
import { useEffect, useMemo } from "react";
import { Button } from "../../shared/components/Button";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";
import { processResults } from "./processResults";
import { STAGES } from "../../shared/constants/stages";
import { Font } from "../../shared/components/Text";

const ErrorSplash: React.FC = () => {
  const { setStage } = useLoanCalculatorStore();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Font.Body>Woops... Something went wrong</Font.Body>
      <Button onClick={() => setStage(STAGES.incomeProjection)}>
        <FontAwesomeIcon icon={faArrowLeft} /> back
      </Button>
    </div>
  );
};

export const RepaymentResultsSplashSection: React.FC = () => {
  const {
    undergraduateRepaymentPlan,
    postgraduateRepaymentPlan,
    undergraduateLoanAtGraduation,
    postgraduateLoanAtGraduation,
    loanFormValues,
    incomeByYear,
    calculateRepaymentWithIncome,
    setStage,
  } = useLoanCalculatorStore();

  // Recalculate when upstream inputs change (debounced for slider drags)
  useEffect(() => {
    if (!loanFormValues) return;
    const timer = setTimeout(() => {
      calculateRepaymentWithIncome(incomeByYear, loanFormValues);
    }, 300);
    return () => clearTimeout(timer);
  }, [
    incomeByYear,
    loanFormValues,
    undergraduateLoanAtGraduation,
    postgraduateLoanAtGraduation,
    calculateRepaymentWithIncome,
  ]);

  // Guard clause for missing data
  if (
    !undergraduateRepaymentPlan ||
    !postgraduateRepaymentPlan ||
    !loanFormValues
  ) {
    return <ErrorSplash />;
  }

  const calculationResults = processResults(
    undergraduateRepaymentPlan,
    postgraduateRepaymentPlan,
    undergraduateLoanAtGraduation,
    postgraduateLoanAtGraduation,
  );

  const { willRepayUndergraduateLoan, willRepayPostgraduateLoan } = calculationResults;

  const hasPostgradLoan = postgraduateLoanAtGraduation > 0;

  // Stabilize random copy text — only re-pick when the yes/no outcome changes
  const copyText = useMemo(
    () => ({
      heading: willRepayUndergraduateLoan ? getCopyText("yes") : getCopyText("no"),
      snark: willRepayUndergraduateLoan
        ? getCopyText("yes-snark")
        : getCopyText("no-snark"),
    }),
    [willRepayUndergraduateLoan],
  );

  const formatMoney = (amount: number) =>
    `£${parseFloat(amount.toFixed(2)).toLocaleString()}`;

  return (
    <div className="flex flex-col gap-2 items-center justify-center py-12 min-h-svh">
      <div className="w-full flex flex-col items-center justify-center mb-4 text-center">
        <Font.H1>{copyText.heading}</Font.H1>
        <Font.Body small={!willRepayUndergraduateLoan}>{copyText.snark}</Font.Body>
      </div>

      {/* Undergraduate */}
      <div className="flex items-center justify-center gap-2 flex-col text-sm">
        {hasPostgradLoan && <Font.H3>Undergraduate</Font.H3>}
        <Font.Body>
          You'll repay{" "}
          <span className="font-mono text-northern-not-black text-base font-semibold">
            {formatMoney(calculationResults.totalUndergraduateDebtPaid)}
          </span>{" "}
          in total
        </Font.Body>
        {!willRepayUndergraduateLoan && (
          <Font.Body>
            You will have{" "}
            <span className="font-mono text-northern-not-black text-base font-semibold">
              {formatMoney(calculationResults.undergraduateAmountForgiven)}
            </span>{" "}
            forgiven.
          </Font.Body>
        )}
        <Font.Body>
          You'll accrue{" "}
          <span className="font-mono text-northern-not-black text-base font-semibold">
            {formatMoney(calculationResults.totalUndergraduateInterestAccrued)}
          </span>{" "}
          in interest over the repayment period.
        </Font.Body>
      </div>

      {/* Postgraduate */}
      {hasPostgradLoan && (
        <div className="flex items-center justify-center gap-2 flex-col text-sm mt-6">
          <Font.H3>Postgraduate</Font.H3>
          <Font.Body>
            You'll repay{" "}
            <span className="font-mono text-northern-not-black text-base font-semibold">
              {formatMoney(calculationResults.totalPostgraduateDebtPaid)}
            </span>{" "}
            in total
          </Font.Body>
          {!willRepayPostgraduateLoan && (
            <Font.Body>
              You will have{" "}
              <span className="font-mono text-northern-not-black text-base font-semibold">
                {formatMoney(calculationResults.postgraduateAmountForgiven)}
              </span>{" "}
              forgiven.
            </Font.Body>
          )}
          <Font.Body>
            You'll accrue{" "}
            <span className="font-mono text-northern-not-black text-base font-semibold">
              {formatMoney(calculationResults.totalPostgraduateInterestAccrued)}
            </span>{" "}
            in interest over the repayment period.
          </Font.Body>
        </div>
      )}
      <div
        className="flex flex-col items-center justify-center cursor-pointer gap-1 pt-8"
        onClick={() => setStage(STAGES.repaymentBreakdown)}
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
