import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

type AutoSetButtonProps = {
  year?: number;
  onClick: () => void;
};

export const AutoSetButton: React.FC<AutoSetButtonProps> = ({
  year,
  onClick,
}) => (
  <button
    className="sticky top-0 z-20 w-full py-2 bg-not-white/90 backdrop-blur-sm text-piccadilly-blue underline hover:cursor-pointer flex items-center justify-center gap-2"
    onClick={onClick}
  >
    <span>
      AUTO SET FROM {year ?? "..."}
    </span>
    <FontAwesomeIcon icon={faArrowDown} />
  </button>
);
