import { Field, useFormikContext } from "formik";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { FIELD_CLASS } from "../consts";
import type { LoanFormValues } from "../../../../../shared/schemas/LoanFormSchema";

export const NumericField: React.FC<{
  name: string;
  label: string;
  isHidden?: boolean;
  defaultValue: number;
  onReset: (fieldName: string) => void;
  onChange: (fieldName: string) => void;
  isEdited: boolean;
}> = ({
  name,
  label,
  isHidden = false,
  defaultValue,
  onReset,
  onChange,
  isEdited,
}) => {
  const { values } = useFormikContext<LoanFormValues>();
  const currentValue = (values as any)[name] || 0;
  const hasChanged = currentValue !== defaultValue;
  const showUndoButton = hasChanged && isEdited;

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

  if (isHidden) return null;

  return (
    <div className="grid grid-cols-2 gap-1 items-center">
      <label className="text-sm">{label}</label>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-grow">
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-northern-not-black">
            £
          </span>
          <Field
            className={clsx(FIELD_CLASS, "pl-6")}
            type="number"
            name={name}
            onKeyDown={handleNumberKeyDown}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChange(name);
              // Let Formik handle the actual value update
              setTimeout(() => {
                const formikField = document.querySelector(
                  `input[name="${name}"]`
                );
                if (formikField) {
                  formikField.dispatchEvent(
                    new Event("input", { bubbles: true })
                  );
                }
              }, 0);
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
            }
          )}
          title="Reset to estimate"
          disabled={!showUndoButton}
        >
          <FontAwesomeIcon icon={faUndo} size="sm" />
        </button>
      </div>
    </div>
  );
};
