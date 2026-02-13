import { cn } from "../../../shared/utils/classNames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

type AutoSetButtonProps = {
  year?: number;
  topOffset?: number;
  fixed?: boolean;
  visible?: boolean;
  onClick: () => void;
};

export const AutoSetButton: React.FC<AutoSetButtonProps> = ({
  year,
  topOffset,
  fixed,
  visible = true,
  onClick,
}) => (
  <button
    className={cn(
      "text-piccadilly-blue underline hover:cursor-pointer",
      "flex items-center justify-center gap-2 transition-all duration-300",
      fixed
        ? "fixed left-0 w-full py-2 z-50 bg-beck-beige backdrop-blur-sm"
        : "absolute left-full w-fit whitespace-nowrap",
      fixed && visible && "top-0",
      fixed && !visible && "-top-12 opacity-0 pointer-events-none",
    )}
    style={fixed ? undefined : { top: topOffset }}
    onClick={onClick}
  >
    {fixed ? (
      <span>AUTO SET FROM {year ?? "..."}</span>
    ) : (
      <div className="flex flex-col w-fit whitespace-nowrap z-10">
        <span>AUTO SET</span>
        <span>FROM {year ?? "..."}</span>
      </div>
    )}
    <FontAwesomeIcon icon={faArrowDown} />
  </button>
);
