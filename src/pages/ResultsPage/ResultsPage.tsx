import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../components/button";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import type { CalculationResults } from "./types";
import { getCopyText } from "./text";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { RepaymentPlot } from "./components/RepaymentPlot";
import { useRef } from "react";
import type { RepaymentBreakdown } from "../../types";

export const ResultsPage: React.FC<{
  setStage: (stage: "loanForm" | "income" | "finish") => void;
  calculationResults?: CalculationResults;
  undergraduateRepaymentBreakdown: RepaymentBreakdown;
  postgraduateRepaymentBreakdown: RepaymentBreakdown;
  undergraduateCourseLength: number;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}> = ({
  setStage,
  calculationResults,
  undergraduateRepaymentBreakdown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postgraduateRepaymentBreakdown,
  undergraduateCourseLength,
}) => {
  const repaymentPlotRef = useRef<HTMLDivElement>(null);

  if (!calculationResults) {
    // This shouldn't happen, but just in case...
    return (
      <div className="relative w-full flex items-center justify-center">
        <p>Woops... Something went wrong</p>
        <Button onClick={() => setStage("income")}>
          back <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
      </div>
    );
  }

  const willRepayLoans =
    calculationResults.willRepayUndergraduateLoan &&
    calculationResults.willRepayPostgraduateLoan;

  const totalRepaid =
    calculationResults.totalPostgraduateDebtPaid +
    calculationResults.totalUndergraduateDebtPaid;

  const totalInterestAccrued =
    calculationResults.totalUndergraduateInterestAccrued +
    calculationResults.totalPostgraduateInterestAccrued;

  const totalForgiven =
    calculationResults.undergraduateAmountForgiven +
    calculationResults.postgraduateAmountForgiven;

  console.log(calculationResults);

  return (
    <div className="relative w-full flex flex-col items-center justify-center mb-4">
      {/* <Button className="fixed top-6 left-6" onClick={() => setStage("income")}>
        back <FontAwesomeIcon icon={faArrowLeft} />
      </Button> */}
      {/** Splash section */}
      <div className="relative flex min-h-svh -translate-y-8 flex-col items-center justify-center ">
        {willRepayLoans && (
          <>
            <h1>{getCopyText("yes")}</h1>
            <p>{getCopyText("yes-snark")}</p>
          </>
        )}
        {!willRepayLoans && (
          <>
            <h1>{getCopyText("no")}</h1>
            <p className="text-xs text-gray-400">{getCopyText("no-snark")}</p>
          </>
        )}
        <div className="flex items-center justify-center gap-2 flex-col text-sm">
          <p className="pt-8">
            You'll repay{" "}
            <span className="font-mono text-secondary text-base">
              £{parseFloat(totalRepaid.toFixed(2))}
            </span>{" "}
            in total
          </p>
          {!willRepayLoans && (
            <p>
              You will have{" "}
              <span className="font-mono text-secondary text-base">
                £{parseFloat(totalForgiven.toFixed(2))}
              </span>{" "}
              forgiven after 30 years.
            </p>
          )}
          <p>
            You'll accrue{" "}
            <span className="font-mono text-secondary text-base">
              £{parseFloat(totalInterestAccrued.toFixed(2))}
            </span>{" "}
            in interest over the repayment period.
          </p>
        </div>
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center, hover:cursor-pointer gap-1"
          onClick={() => {
            repaymentPlotRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span>More details</span>
          <FontAwesomeIcon
            className="animate-bounce"
            width={200}
            icon={faChevronDown}
          />
        </div>
      </div>
      {/** More details section */}
      <div ref={repaymentPlotRef}>
        <RepaymentPlot
          undergraduateRepaymentBreakdown={undergraduateRepaymentBreakdown}
          courseLength={undergraduateCourseLength}
        />
      </div>
    </div>
  );
};
