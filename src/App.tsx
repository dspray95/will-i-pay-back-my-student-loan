import { useState } from "react";
import { IncomePage } from "./pages/IncomePage/IncomePage";
import { getForgivenessPlanForYear, type LoanPlan } from "./data";

import {
  calculateLoanAtGraduation,
  calculateLoanAtRepayment,
} from "./utils/compountInterest";
import { ResultsPage } from "./pages/ResultsPage/ResultsPage";
import { Carousel } from "./shared/components/Carousel";
import { processResults } from "./pages/ResultsPage/processResults";
import type { LoanFormValues, RepaymentPlan } from "./shared/types";
import { LoanPage } from "./pages/LoanPage/LoanPage";

const STAGES = ["loanForm", "income", "finish"] as const;
type Stage = (typeof STAGES)[number];

function App() {
  const [loanFormValues, setLoanFormValues] = useState<LoanFormValues>();
  const [stage, setStage] = useState<Stage>("loanForm");

  const currentStepIndex = STAGES.indexOf(stage);

  const [totalUndergradLoan, setTotalUndergradLoan] = useState(0);
  const [totalMaintenanceLoan, setTotalMaintenanceLoan] = useState(0);
  const [totalMastersLoan, setTotalMastersLoan] = useState(0);

  const [undergraduateLoanAtGraduation, setUndergraduateLoanAtGraduation] =
    useState(0);

  const [postgraduateLoanAtGraduation, setPostgraduateLoansAtGraduation] =
    useState(0);
  const [incomeByYear, setIncomeByYear] = useState<Record<number, number>>({});

  const [undergraduateRepaymentPlan, setUndergraduateRepaymenntPlan] = useState<
    RepaymentPlan | undefined
  >();
  const [postgraduateRepaymentPlan, setPostgraduateRepaymentPlan] = useState<
    RepaymentPlan | undefined
  >();

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
      "postgrad"
    );

    console.log("Undergrad balance at graduation:", undergradLoanAtGraduation);
    console.log("Masters balance at graduation:", mastersLoanAtGraduation);

    setUndergraduateLoanAtGraduation(undergradLoanAtGraduation);
    setPostgraduateLoansAtGraduation(mastersLoanAtGraduation);
  };

  const calculateRepaymentWithIncome = (
    incomeByYear: Record<number, number>,
    loanFormValues: LoanFormValues
  ) => {
    // Called when the user submits their incomr (from the IncomePage)
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

    const undergraduateRepayment = calculateLoanAtRepayment(
      undergraduateLoanAtGraduation,
      graduationYear,
      repaymentEndYear,
      loanFormValues.loanPlan,
      incomeByYear
    );

    const postgraduateRepayment =
      totalMastersLoan > 0
        ? calculateLoanAtRepayment(
            postgraduateLoanAtGraduation,
            loanFormValues.mastersStartYear + loanFormValues.mastersLength,
            loanFormValues.mastersStartYear + loanFormValues.mastersLength + 30,
            "postgrad",
            incomeByYear
          )
        : {
            finalBalance: 0,
            totalRepaid: 0,
            yearByYearBreakdown: [],
          };

    console.log("undergrad repayment", undergraduateRepayment);
    console.log("postgrad repayment", postgraduateRepayment);

    setUndergraduateRepaymenntPlan(undergraduateRepayment);
    setPostgraduateRepaymentPlan(postgraduateRepayment);
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

      {stage === "finish" && (
        <ResultsPage
          setStage={setStage}
          calculationResults={processResults(
            undergraduateRepaymentPlan,
            postgraduateRepaymentPlan,
            undergraduateLoanAtGraduation,
            postgraduateLoanAtGraduation
          )}
          undergraduateRepaymentBreakdown={
            undergraduateRepaymentPlan!.yearByYearBreakdown
          }
          postgraduateRepaymentBreakdown={
            postgraduateRepaymentPlan!.yearByYearBreakdown
          }
          undergraduateCourseLength={loanFormValues!.courseLength}
        />
      )}
    </Carousel>
  );
}

export default App;
