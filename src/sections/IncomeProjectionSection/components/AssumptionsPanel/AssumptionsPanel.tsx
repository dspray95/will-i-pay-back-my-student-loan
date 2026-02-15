import { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "../../../../shared/utils/ClassNames";
import { RateInput } from "./RateInput";

interface AssumptionsPanelProps {
  salaryGrowthRate: number;
  projectedInflationRate: number;
  onSalaryGrowthRateChange: (rate: number) => void;
  onProjectedInflationRateChange: (rate: number) => void;
}

export const AssumptionsPanel: React.FC<AssumptionsPanelProps> = ({
  salaryGrowthRate,
  projectedInflationRate,
  onSalaryGrowthRateChange,
  onProjectedInflationRateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-piccadilly-blue/5 transition-colors"
      >
        <div className="flex items-center gap-3 grow">
          <span className="text-sm grow font-semibold text-piccadilly-blue uppercase tracking-wide">
            Assumptions
          </span>
          {!isOpen && (
            <span className="flex flex-col md:flex-row text-xs text-northern-not-black/60 items-start align-center text-left grow md:gap-4">
              <span>Salary growth: {salaryGrowthRate}% </span>
              <span>Projected inflation: {projectedInflationRate}%</span>
            </span>
          )}
        </div>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="text-piccadilly-blue text-xs"
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1 flex flex-col gap-4 sm:flex-row sm:gap-8">
            <RateInput
              label="Salary growth"
              value={salaryGrowthRate}
              onChange={onSalaryGrowthRateChange}
              helpText="Annual salary increase used for auto income projections"
            />
            <RateInput
              label="Projected inflation (RPI)"
              value={projectedInflationRate}
              onChange={onProjectedInflationRateChange}
              helpText="Long-term RPI forecast for loan interest rates beyond published data"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
