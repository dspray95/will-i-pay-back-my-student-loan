import { useMemo, useState, forwardRef, useImperativeHandle } from "react";
import { getForgivenessPlanForYear } from "../../../domain/loan/forgiveness";
import type { LoanPlan } from "../../../shared/types";
import { arrays } from "../../../shared/utils/arrays";
import { FutureIncomeSelector } from "./FutureIncomeSelector";
import { useLoanCalculatorStore } from "../../../stores/loanCalculatorStore";
import { IncomeSliderSet } from "./IncomeSliderSet";
import { WrittenOffDivider } from "./WrittenOffDivider";
import { cn } from "../../../shared/utils/classNames";
import { Modal } from "../../../shared/components/Modal";
import { AutoSetButton } from "./AutoSetButton";

export interface IncomeTimelineRef {
  expandFutureIncome: () => void;
}

export const IncomeTimeline = forwardRef<
  IncomeTimelineRef,
  {
    undergradStartYear: number;
    undergradEndYear: number;
    repaymentPlan: LoanPlan;
    salaryGrowthRate: number;
    onFutureIncomeModeChange?: (mode: "auto" | "manual" | undefined) => void;
  }
>(
  (
    {
      undergradStartYear,
      undergradEndYear,
      repaymentPlan,
      salaryGrowthRate,
      onFutureIncomeModeChange,
    },
    ref,
  ) => {
    // State
    const [incomeMode, setIncomeMode] = useState<"auto" | "manual">();
    const [userSetYears, setUserSetYears] = useState<Record<number, boolean>>(
      {},
    );
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [lastTouchedYear, setLastTouchedYear] = useState<number>();

    // Shared state
    const { incomeByYear, setIncomeByYear } = useLoanCalculatorStore();

    // Slider functions
    const currentYear = new Date().getFullYear();
    const repaymentStartYear = undergradEndYear + 1;

    const forgivenessPlan = useMemo(
      () => getForgivenessPlanForYear(undergradStartYear, repaymentPlan),
      [undergradStartYear, repaymentPlan],
    );

    const loanForgivenessYear = repaymentStartYear + forgivenessPlan;

    const handleIncomeChange = (year: number, value: number) => {
      setUserSetYears((prev) => ({ ...prev, [year]: true }));
      setLastTouchedYear(year);

      const updatedIncome = { ...incomeByYear };
      updatedIncome[year] = value;

      // If user manually edits a future year while in auto mode,
      // switch to manual without cascading to other years
      if (incomeMode === "auto" && year > currentYear) {
        setIncomeMode("manual");
        onFutureIncomeModeChange?.("manual");
        setIncomeByYear(updatedIncome);
        return;
      }

      // Propagate to future untouched years up to forgiveness
      const propagateUntil =
        incomeMode === "auto" ? currentYear : loanForgivenessYear;

      for (let y = year + 1; y <= propagateUntil; y++) {
        if (!userSetYears[y]) {
          updatedIncome[y] = value;
        }
      }

      setIncomeByYear(updatedIncome);
    };

    const applyInflationFill = (fromYear: number) => {
      const currentIncomeByYear =
        useLoanCalculatorStore.getState().incomeByYear;
      const baseIncome = currentIncomeByYear[fromYear] ?? 0;
      const futureYears = arrays.range(fromYear + 1, loanForgivenessYear);

      const updatedIncome: Record<number, number> = {};

      Object.entries(currentIncomeByYear).forEach(([year, value]) => {
        if (Number(year) <= fromYear) {
          updatedIncome[Number(year)] = value;
        }
      });

      futureYears.forEach((year, index) => {
        updatedIncome[year] = Math.round(
          baseIncome * Math.pow(1 + salaryGrowthRate / 100, index + 1),
        );
      });

      setIncomeByYear(updatedIncome);

      setUserSetYears((prev) => {
        const updated: Record<number, boolean> = {};
        Object.entries(prev).forEach(([year, value]) => {
          if (Number(year) <= fromYear) {
            updated[Number(year)] = value;
          }
        });
        return updated;
      });
    };

    const applyIncomeMode = (mode: "auto" | "manual") => {
      setIncomeMode(mode);
      onFutureIncomeModeChange?.(mode);

      if (mode === "auto") {
        applyInflationFill(currentYear);
      }
    };

    const handleIncomeModeChange = (mode: "auto" | "manual") => {
      if (mode === "auto") {
        const hasFutureManualEntries = Object.keys(userSetYears).some(
          (year) => Number(year) > currentYear && userSetYears[Number(year)],
        );

        if (hasFutureManualEntries) {
          setShowWarningModal(true);
          return;
        }
      }

      applyIncomeMode(mode);
    };

    const confirmModeSwitch = () => {
      applyIncomeMode("auto");
      setShowWarningModal(false);
    };

    // Expose method to parent
    useImperativeHandle(ref, () => ({
      expandFutureIncome: () => {
        if (!incomeMode) {
          setIncomeMode("auto");
        }
      },
    }));

    // Year ranges
    const yearsToNow = arrays.range(repaymentStartYear, currentYear);
    const yearsFromNowToForgiveness = arrays.range(
      currentYear + 1,
      loanForgivenessYear,
    );

    return (
      <>
        <div className="pb-4 flex flex-col gap-6">
          {/** Income to current year */}
          <IncomeSliderSet
            yearsRange={yearsToNow}
            handleIncomeChange={handleIncomeChange}
          />
          <FutureIncomeSelector
            selectedMode={incomeMode}
            handleIncomeModeChange={handleIncomeModeChange}
          />
          {/** Auto-set button — placed outside overflow-hidden so sticky works */}
          {incomeMode === "manual" && (
            <AutoSetButton
              year={lastTouchedYear}
              onClick={() =>
                lastTouchedYear && applyInflationFill(lastTouchedYear)
              }
            />
          )}
          {/** Income from current year - could be set manually or by inflation estimations.
           * Hidden until the user has chosen how they want to set their future income */}
          <div
            className={cn(
              "relative grid transition-all duration-500 ease-in-out",
              {
                "grid-rows-[1fr] opacity-100 overflow-visible": incomeMode,
                "grid-rows-[0fr] opacity-0": !incomeMode,
              },
            )}
          >
            <div className="overflow-hidden">
              <IncomeSliderSet
                yearsRange={yearsFromNowToForgiveness}
                handleIncomeChange={handleIncomeChange}
              />
              <WrittenOffDivider />
            </div>
          </div>
        </div>
        {/* Warning modal for when the user clicks the 'set by inflation' button when they've
         *  already set some future income values manually */}
        <Modal
          isOpen={showWarningModal}
          onClose={() => setShowWarningModal(false)}
        >
          <h3 className="text-lg font-semibold mb-4">Switch to Auto Mode?</h3>
          <p className="mb-6">
            This will replace your manually entered future income values with
            auto-calculated ones based on predicted inflation. Are you sure?
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowWarningModal(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={confirmModeSwitch}
              className="px-4 py-2 bg-district-green text-beck-beige rounded"
            >
              Continue
            </button>
          </div>
        </Modal>
      </>
    );
  },
);
