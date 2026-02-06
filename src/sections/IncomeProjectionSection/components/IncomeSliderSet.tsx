import { Fragment } from "react/jsx-runtime";
import { IncomeSlider } from "./IncomeSlider";
import { useLoanCalculatorStore } from "../../../stores/loanCalculatorStore";

interface IncomeSliderSetProps {
  yearsRange: number[];
  handleIncomeChange: (year: number, value: number) => void;
  showButton?: boolean;
}

export const IncomeSliderSet: React.FC<IncomeSliderSetProps> = ({
  yearsRange,
  handleIncomeChange,
}) => {
  const { incomeByYear } = useLoanCalculatorStore();
  console.log("IncomeSliderSet rendering, incomeByYear:", incomeByYear);
  return (
    <div className="relative overflow-visible">
      {yearsRange.map((year) => (
        <Fragment key={year}>
          <IncomeSlider
            year={year}
            value={incomeByYear[year] || 0}
            onChange={handleIncomeChange}
          />
        </Fragment>
      ))}
    </div>
  );
};
