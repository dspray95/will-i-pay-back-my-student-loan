import { Field } from "formik";
import { getYear } from "date-fns";
import clsx from "clsx";
import { FormField } from "./FormField";
import { FIELD_CLASS } from "../consts";

interface MastersSectionProps {
  isVisible: boolean;
}

export const MastersSection: React.FC<MastersSectionProps> = ({
  isVisible,
}) => {
  return (
    <div
      className={clsx(
        "transition-all duration-500 ease-in-out overflow-hidden origin-top",
        {
          "max-h-0 scale-y-0": !isVisible,
          "max-h-screen scale-y-100": isVisible,
        }
      )}
    >
      <div className="flex flex-col gap-4 py-2">
        <FormField
          label="WHEN DID YOU START YOUR POSTGRADUATE DEGREE?"
          name="mastersStartYear"
        >
          <Field
            className={FIELD_CLASS}
            type="number"
            name="mastersStartYear"
            min="1998"
            max={getYear(new Date()) + 1}
            placeholder="e.g. 2020"
          />
        </FormField>

        <FormField
          label="HOW MANY YEARS DID YOUR POSTGRADUATE DEGREE LAST?"
          name="mastersLength"
        >
          <Field
            className={FIELD_CLASS}
            type="number"
            name="mastersLength"
            min="1"
          />
        </FormField>
      </div>
    </div>
  );
};
