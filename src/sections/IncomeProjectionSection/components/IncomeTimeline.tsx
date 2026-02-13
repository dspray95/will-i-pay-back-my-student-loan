import {
  useMemo,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { getForgivenessPlanForYear } from "../../../domain/loan/forgiveness";
import type { LoanPlan } from "../../../shared/types";
import { arrays } from "../../../shared/utils/arrays";
import { FutureIncomeSelector } from "./FutureIncomeSelector";
import { useLoanCalculatorStore } from "../../../stores/loanCalculatorStore";
import { IncomeSliderSet } from "./IncomeSliderSet";
import { WrittenOffDivider } from "./WrittenOffDivider";
import { cn } from "../../../shared/utils/ClassNames";
import { AutoSetButton } from "./AutoSetButton";
import { useIsMobile } from "../../../shared/hooks/useIsMobile";
import { ActionConfirmationModal } from "../../../shared/components/modals/ActionConfirmationModal";

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

    const isMobile = useIsMobile();

    // Track whether the future income section is in the viewport (for mobile fixed button)
    const futureIncomeSectionRef = useRef<HTMLDivElement>(null);
    const [isSectionVisible, setIsSectionVisible] = useState(false);

    useEffect(() => {
      const el = futureIncomeSectionRef.current;
      if (!el || !isMobile) return;

      const observer = new IntersectionObserver(
        ([entry]) => setIsSectionVisible(entry.isIntersecting),
        { threshold: 0 },
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, [isMobile]);

    // Year ranges
    const yearsToNow = arrays.range(repaymentStartYear, currentYear);
    const yearsFromNowToForgiveness = arrays.range(
      currentYear + 1,
      loanForgivenessYear,
    );

    // Desktop: track button offset based on last touched slider row (h-10 = 40px)
    const SLIDER_ROW_HEIGHT = 40;
    const lastTouchedYearIndex = lastTouchedYear
      ? yearsFromNowToForgiveness.indexOf(lastTouchedYear)
      : -1;
    const buttonOffset =
      lastTouchedYearIndex >= 0 ? lastTouchedYearIndex * SLIDER_ROW_HEIGHT : 0;

    const showAutoSetButton = incomeMode === "manual";
    const autoSetButtonClick = () =>
      lastTouchedYear && applyInflationFill(lastTouchedYear);

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
          {/** Mobile: fixed auto-set button that slides in/out based on section visibility */}
          {isMobile && showAutoSetButton && (
            <AutoSetButton
              year={lastTouchedYear}
              fixed
              visible={isSectionVisible}
              onClick={autoSetButtonClick}
            />
          )}
          {/** Income from current year - could be set manually or by inflation estimations.
           * Hidden until the user has chosen how they want to set their future income */}
          <div
            ref={futureIncomeSectionRef}
            className={cn(
              "relative grid transition-all duration-500 ease-in-out",
              {
                "grid-rows-[1fr] opacity-100 overflow-visible": incomeMode,
                "grid-rows-[0fr] opacity-0": !incomeMode,
              },
            )}
          >
            {/** Desktop: absolute auto-set button floating to the right of sliders */}
            {!isMobile && showAutoSetButton && (
              <AutoSetButton
                year={lastTouchedYear}
                topOffset={buttonOffset}
                onClick={autoSetButtonClick}
              />
            )}
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
        <ActionConfirmationModal
          title="Switch to Auto Mode?"
          bodyText="This will replace your manually entered future income values with
        auto-calculated ones based on predicted inflation. Are you sure?"
          showModal={showWarningModal}
          setShowModal={setShowWarningModal}
          onConfirm={confirmModeSwitch}
        />
      </>
    );
  },
);
