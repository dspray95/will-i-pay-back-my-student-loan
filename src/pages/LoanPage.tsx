import classNames from "classnames";
import { LoanForm, type LoanFormValues } from "../components/loan/LoanForm";
import { PageHeader } from "../components/loan/PageHeader";

export const LoanPage: React.FC<{
  setLoanFormValues: (values: LoanFormValues) => void;
  setStage: (stage: "loanForm" | "income" | "finish") => void;
  isActive: boolean;
}> = ({ setLoanFormValues, setStage, isActive }) => (
  <div
    className={classNames(
      "mx-2 flex items-center justify-center flex-col",
      "transition-all duration-300 ease-in-out overflow-hidden",
      {
        "transform translate-x-0": isActive,
        "transform -translate-x-[125%]": !isActive,
      }
    )}
  >
    <PageHeader />
    <h3>undergraduate</h3>
    <LoanForm updateFormValues={setLoanFormValues} setStage={setStage} />
  </div>
);
