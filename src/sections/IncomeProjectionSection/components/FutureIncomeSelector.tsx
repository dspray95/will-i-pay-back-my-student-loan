import { cn } from "../../../shared/utils/ClassNames";

interface FutureIncomeSelectorProps {
  selectedMode: "auto" | "manual" | undefined;
  handleIncomeModeChange: (mode: "auto" | "manual") => void;
}

export const FutureIncomeSelector: React.FC<FutureIncomeSelectorProps> = ({
  selectedMode,
  handleIncomeModeChange,
}) => {
  return (
    <div className="flex items-center justify-center text-center">
      <button
        type="button"
        onClick={() => handleIncomeModeChange("auto")}
        className={cn(
          "flex items-center justify-center border-2 rounded-sm cursor-pointer transition-colors p-3 w-[50%]",
          {
            "border-none bg-piccadilly-blue hover:bg-piccadilly-blue-1":
              selectedMode === "auto",
            "text-piccadilly-blue border-piccadilly-blue hover:opacity-75":
              selectedMode !== "auto",
          },
        )}
      >
        <span
          className={cn({
            "text-beck-beige": selectedMode === "auto",
            "text-piccadilly-blue": selectedMode !== "auto",
          })}
        >
          SET FUTURE INCOME WITH PREDICTED INFLATION
        </span>
      </button>
      <div className="w-1/5">-OR-</div>
      <button
        type="button"
        onClick={() => handleIncomeModeChange("manual")}
        className={cn(
          "flex items-center justify-center border-2 rounded-sm cursor-pointer transition-colors p-3 w-[50%]",
          {
            "border-none bg-piccadilly-blue hover:bg-piccadilly-blue-1":
              selectedMode === "manual",
            "text-piccadilly-blue border-piccadilly-blue hover:opacity-75":
              selectedMode !== "manual",
          },
        )}
      >
        <span
          className={cn({
            "text-beck-beige": selectedMode === "manual",
            "text-piccadilly-blue": selectedMode !== "manual",
          })}
        >
          MANUALLY SET FUTURE INCOME
        </span>
      </button>
    </div>
  );
};
