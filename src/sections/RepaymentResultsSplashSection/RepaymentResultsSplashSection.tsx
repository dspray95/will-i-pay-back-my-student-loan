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
  }, [incomeByYear, loanFormValues, undergraduateLoanAtGraduation, postgraduateLoanAtGraduation, calculateRepaymentWithIncome]);

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
    postgraduateLoanAtGraduation
  );

  const willRepayLoans =
    calculationResults.willRepayUndergraduateLoan &&
    calculationResults.willRepayPostgraduateLoan;

  // Stabilize random copy text — only re-pick when the yes/no outcome changes
  const copyText = useMemo(() => ({
    heading: willRepayLoans ? getCopyText("yes") : getCopyText("no"),
    snark: willRepayLoans ? getCopyText("yes-snark") : getCopyText("no-snark"),
  }), [willRepayLoans]);

  const totalRepaid =
    calculationResults.totalPostgraduateDebtPaid +
    calculationResults.totalUndergraduateDebtPaid;

  const totalInterestAccrued =
    calculationResults.totalUndergraduateInterestAccrued +
    calculationResults.totalPostgraduateInterestAccrued;

  const totalForgiven =
    calculationResults.undergraduateAmountForgiven +
    calculationResults.postgraduateAmountForgiven;

  return (
    <div className="flex flex-col gap-2 items-center justify-center py-12">
      <div className="w-full flex flex-col items-center justify-center mb-4 text-center">
        {willRepayLoans ? (
          <>
            <Font.H1>{copyText.heading}</Font.H1>
            <Font.Body>{copyText.snark}</Font.Body>
          </>
        ) : (
          <>
            <Font.H1>{copyText.heading}</Font.H1>
            <Font.Body small>{copyText.snark}</Font.Body>
          </>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 flex-col text-sm">
        <Font.Body>
          You'll repay{" "}
          <span className="font-mono text-northern-not-black text-base font-semibold">
            £{parseFloat(totalRepaid.toFixed(2))}
          </span>{" "}
          in total
        </Font.Body>
        {!willRepayLoans && (
          <Font.Body>
            You will have{" "}
            <span className="font-mono text-northern-not-black text-base font-semibold">
              £{parseFloat(totalForgiven.toFixed(2))}
            </span>{" "}
            forgiven after 30 years.
          </Font.Body>
        )}
        <Font.Body>
          You'll accrue{" "}
          <span className="font-mono text-northern-not-black text-base font-semibold">
            £{parseFloat(totalInterestAccrued.toFixed(2))}
          </span>{" "}
          in interest over the repayment period.
        </Font.Body>
      </div>
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
