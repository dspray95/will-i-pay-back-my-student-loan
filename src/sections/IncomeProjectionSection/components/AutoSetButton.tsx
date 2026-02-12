import { cn } from "../../../shared/utils/classNames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

type AutoSetButtonProps = {
  year?: number;
  topOffset: number;
  onClick: () => void;
};

export const AutoSetButton: React.FC<AutoSetButtonProps> = ({
  year,
  topOffset,
  onClick,
}) => (
  <button
    className={cn(
      "absolute left-full w-fit text-piccadilly-blue underline hover:cursor-pointer",
      "flex items-center justify-center gap-2 transition-all duration-300",
    )}
    style={{ top: topOffset }}
    onClick={onClick}
  >
    <div className="flex flex-col w-fit whitespace-nowrap z-10">
      <span>AUTO SET</span>
      <span>FROM {year ?? "..."}</span>
    </div>
    <FontAwesomeIcon icon={faArrowDown} />
  </button>
);
