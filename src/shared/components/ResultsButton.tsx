import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "./Button";
import { Font } from "./Text";

interface ResultsButtonProps {
  onClick: () => void;
}

export const ResultsButton: React.FC<ResultsButtonProps> = ({ onClick }) => {
  return (
    <>
      <Font.Subtle className="text-center mx-4 pb-2" small>
        By clicking results, anonymous aggregate statistics (such as total
        repaid vs. written off) may be collected to improve this calculator and
        highlight trends in student loan repayment outcomes. No personal data is
        stored.
      </Font.Subtle>
      <Button className="w-full" type="submit" onClick={onClick}>
        <Font.Body className="text-beck-beige text-2xl pt-1 pl-2">
          RESULTS
        </Font.Body>
        <FontAwesomeIcon className="text-base" icon={faArrowDown} />
      </Button>
    </>
  );
};
