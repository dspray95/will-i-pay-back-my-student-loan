import { useEffect, useState } from "react";
import { type LoanFormValues } from "./components/loan/LoanForm";
import { LoanPage } from "./pages/LoanPage";
import { IncomePage } from "./pages/IncomePage";
import { getForgivenessPlanForYear, type LoanPlan } from "./data";
import { PageWrapper } from "./components/PageWrapper";
import {
  calculateLoanAtGraduation,
  calculateLoanAtRepayment,
} from "./utils/compountInterest";

function App() {
  const [loanFormValues, setLoanFormValues] = useState<LoanFormValues>();
  const [stage, setStage] = useState<"loanForm" | "income" | "finish">(
    "loanForm"
  );
  const [totalUndergradLoan, setTotalUndergradLoan] = useState(0);
  const [totalMaintenanceLoan, setTotalMaintenanceLoan] = useState(0);
  const [totalMastersLoan, setTotalMastersLoan] = useState(0);
  const [incomeByYear, setIncomeByYear] = useState<Record<number, number>>({});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [undergraduateLoanAtGraduation, setUndergraduateLoanAtGraduation] =
    useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mastersLoanAtGraduation, setMastersLoansAtGraduation] = useState(0);

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
      console.log(
        "total loan no interest: ",
        totalUndergradLoan + totalMaintenanceLoan
      );
      const undergradLoanAtGraduation = calculateLoanAtGraduation(
        totalUndergradLoan + totalMaintenanceLoan,
        loanFormValues.courseStartYear,
        loanFormValues.courseLength,
        loanFormValues.loanPlan
      );

      const mastersLoanAtGraduation = calculateLoanAtGraduation(
        totalMastersLoan,
        loanFormValues.mastersStartYear,
        loanFormValues.mastersLength,
        loanFormValues.loanPlan, // TODO use actual postgrad load plan
        true
      );

      console.log(
        "Undergrad balance at graduation:",
        undergradLoanAtGraduation
      );
      console.log("Masters balance at graduation:", mastersLoanAtGraduation);

      setUndergraduateLoanAtGraduation(undergradLoanAtGraduation);
      setMastersLoansAtGraduation(mastersLoanAtGraduation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanFormValues]);

  useEffect(() => {
    if (loanFormValues && Object.keys(incomeByYear).length > 0) {
      const repaymentEnd = getForgivenessPlanForYear(
        loanFormValues.courseStartYear,
        loanFormValues.loanPlan
      );

      const graduationYear =
        loanFormValues.courseStartYear + loanFormValues.courseLength;

      const repaymentEndYear = graduationYear + repaymentEnd;

      const undergradRepayment = calculateLoanAtRepayment(
        undergraduateLoanAtGraduation,
        graduationYear,
        repaymentEndYear,
        loanFormValues.loanPlan,
        incomeByYear
      );

      const mastersRepayment =
        totalMastersLoan > 0
          ? calculateLoanAtRepayment(
              totalMastersLoan,
              loanFormValues.mastersStartYear + loanFormValues.mastersLength,
              graduationYear + 30, // TODO: Most master's are 30-year write-off
              loanFormValues.loanPlan,
              incomeByYear
            )
          : {
              finalBalance: 0,
              totalRepaid: 0,
              yearByYearBreakdown: [],
            };

      console.log("Undergrad repayment breakdown:", undergradRepayment);

      console.log("Masters repayment breakdown:", mastersRepayment);
    }
  }, [
    loanFormValues,
    incomeByYear,
    totalMastersLoan,
    undergraduateLoanAtGraduation,
  ]);

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
          incomeByYear={incomeByYear}
          setIncomeByYear={setIncomeByYear}
        />
      </PageWrapper>
    </div>
  );
}

export default App;
