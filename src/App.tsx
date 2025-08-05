import { useState } from "react";
import { type LoanFormValues } from "./components/loan/LoanForm";
import { LoanPage } from "./pages/LoanPage";
import { IncomePage } from "./pages/IncomePage";
import type { LoanPlan } from "./data";

function App() {
  const [loanFormValues, setLoanFormValues] = useState<LoanFormValues>();
  const [stage, setStage] = useState<"loanForm" | "income" | "finish">(
    "loanForm"
  );

  let undergradEndYear = 2015;
  let undergradStartYear = 2018;
  if (loanFormValues) {
    undergradEndYear =
      loanFormValues.courseStartYear + loanFormValues.courseLength;
    undergradStartYear = loanFormValues.courseStartYear;
  }

  return (
    <div
      id="page-wrapper"
      className="relative overflow-y-auto overflow-x-hidden min-h-screen pt-26"
    >
      <LoanPage
        setLoanFormValues={setLoanFormValues}
        setStage={setStage}
        isActive={stage === "loanForm"}
      />
      <IncomePage
        undergradStartYear={undergradStartYear}
        undergradEndYear={undergradEndYear}
        isActive={stage === "income"}
        setStage={setStage}
        repaymentPlan={(loanFormValues?.loanPlan as LoanPlan) || "plan1"}
      />
    </div>
  );
}

export default App;
