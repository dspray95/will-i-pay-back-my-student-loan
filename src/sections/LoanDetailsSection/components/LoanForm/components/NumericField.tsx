import { Field, useFormikContext } from "formik";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUndo,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { FIELD_CLASS } from "../consts";
import type { LoanFormValues } from "../../../../../shared/schemas/LoanFormSchema";
import { Font } from "../../../../../shared/components/Text";
import { cn } from "../../../../../shared/utils/ClassNames";

const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ].includes(e.key) ||
    ((e.ctrlKey || e.metaKey) &&
      ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
  ) {
    return;
  }
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};

const formatYearLabel = (yearIndex: number, startYear: number): string => {
  const year = startYear + yearIndex;
  const nextYear = (year + 1) % 100;
  return `Year ${yearIndex + 1} (${year}/${nextYear.toString().padStart(2, "0")})`;
};

export const NumericField: React.FC<{
  name: string;
  label: string;
  isHidden?: boolean;
  defaultValue: number;
  onReset: (fieldName: string) => void;
  onChange: (fieldName: string) => void;
  isEdited: boolean;
  yearCount?: number;
  startYear?: number;
  yearlyValues?: number[];
  onYearlyChange?: (values: number[]) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}> = ({
  name,
  label,
  isHidden = false,
  defaultValue,
  onReset,
  onChange,
  isEdited,
  yearCount,
  startYear,
  yearlyValues,
  onYearlyChange,
  isExpanded = false,
  onToggleExpand,
}) => {
  const { values, handleChange } = useFormikContext<LoanFormValues>();
  const currentValue = (values as any)[name] || 0;
  const hasChanged = currentValue !== defaultValue;
  const showUndoButton = hasChanged && isEdited;
  const canExpand = yearCount !== undefined && yearCount > 0 && onToggleExpand;

  if (isHidden) return null;

  const handleYearValueChange = (yearIndex: number, newValue: number) => {
    if (!yearlyValues || !onYearlyChange) return;
    const updated = [...yearlyValues];
    updated[yearIndex] = newValue;
    onYearlyChange(updated);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-1 items-center">
        <Font.Label>{label}</Font.Label>
        <div className="relative flex items-center gap-2">
          <div className="relative grow">
            <Font.Body className="absolute left-2 top-1/2 transform -translate-y-1/2 ">
              £
            </Font.Body>
            <Field
              className={clsx(FIELD_CLASS, "pl-6", {
                "bg-northern-not-black/5 text-northern-not-black/60":
                  isExpanded,
              })}
              type="number"
              name={name}
              readOnly={isExpanded}
              onKeyDown={handleNumberKeyDown}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!isExpanded) {
                  onChange(name);
                  handleChange(e);
                }
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => onReset(name)}
            className={clsx(
              "transition-colors p-1 w-8 h-8 flex items-center justify-center",
              {
                "text-central-red hover:text-central-red-1 hover:cursor-pointer":
                  showUndoButton,
                "text-northern-not-black opacity-50": !showUndoButton,
              },
            )}
            title="Reset to estimate"
            disabled={!showUndoButton}
          >
            <FontAwesomeIcon icon={faUndo} size="sm" />
          </button>
          {canExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="transition-colors p-1 w-8 h-8 flex items-center justify-center text-northern-not-black-1 hover:text-northern-not-black-1/70 hover:cursor-pointer"
              title={
                isExpanded ? "Collapse year breakdown" : "Expand year breakdown"
              }
            >
              <FontAwesomeIcon
                icon={isExpanded ? faChevronUp : faChevronDown}
                size="sm"
              />
            </button>
          )}
        </div>
      </div>

      {canExpand && (
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <div className="pl-4 pt-2 pb-1 flex flex-col gap-1.5 border-l-2 border-piccadilly-blue/20 ml-1 mt-1">
              {yearlyValues?.map((value, i) => (
                <div key={i} className="grid grid-cols-2 gap-1 items-center">
                  <Font.Subtle small>
                    {formatYearLabel(i, startYear ?? 0)}
                  </Font.Subtle>
                  <div className="relative">
                    <Font.Body className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm">
                      £
                    </Font.Body>
                    <input
                      className={clsx(FIELD_CLASS, "pl-6 text-sm py-1")}
                      type="number"
                      value={value}
                      onKeyDown={handleNumberKeyDown}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value, 10);
                        handleYearValueChange(i, isNaN(parsed) ? 0 : parsed);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
