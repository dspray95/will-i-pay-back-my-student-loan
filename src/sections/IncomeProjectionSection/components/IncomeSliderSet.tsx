import { Fragment } from "react/jsx-runtime";
import { IncomeSlider } from "./Slider";
import { useLoanCalculatorStore } from "../../../stores/loanCalculatorStore";

interface IncomeSliderSetProps {
  yearsRange: number[];
  handleIncomeChange: (year: number, value: number) => void;
}

export const IncomeSliderSet: React.FC<IncomeSliderSetProps> = ({
  yearsRange,
  handleIncomeChange,
}) => {
  const { incomeByYear } = useLoanCalculatorStore();
  console.log("IncomeSliderSet rendering, incomeByYear:", incomeByYear);
  return (
    <div>
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
