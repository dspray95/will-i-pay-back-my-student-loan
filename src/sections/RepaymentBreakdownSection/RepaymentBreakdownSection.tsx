import { useState } from "react";
import { PageHeader } from "../../layouts/LoanCalculatorFlow/components/PageHeader";
import { Button } from "../../shared/components/Button";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";
import { ProportionBar } from "./components/ProportionBar";
import { RepaymentPlots } from "./components/RepaymentPlots";
import { SummaryStats } from "./components/SummaryStats";
import { Font } from "../../shared/components/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTurnUp } from "@fortawesome/free-solid-svg-icons";
import { ActionConfirmationModal } from "../../shared/components/modals/ActionConfirmationModal";

export const RepaymentBreakdownSection: React.FC = () => {
  const [showResetModal, setShowResetModal] = useState(false);
  const reset = useLoanCalculatorStore((s) => s.reset);

  const handleStartAgain = () => {
    setShowResetModal(false);
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex gap-12 items-center justify-center py-12 flex-col">
      <div className="max-w-full">
        <PageHeader showExplainer={false} />
      </div>
      <SummaryStats />
      <ProportionBar />
      <RepaymentPlots />
      <Button
        className="w-full md:max-w-4/5"
        variant="primary"
        onClick={() => setShowResetModal(true)}
      >
        <Font.Body className="text-beck-beige text-2xl pt-1 pl-2">
          START AGAIN
        </Font.Body>
        <FontAwesomeIcon className="text-base" icon={faTurnUp} />
      </Button>
      <ActionConfirmationModal
        title="Start Again?"
        bodyText="This will clear all your inputs and results. Are you sure you want to
          start over?"
        showModal={showResetModal}
        setShowModal={setShowResetModal}
        onConfirm={handleStartAgain}
      />
      {/* <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)}>
        <h3 className="text-lg font-semibold mb-4">Start Again?</h3>
        <p className="mb-6">
          This will clear all your inputs and results. Are you sure you want to
          start over?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setShowResetModal(false)}
            className="px-4 py-2 border rounded cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleStartAgain}
            className="px-4 py-2 bg-district-green text-beck-beige rounded cursor-pointer"
          >
            Start Again
          </button>
        </div>
      </Modal> */}
    </div>
  );
};
