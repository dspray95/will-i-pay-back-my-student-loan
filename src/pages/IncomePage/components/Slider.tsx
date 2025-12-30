import React, { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  colorNorthernNotBlack,
  colorSecondary,
  colorSecondaryLight,
} from "../../../utils/color";
import styled from "styled-components";

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

type IncomeSliderProps = {
  year: number;
  value: number;
  onChange: (year: number, value: number) => void;
};

export const IncomeSlider: React.FC<IncomeSliderProps> = ({
  year,
  value,
  onChange,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    // When parent provides a new value, sync the local index
    const newIndex = incomeSteps.findIndex((step) => step === value);
    if (newIndex !== -1 && newIndex !== selectedIndex) {
      setSelectedIndex(newIndex);
    }
  }, [value]);

  const handleSliderChange = (value: number | number[]) => {
    if (typeof value === "number") {
      setSelectedIndex(value);
      onChange(year, incomeSteps[value]);
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

    // Find the step range and interpolate
    let lowerIndex = 0;
    let upperIndex = incomeSteps.length - 1;

    // Find the two steps that bracket this value
    for (let i = 0; i < incomeSteps.length - 1; i++) {
      if (
        numericValue >= incomeSteps[i] &&
        numericValue <= incomeSteps[i + 1]
      ) {
        lowerIndex = i;
        upperIndex = i + 1;
        break;
      }
    }

    // If value is beyond max, clamp to max
    if (numericValue >= incomeSteps[incomeSteps.length - 1]) {
      setSelectedIndex(incomeSteps.length - 1);
      return;
    }

    // Interpolate between the two indices
    const lowerValue = incomeSteps[lowerIndex];
    const upperValue = incomeSteps[upperIndex];
    const ratio = (numericValue - lowerValue) / (upperValue - lowerValue);
    const interpolatedIndex = lowerIndex + ratio;

    setSelectedIndex(interpolatedIndex);
  };

  const marks = generateSparseMarks(incomeSteps, 0.1);

  return (
    <div className="grid grid-cols-12 items-center max-w-full justify-center py-2 px-4">
      <span className="col-span-1 text-sm">{year}</span>
      <div className="col-span-9 px-4">
        <StyledSlider
          min={0}
          max={incomeSteps.length - 1}
          step={1}
          marks={marks}
          value={selectedIndex}
          onChange={handleSliderChange}
          styles={{
            track: { backgroundColor: colorSecondary, height: "5px" },
            rail: { backgroundColor: colorNorthernNotBlack, height: "5px" },
            handle: {
              width: "12px",
              height: "12px",
              margin: "0px",
              padding: "0px",
              transform: "translateY(0)",
              bottom: "0px",
              top: "1.5px",
              backgroundColor: colorSecondaryLight,
              border: "0px",
            },
          }}
        />
      </div>
      <div className="relative col-span-2 pl-2 text-sm">
        <span className="absolute left-2 top-1/2 -translate-y-1/2">£</span>
        <input
          className="px-3 w-full"
          value={value.toLocaleString()}
          onChange={handleChange}
        ></input>
      </div>
    </div>
  );
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
