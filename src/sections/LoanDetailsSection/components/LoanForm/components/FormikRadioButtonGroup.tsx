// components/RadioButtonGroup.tsx
import { Field } from "formik";
import clsx from "clsx";
import { Font } from "../../../../../shared/components/Text";

interface RadioOption {
  value: string;
  label: string;
}

interface FormikRadioButtonGridProps {
  name: string;
  options: RadioOption[];
  selectedValue: string;
  columns?: number;
}

export const FormikRadioButtonGrid: React.FC<FormikRadioButtonGridProps> = ({
  name,
  options,
  selectedValue,
  columns = 2,
}) => {
  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: "1fr",
      }}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <label
            key={option.value}
            className={clsx(
              "flex items-center justify-center text-center p-3 border-2 rounded-sm cursor-pointer transition-colors",
              {
                // Selected state
                "border-none bg-district-green hover:bg-district-green-1 ":
                  isSelected,
                // Unselected state
                "border-northern-not-black text-northern-not-black hover:opacity-75":
                  !isSelected,
              }
            )}
          >
            <Field
              type="radio"
              name={name}
              value={option.value}
              className="sr-only"
            />
            <Font.Label
              className={clsx({
                "text-beck-beige": isSelected,
                "text-northern-not-black": !isSelected,
              })}
            >
              {option.label}
            </Font.Label>
          </label>
        );
      })}
    </div>
  );
};
