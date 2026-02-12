import { useState } from "react";
import { PageHeader } from "../../layouts/LoanCalculatorFlow/components/PageHeader";
import { Button } from "../../shared/components/Button";
import { Modal } from "../../shared/components/Modal";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";
import { ProportionBar } from "./components/ProportionBar";
import { RepaymentPlots } from "./components/RepaymentPlots";
import { SummaryStats } from "./components/SummaryStats";

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
      <PageHeader showExplainer={false} />
      <SummaryStats />
      <ProportionBar />
      <RepaymentPlots />
      <Button variant="primary" onClick={() => setShowResetModal(true)}>
        Start Again
      </Button>
      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)}>
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
      </Modal>
    </div>
  );
};
