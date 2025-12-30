import classNames from "classnames";
import type { Dispatch, SetStateAction } from "react";
import { PageHeader } from "./components/PageHeader";
import type { LoanFormValues } from "../../shared/types";
import { LoanForm } from "./components/LoanForm";

export const LoanDetailsSection: React.FC<{
  setTotalUndergradLoan: Dispatch<SetStateAction<number>>;
  setTotalMastersLoan: Dispatch<SetStateAction<number>>;
  setTotalMaintenanceLoan: Dispatch<SetStateAction<number>>;
  setLoanFormValues: (values: LoanFormValues) => void;
  setStage: (stage: "loanForm" | "income" | "finish") => void;
  calculatePrincipalAtGraduation: (values: LoanFormValues) => void;
  isActive: boolean;
}> = ({
  setTotalUndergradLoan,
  setTotalMastersLoan,
  setTotalMaintenanceLoan,
  setLoanFormValues,
  setStage,
  calculatePrincipalAtGraduation,
  isActive,
}) => (
  <div
    className={classNames(
      "mx-2 flex flex-col justify-center",
      "transform transition-all  ease-in-out overflow-hidden",
      {
        "translate-x-0 duration-300": isActive,
        "-translate-x-[125%] duration-200": !isActive,
      }
    )}
  >
    <PageHeader />
    <h3>undergraduate</h3>
    <LoanForm
      setTotalUndergradLoan={setTotalUndergradLoan}
      setTotalMaintenanceLoan={setTotalMaintenanceLoan}
      setTotalMastersLoan={setTotalMastersLoan}
      updateFormValues={setLoanFormValues}
      setStage={setStage}
      calculatePrincipalAtGraduation={calculatePrincipalAtGraduation}
    />
  </div>
);
