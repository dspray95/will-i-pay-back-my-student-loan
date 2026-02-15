import { memo, useEffect, useState } from "react";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  colorBeckBeigeDark1,
  colorDistrictGreen,
  colorNorthernNotBlack,
  colorNotWhite,
} from "../../../shared/constants/color";
import styled from "styled-components";
import { Font } from "../../../shared/components/Text";
import { cn } from "../../../shared/utils/ClassNames";

const StyledSlider = styled(Slider)`
  .rc-slider-handle:focus,
  .rc-slider-handle-click-focused {
    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.4);
    outline: none;
  }
`;

const stepBreakpoints: { increment: number; breakpoint: number }[] = [
  { increment: 2500, breakpoint: 80000 },
  { increment: 5000, breakpoint: 150000 },
  { increment: 10000, breakpoint: 200000 },
  { increment: 25000, breakpoint: 300000 },
  { increment: 50000, breakpoint: 400000 },
];

const generateIncomeSteps = () => {
  let currentIncome = 0;
  const incomeSteps: number[] = [];
  stepBreakpoints.forEach((step) => {
    while (currentIncome < step.breakpoint) {
      incomeSteps.push(currentIncome);
      currentIncome += step.increment;
    }
  });
  if (!incomeSteps.includes(currentIncome)) {
    incomeSteps.push(currentIncome);
  }
  return incomeSteps;
};

const incomeSteps: number[] = generateIncomeSteps();

const getInterpolatedIndex = (value: number): number => {
  if (value <= 0) return 0;
  if (value >= incomeSteps[incomeSteps.length - 1]) {
    return incomeSteps.length - 1;
  }

  for (let i = 0; i < incomeSteps.length - 1; i++) {
    if (value >= incomeSteps[i] && value <= incomeSteps[i + 1]) {
      const lowerValue = incomeSteps[i];
      const upperValue = incomeSteps[i + 1];
      const ratio = (value - lowerValue) / (upperValue - lowerValue);
      return i + ratio;
    }
  }

  return 0;
};

const generateSparseMarks = (steps: number[], fraction: number = 0.1) => {
  const total = steps.length;
  const interval = Math.floor(total * fraction);
  const sparseMarks: Record<number, string> = {};

  for (let i = 0; i < total; i += interval) {
    sparseMarks[i] = "";
  }

  return sparseMarks;
};

const marks = generateSparseMarks(incomeSteps, 0.1);

export const FOCUS_RING_TIMEOUT_MS = 2000;

type IncomeSliderProps = {
  year: number;
  value: number;
  onChange: (year: number, value: number) => void;
  isActive?: boolean;
  onSliderRelease?: (year: number) => void;
  onInputFocus?: () => void;
};

export const IncomeSlider: React.FC<IncomeSliderProps> = memo(
  ({ year, value, onChange, isActive, onSliderRelease, onInputFocus }) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(() =>
      getInterpolatedIndex(value),
    );

    useEffect(() => {
      const newIndex = getInterpolatedIndex(value);
      if (newIndex !== selectedIndex) {
        setSelectedIndex(newIndex);
      }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSliderChange = (val: number | number[]) => {
      if (typeof val === "number") {
        setSelectedIndex(val);
        onChange(year, incomeSteps[val]);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^\d]/g, "");

      if (rawValue === "") {
        onChange(year, 0);
        setSelectedIndex(0);
        return;
      }

      const numericValue = parseInt(rawValue, 10);
      onChange(year, numericValue);
      setSelectedIndex(getInterpolatedIndex(numericValue));
    };

    return (
      <div className="grid grid-cols-12 items-center max-w-full justify-center h-10 px-4">
        <span className="col-span-1 text-sm">{year}</span>
        <div className="col-span-8 sm:col-span-9 px-4">
          <StyledSlider
            min={0}
            max={incomeSteps.length - 1}
            step={1}
            marks={marks}
            value={selectedIndex}
            onChange={handleSliderChange}
            onChangeComplete={() => onSliderRelease?.(year)}
            styles={{
              track: { backgroundColor: colorDistrictGreen, height: "7.5px" },
              rail: { backgroundColor: colorBeckBeigeDark1, height: "7.5px" },
              handle: {
                width: "16px",
                height: "16px",
                margin: "0px",
                padding: "0px",
                bottom: "0px",
                top: "1.5px",
                backgroundColor: colorNotWhite,
                border: `3px solid ${colorNorthernNotBlack}`,
                opacity: 1,
              },
            }}
          />
        </div>
        <div className="relative col-span-3 overflow-visible sm:col-span-2 pl-2 text-[0.7rem] sm:text-xs md:text-sm rounded transition-shadow duration-300">
          <Font.Label className="absolute left-2 top-1/2 -translate-y-1/2">
            £
          </Font.Label>
          <input
            className={cn(
              "pl-3 pr-1 w-full max-w-fit overflow-visible rounded-xs focus:outline-none focus:ring-2 focus:ring-piccadilly-blue",
              isActive && "ring-2 ring-piccadilly-blue",
            )}
            value={value.toLocaleString()}
            onChange={handleChange}
            onFocus={onInputFocus}
          />
        </div>
      </div>
    );
  },
);
