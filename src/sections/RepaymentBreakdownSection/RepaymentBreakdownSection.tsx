import { useState } from "react";
import { Button } from "../../shared/components/Button";
import { useLoanCalculatorStore } from "../../stores/loanCalculatorStore";
import { ProportionBar } from "./components/ProportionBar";
import { RepaymentPlots } from "./components/RepaymentPlots";
import { SummaryStats } from "./components/SummaryStats";
import { Font } from "../../shared/components/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTurnUp } from "@fortawesome/free-solid-svg-icons";
import { ActionConfirmationModal } from "../../shared/components/modals/ActionConfirmationModal";
import { PageHeader } from "../../shared/components/PageHeader";
import { BuyMeACoffeeLink } from "../../shared/components/socials/BuyMeACoffee";

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
        <PageHeader showExplainer={false} showSocials={false} />
      </div>
      <SummaryStats />
      <ProportionBar />
      <RepaymentPlots />
      <BuyMeACoffeeLink />

      <Button
        className="w-full md:max-w-4/5 xl:max-w-2/5"
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
    </div>
  );
};
