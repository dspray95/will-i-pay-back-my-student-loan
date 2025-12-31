import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import React, { useEffect, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faUndo } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { Button } from "../../../shared/components/Button";
import type { LoanFormValues } from "../../../shared/types";
import { getYear } from "date-fns";
import { getFeesForYear } from "../../../domain/loan/fees";
import { getLoanPlan, LOAN_PLANS } from "../../../domain/loan/plans";
import { useLoanCalculatorStore } from "../../../stores/loanCalculatorStore";

const NumericField: React.FC<{
  name: string;
  label: string;
  isHidden?: boolean;
  defaultValue: number;
  onReset: (fieldName: string) => void;
}> = ({ name, label, isHidden = false, defaultValue, onReset }) => {
  const { values } = useFormikContext<LoanFormValues>();
  const currentValue = (values as any)[name] || 0;
  const hasChanged = currentValue !== defaultValue;

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

  if (isHidden) return <></>;

  return (
    <div className="grid grid-cols-2 gap-1 items-center">
      <label className="text-sm">{label}</label>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-grow">
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-northern-not-black">
            £
          </span>
          <Field
            className="w-full text-district-green pl-6 border-2 rounded-sm border-text-northern-not-black bg-beck-beige p-2"
            type="number"
            name={name}
            onKeyDown={handleNumberKeyDown}
          />
        </div>
        <button
          type="button"
          onClick={() => onReset(name)}
          className={classNames(
            "transition-colors p-1 w-8 h-8 flex items-center justify-center",
            {
              "northern-not-black hover:northern-not-black hover:cursor-pointer":
                hasChanged,
              "text-northern-not-black opacity-50 cursor-not-allowed":
                !hasChanged,
            }
          )}
          title="Reset to estimate"
          disabled={!hasChanged}
        >
          <FontAwesomeIcon icon={faUndo} size="sm" />
        </button>
      </div>
    </div>
  );
};

const LoanFormContent: React.FC = () => {
  const {
    setTotalUndergradLoan,
    setTotalMastersLoan,
    setTotalMaintenanceLoan,
  } = useLoanCalculatorStore();

  const { values, setFieldValue, isSubmitting } =
    useFormikContext<LoanFormValues>();
  const [showPostgradSection, setShowPostgradSection] = useState(false);

  const defaultValues = useMemo(() => {
    if (!values.courseStartYear) return null;

    const fees = getFeesForYear(values.courseStartYear);
    const mastersFees =
      values.postgrad === "yes"
        ? getFeesForYear(values.mastersStartYear)
        : undefined;

    if (!fees) return null;

    return {
      tutionFeeLoan: fees.tuition * values.courseLength,
      maintenanceLoan: fees.maintenanceLoan * values.courseLength,
      maintenanceGrant: fees.maintenanceGrant * values.courseLength,
      mastersTutionFeeLoan: mastersFees
        ? mastersFees.postGraduateLoan * values.mastersLength
        : 0,
    };
  }, [
    values.courseStartYear,
    values.courseLength,
    values.postgrad,
    values.mastersStartYear,
    values.mastersLength,
  ]);

  const [manuallyEdited, setManuallyEdited] = useState<Set<string>>(new Set());

  useEffect(() => {
    const total =
      (values.tutionFeeLoan || 0) +
      (values.maintenanceLoan || 0) +
      (values.mastersTutionFeeLoan || 0);

    setTotalMaintenanceLoan(values.maintenanceLoan || 0);
    setTotalMastersLoan(values.mastersTutionFeeLoan || 0);
    setTotalUndergradLoan(total);
  }, [
    values.tutionFeeLoan,
    values.maintenanceLoan,
    values.mastersTutionFeeLoan,
    values.maintenanceGrant,
    setTotalMaintenanceLoan,
    setTotalMastersLoan,
    setTotalUndergradLoan,
  ]);

  useEffect(() => {
    if (values.courseStartYear && values.country) {
      const suggestedPlan = getLoanPlan(values.courseStartYear, values.country);
      if (suggestedPlan) {
        setFieldValue("loanPlan", suggestedPlan);
      }
    }
  }, [values.courseStartYear, values.country, setFieldValue]);

  useEffect(() => {
    if (defaultValues) {
      if (!manuallyEdited.has("tutionFeeLoan"))
        setFieldValue("tutionFeeLoan", defaultValues.tutionFeeLoan);
      if (!manuallyEdited.has("maintenanceLoan"))
        setFieldValue("maintenanceLoan", defaultValues.maintenanceLoan);
      if (!manuallyEdited.has("maintenanceGrant"))
        setFieldValue("maintenanceGrant", defaultValues.maintenanceGrant);
      if (!manuallyEdited.has("mastersTutionFeeLoan"))
        setFieldValue(
          "mastersTutionFeeLoan",
          defaultValues.mastersTutionFeeLoan
        );
    }
  }, [defaultValues, manuallyEdited, setFieldValue]);

  useEffect(() => {
    setShowPostgradSection(values.postgrad === "yes");
  }, [values.postgrad]);

  const resetFieldToDefault = (fieldName: string) => {
    if (defaultValues) {
      setFieldValue(fieldName, (defaultValues as any)[fieldName]);
      setManuallyEdited((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }
  };

  const handleFieldChange = (fieldName: string) => {
    setManuallyEdited((prev) => new Set(prev).add(fieldName));
  };

  const totalLoan =
    (values.tutionFeeLoan || 0) +
    (values.maintenanceLoan || 0) +
    (values.mastersTutionFeeLoan || 0);
  const totalGrant = values.maintenanceGrant || 0;

  return (
    <Form className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label>what year did you start your undergrad?</label>
        <Field
          className="border-2 rounded-sm border-northern-not-black text-northern-not-black bg-background p-2"
          type="number"
          name="courseStartYear"
          min="1998"
          max={getYear(new Date()) + 1}
          placeholder="e.g. 2020"
        />
        <ErrorMessage
          name="courseStartYear"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div className="flex flex-col">
        <label>how many years did your undergrad last?</label>
        <Field
          className="border-2 rounded-sm border-northern-not-black text-northern-not-black bg-background p-2"
          type="number"
          name="courseLength"
          min="1"
          max="4"
        />
        <ErrorMessage
          name="courseLength"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div className="flex flex-col">
        <label>where did you take your loan?</label>
        <div className="grid grid-cols-2 gap-2">
          {["ENGLAND", "SCOTLAND", "WALES", "NORTHERN_IRELAND"].map(
            (country) => (
              <label
                key={country}
                className={classNames(
                  "flex items-center justify-center p-3 border-2 rounded-sm cursor-pointer transition-colors",
                  {
                    "border-secondary bg-secondary bg-opacity-10":
                      values.country === country,
                    "border-northern-not-black": values.country !== country,
                  }
                )}
              >
                <Field
                  type="radio"
                  name="country"
                  value={country}
                  className="sr-only"
                />
                <span className="text-northern-not-black">
                  {country === "NORTHERN_IRELAND"
                    ? "Northern Ireland"
                    : country.charAt(0) + country.slice(1).toLowerCase()}
                </span>
              </label>
            )
          )}
        </div>
        <ErrorMessage
          name="country"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div className="flex flex-col">
        <label>what loan plan are you on?</label>
        <Field
          className="border-2 rounded-sm border-northern-not-black text-northern-not-black bg-background p-2"
          as="select"
          name="loanPlan"
        >
          <option value="">-- Select --</option>
          {Object.entries(LOAN_PLANS).map(([key, plan]) => (
            <option key={key} value={plan.id}>
              {plan.label}
            </option>
          ))}
        </Field>
      </div>

      <h5
        className="w-full flex item-center justify-center pt-1"
        style={{ color: "var(--color-secondary)" }}
      >
        masters loan?
      </h5>
      <div className="grid grid-cols-2 gap-2">
        {["yes", "no"].map((opt) => (
          <label
            key={opt}
            className={classNames(
              "flex items-center justify-center p-3 border-2 rounded-sm cursor-pointer transition-colors",
              {
                "border-secondary bg-secondary bg-opacity-10":
                  values.postgrad === opt,
                "border-northern-not-black hover:border-secondary":
                  values.postgrad !== opt,
              }
            )}
          >
            <Field
              type="radio"
              name="postgrad"
              value={opt}
              className="sr-only"
            />
            <span className="text-northern-not-black">{opt}</span>
          </label>
        ))}
      </div>

      <div
        className={classNames(
          "transition-all duration-500 ease-in-out overflow-hidden origin-top",
          {
            "max-h-0 scale-y-0": !showPostgradSection,
            "max-h-screen scale-y-100": showPostgradSection,
          }
        )}
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col">
            <label>when did you start your masters?</label>
            <Field
              className="border-2 rounded-sm border-northern-not-black text-northern-not-black bg-background p-2"
              type="number"
              name="mastersStartYear"
              min="1998"
              max={getYear(new Date()) + 1}
              placeholder="e.g. 2020"
            />
          </div>
          <div className="flex flex-col">
            <label>how many years did your masters last?</label>
            <Field
              className="border-2 rounded-sm border-northern-not-black text-northern-not-black bg-background p-2"
              type="number"
              name="mastersLength"
              min="1"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <h5
          className="w-full text-center py-1 border-b border-secondary/20"
          style={{ color: "var(--color-secondary)" }}
        >
          Review Estimates
        </h5>

        <div onChange={() => handleFieldChange("tutionFeeLoan")}>
          <NumericField
            name="tutionFeeLoan"
            label="Tuition Fee Loan"
            defaultValue={defaultValues?.tutionFeeLoan || 0}
            onReset={resetFieldToDefault}
          />
        </div>
        <div onChange={() => handleFieldChange("mastersTutionFeeLoan")}>
          <NumericField
            name="mastersTutionFeeLoan"
            label="Masters Tuition Loan"
            isHidden={!showPostgradSection}
            defaultValue={defaultValues?.mastersTutionFeeLoan || 0}
            onReset={resetFieldToDefault}
          />
        </div>
        <div onChange={() => handleFieldChange("maintenanceLoan")}>
          <NumericField
            name="maintenanceLoan"
            label="Maintenance Loan"
            defaultValue={defaultValues?.maintenanceLoan || 0}
            onReset={resetFieldToDefault}
          />
        </div>
        <div onChange={() => handleFieldChange("maintenanceGrant")}>
          <NumericField
            name="maintenanceGrant"
            label="Maintenance Grant"
            defaultValue={defaultValues?.maintenanceGrant || 0}
            onReset={resetFieldToDefault}
          />
        </div>

        <div className="grid grid-cols-2 gap-1 pt-4 border-t border-northern-not-black/20">
          <label className="font-bold">Total Loan:</label>
          <h5 className="font-bold">£{totalLoan}</h5>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <label>Total Grant:</label>
          <h5 className="text-northern-not-black">
            £{totalGrant} {totalGrant === 0 && " 😢"}
          </h5>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        income <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </Form>
  );
};

export const LoanForm: React.FC = () => {
  const { setLoanFormValues, calculatePrincipalAtGraduation, setStage } =
    useLoanCalculatorStore();

  return (
    <Formik
      initialValues={{
        courseStartYear: 2015,
        courseLength: 3,
        country: "",
        loanPlan: LOAN_PLANS.plan1.id,
        tutionFeeLoan: 0,
        mastersTutionFeeLoan: 0,
        maintenanceLoan: 0,
        maintenanceGrant: 0,
        postgrad: "no",
        mastersLength: 1,
        mastersStartYear: 2018,
      }}
      validate={(values) => {
        const errors: any = {};
        if (!values.courseStartYear) errors.courseStartYear = "Required";
        if (!values.country) errors.country = "Required";
        return errors;
      }}
      onSubmit={async (values, { setSubmitting, validateForm, setTouched }) => {
        const errors = await validateForm(values);

        if (Object.keys(errors).length > 0) {
          const touchedFields: Record<string, boolean> = {};
          Object.keys(errors).forEach((key) => {
            touchedFields[key] = true;
          });
          setTouched(touchedFields);
          setSubmitting(false);
          return;
        }

        setLoanFormValues(values);
        calculatePrincipalAtGraduation(values);
        setStage("income");
        setSubmitting(false);
      }}
    >
      <LoanFormContent />
    </Formik>
  );
};
