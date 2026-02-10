import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../../shared/components/Button";
import { Font } from "../../../shared/components/Text";
import { useLoanCalculatorStore } from "../../../stores/loanCalculatorStore";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { STAGES } from "../../../shared/constants/stages";

export const ErrorSplash: React.FC = () => {
  const { setStage } = useLoanCalculatorStore();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Font.Body>Woops... Something went wrong</Font.Body>
      <Button onClick={() => setStage(STAGES.loanDetails)}>
        <FontAwesomeIcon icon={faArrowLeft} /> back
      </Button>
    </div>
  );
};
