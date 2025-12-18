import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../components/button";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const ResultsPage: React.FC<{
  setStage: (stage: "loanForm" | "income" | "finish") => void;
}> = ({ setStage }) => {
  return (
    <div className="relative w-full flex items-center justify-center mb-4">
      <Button
        className="absolute top-2 left-0"
        onClick={() => setStage("income")}
      >
        back <FontAwesomeIcon icon={faArrowLeft} />
      </Button>

      <h1>results</h1>
    </div>
  );
};
