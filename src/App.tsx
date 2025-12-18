import { useState } from "react";
import { type LoanFormValues } from "./components/loan/LoanForm";
import { LoanPage } from "./pages/LoanPage";
import { IncomePage } from "./pages/IncomePage";
import { getForgivenessPlanForYear, type LoanPlan } from "./data";

import {
  calculateLoanAtGraduation,
  calculateLoanAtRepayment,
} from "./utils/compountInterest";
import { ResultsPage } from "./pages/ResultsPage";
import { Carousel } from "./components/Carousel";

// Define the order of your stages here
const STAGES = ["loanForm", "income", "finish"] as const;
type Stage = (typeof STAGES)[number];

function App() {
  const [loanFormValues, setLoanFormValues] = useState<LoanFormValues>();
  const [stage, setStage] = useState<Stage>("loanForm");

  const currentStepIndex = STAGES.indexOf(stage);

  const [totalUndergradLoan, setTotalUndergradLoan] = useState(0);
  const [totalMaintenanceLoan, setTotalMaintenanceLoan] = useState(0);
  const [totalMastersLoan, setTotalMastersLoan] = useState(0);
  const [incomeByYear, setIncomeByYear] = useState<Record<number, number>>({});

  const [undergraduateLoanAtGraduation, setUndergraduateLoanAtGraduation] =
    useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mastersLoanAtGraduation, setMastersLoansAtGraduation] = useState(0);

  let undergradEndYear = 2018;
  let undergradStartYear = 2015;
  if (loanFormValues) {
    undergradEndYear =
      loanFormValues.courseStartYear + loanFormValues.courseLength;
    undergradStartYear = loanFormValues.courseStartYear;
  }

  const calculatePrincipalAtGraduation = (loanFormValues: LoanFormValues) => {
    // Called in the LoanForm page when the user submits the form
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

    console.log("Undergrad balance at graduation:", undergradLoanAtGraduation);
    console.log("Masters balance at graduation:", mastersLoanAtGraduation);

    setUndergraduateLoanAtGraduation(undergradLoanAtGraduation);
    setMastersLoansAtGraduation(mastersLoanAtGraduation);
  };

  const calculateRepaymentWithIncome = (
    incomeByYear: Record<number, number>,
    loanFormValues: LoanFormValues
  ) => {
    // Called when the user submits their incom (from the IncomePage)
    if (!loanFormValues) {
      return;
    }

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
  };

  return (
    <Carousel currentStepIndex={currentStepIndex}>
      {stage === "loanForm" && (
        <LoanPage
          setTotalUndergradLoan={setTotalUndergradLoan}
          setTotalMaintenanceLoan={setTotalMaintenanceLoan}
          setTotalMastersLoan={setTotalMastersLoan}
          setLoanFormValues={setLoanFormValues}
          setStage={setStage}
          calculatePrincipalAtGraduation={calculatePrincipalAtGraduation}
          isActive={true}
        />
      )}

      {stage === "income" && (
        <IncomePage
          undergradStartYear={undergradStartYear}
          undergradEndYear={undergradEndYear}
          isActive={true}
          setStage={setStage}
          repaymentPlan={(loanFormValues?.loanPlan as LoanPlan) || "plan1"}
          incomeByYear={incomeByYear}
          setIncomeByYear={setIncomeByYear}
          loanFormValues={loanFormValues}
          calculateRepaymentWithIncome={calculateRepaymentWithIncome}
        />
      )}

      {stage === "finish" && <ResultsPage setStage={setStage} />}
    </Carousel>
  );
}

export default App;
