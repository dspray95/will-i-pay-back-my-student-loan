import { memo, useCallback, useRef, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { IncomeSlider, FOCUS_RING_TIMEOUT_MS } from "./IncomeSlider";
import { useLoanCalculatorStore } from "../../../stores/loanCalculatorStore";

interface IncomeSliderSetProps {
  yearsRange: number[];
  handleIncomeChange: (year: number, value: number) => void;
  showButton?: boolean;
}

export const IncomeSliderSet: React.FC<IncomeSliderSetProps> = memo(({
  yearsRange,
  handleIncomeChange,
}) => {
  const { incomeByYear } = useLoanCalculatorStore();
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleSliderRelease = useCallback((year: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveYear(year);
    timeoutRef.current = setTimeout(() => setActiveYear(null), FOCUS_RING_TIMEOUT_MS);
  }, []);

  const handleInputFocus = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveYear(null);
  }, []);

  return (
    <div className="relative overflow-visible">
      {yearsRange.map((year) => (
        <Fragment key={year}>
          <IncomeSlider
            year={year}
            value={incomeByYear[year] || 0}
            onChange={handleIncomeChange}
            isActive={activeYear === year}
            onSliderRelease={handleSliderRelease}
            onInputFocus={handleInputFocus}
          />
        </Fragment>
      ))}
    </div>
  );
});
