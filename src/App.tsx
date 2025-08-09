import { useEffect, useState } from "react";
import { type LoanFormValues } from "./components/loan/LoanForm";
import { LoanPage } from "./pages/LoanPage";
import { IncomePage } from "./pages/IncomePage";
import type { LoanPlan } from "./data";
import { PageWrapper } from "./components/PageWrapper";
import { calculateCompoundInterest } from "./utils/compountInterest";
import React from "react";

function App() {
  const [loanFormValues, setLoanFormValues] = useState<LoanFormValues>();
  const [stage, setStage] = useState<"loanForm" | "income" | "finish">(
    "loanForm"
  );
  const [totalUndergradLoan, setTotalUndergradLoan] = useState(0);
  const [totalMainentanceLoan, setTotalMaintenanceLoan] = useState(0);
  const [totalMastersLoan, setTotalMastersLoan] = useState(0);
  const [
    undergraduateLoansAfterGraduating,
    setUndergraduateLoansAfterGraduating,
  ] = useState(0);
  const [postGradLoansAfterGraduating, setPostgradLoansAfterGraduating] =
    useState(0);

  let undergradEndYear = 2015;
  let undergradStartYear = 2018;
  if (loanFormValues) {
    undergradEndYear =
      loanFormValues.courseStartYear + loanFormValues.courseLength;
    undergradStartYear = loanFormValues.courseStartYear;
  }

  const isLoanPageActive = stage === "loanForm";
  const isIncomePageActive = stage === "income";
  useEffect(() => {
    if (loanFormValues) {
      console.log(loanFormValues);
      const loanWithInterest = calculateCompoundInterest(
        totalUndergradLoan + totalMainentanceLoan,
        7.6,
        12,
        loanFormValues.courseLength
      );
      const mastersLoanWithInterest = calculateCompoundInterest(
        totalMastersLoan,
        7.7,
        12,
        1 
      );
      console.log("undergrad total: ", loanWithInterest);
      console.log("plus masters: ", mastersLoanWithInterest);
      setUndergraduateLoansAfterGraduating(loanWithInterest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanFormValues]);

  return (
    <div
      id="page-wrapper"
      className="overflow-y-auto min-h-screen min-w-screen"
    >
      <PageWrapper isActive={isLoanPageActive}>
        <LoanPage
          setTotalUndergradLoan={setTotalUndergradLoan}
          setTotalMaintenanceLoan={setTotalMaintenanceLoan}
          setTotalMastersLoan={setTotalMastersLoan}
          setLoanFormValues={setLoanFormValues}
          setStage={setStage}
          isActive={isLoanPageActive}
        />
      </PageWrapper>
      <PageWrapper isActive={isIncomePageActive}>
        <IncomePage
          undergradStartYear={undergradStartYear}
          undergradEndYear={undergradEndYear}
          isActive={isIncomePageActive}
          setStage={setStage}
          repaymentPlan={(loanFormValues?.loanPlan as LoanPlan) || "plan1"}
        />
      </PageWrapper>
    </div>
  );
}

export default App;
