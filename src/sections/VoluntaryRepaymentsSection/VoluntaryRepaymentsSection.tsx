import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Font } from "../../shared/components/Text";
import { RadioButtonSet } from "../../shared/components/RadioButtonSet";
import { ResultsButton } from "../../shared/components/ResultsButton";
import { Button } from "../../shared/components/Button";
import { CollapseTransition } from "../../shared/components/CollapseTransition";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";
import { STAGES } from "../../shared/constants/stages";
import { getForgivenessPlanForYear } from "../../domain/loan/forgiveness";
import { EarlyRepaymentInput } from "./components/EarlyRepaymentInput";

export const VoluntaryRepaymentsSection: React.FC = () => {
  const {
    incomeByYear,
    setStage,
    loanFormValues,
    calculateRepaymentWithIncome,
    voluntaryRepayments,
    addVoluntaryRepayment,
    updateVoluntaryRepayment,
    removeVoluntaryRepayment,
  } = useLoanCalculatorStore();

  const [voluntaryRepaymentsChoice, setVoluntaryRepaymentsChoice] = useState<
    string | undefined
  >(undefined);
  const hasScrolledRef = useRef(false);

  const { minDate, maxDate } = useMemo(() => {
    if (!loanFormValues) return { minDate: undefined, maxDate: undefined };

    const graduationYear =
      loanFormValues.courseStartYear + loanFormValues.courseLength;
    const forgivenessYears = getForgivenessPlanForYear(
      loanFormValues.courseStartYear,
      loanFormValues.loanPlan,
    );

    // Loan starts accruing from course start (September)
    const min = `${loanFormValues.courseStartYear}-09-01`;
    // Written off at the end of the forgiveness period (April of repaymentEndYear)
    const repaymentEndYear = graduationYear + forgivenessYears;
    const max = `${repaymentEndYear}-04-30`;

    return { minDate: min, maxDate: max };
  }, [loanFormValues]);

  useEffect(() => {
    if (!voluntaryRepaymentsChoice) return;
    if (hasScrolledRef.current) return;
    hasScrolledRef.current = true;

    const timeout = setTimeout(() => {
      window.scrollBy({ top: window.innerHeight * 0.33, behavior: "smooth" });
    }, 200);
    return () => clearTimeout(timeout);
  }, [voluntaryRepaymentsChoice]);

  useEffect(() => {
    if (
      voluntaryRepaymentsChoice === "yes" &&
      voluntaryRepayments.length === 0
    ) {
      addVoluntaryRepayment();
    }
  }, [
    voluntaryRepaymentsChoice,
    voluntaryRepayments.length,
    addVoluntaryRepayment,
  ]);

  const handleResultsClick = () => {
    if (!loanFormValues) return;
    calculateRepaymentWithIncome(incomeByYear, loanFormValues);
    setStage(STAGES.repaymentResultsSplash);
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center py-12 w-full mx-5">
      <div className="flex flex-col items-center justify-center gap-6 pb-12 w-full ">
        <Font.H2>ARE YOU PLANNING ON MAKING ANY VOLUNTARY REPAYMENTS?</Font.H2>
        <div className="w-full">
          <RadioButtonSet
            options={[
              { value: "yes", label: "YES" },
              { value: "no", label: "NO" },
            ]}
            value={voluntaryRepaymentsChoice}
            onChange={(value) => {
              setVoluntaryRepaymentsChoice(value);
            }}
            className="gap-2"
            buttonClassName="text-xl py-3"
            buttonVariant="secondary"
          />
        </div>
      </div>

      <CollapseTransition show={voluntaryRepaymentsChoice === "yes"}>
        <div className="flex flex-col gap-4 w-full pb-8">
          <Font.H4>REPAYMENTS</Font.H4>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-12 gap-4">
              <Font.Body className="col-span-4">Date</Font.Body>
              <Font.Body className="col-span-5">Amount</Font.Body>
            </div>
            {voluntaryRepayments.map((repayment, index) => (
              <EarlyRepaymentInput
                key={index}
                index={index}
                repayment={repayment}
                minDate={minDate}
                maxDate={maxDate}
                onUpdate={updateVoluntaryRepayment}
                onRemove={removeVoluntaryRepayment}
              />
            ))}
          </div>
          <Button
            variant="no-bg"
            onClick={addVoluntaryRepayment}
            className="self-start"
          >
            <FontAwesomeIcon icon={faPlus} size="sm" />
            Add another repayment
          </Button>
        </div>
      </CollapseTransition>

      {voluntaryRepaymentsChoice && (
        <ResultsButton onClick={handleResultsClick} />
      )}
    </div>
  );
};
