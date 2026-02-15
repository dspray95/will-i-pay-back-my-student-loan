import { useState, useMemo, useCallback, useEffect } from "react";
import { useFormikContext } from "formik";
import { getFeesForYear } from "../../../../../domain/loan/fees";
import { getLoanPlan } from "../../../../../domain/loan/plans";
import type { LoanFormValues } from "../../../../../shared/schemas/LoanFormSchema";
export const useLoanFormLogic = () => {
  const { values, setFieldValue } = useFormikContext<LoanFormValues>();
  const [manuallyEdited, setManuallyEdited] = useState<Set<string>>(new Set());

  const defaultValues = useMemo(() => {
    if (
      !values.courseStartYear ||
      values.courseLength === undefined ||
      !values.loanPlan ||
      !values.country
    ) {
      return null;
    }

    const fees = getFeesForYear(values.courseStartYear);
    if (!fees) return null;

    let mastersTutionFeeLoan = 0;
    if (
      values.postgrad === "yes" &&
      values.mastersStartYear !== undefined &&
      values.mastersLength !== undefined
    ) {
      const mastersFees = getFeesForYear(values.mastersStartYear);
      if (mastersFees) {
        mastersTutionFeeLoan =
          mastersFees.postGraduateLoan * values.mastersLength;
      }
    }

    return {
      tutionFeeLoan: fees.tuition * values.courseLength,
      maintenanceLoan: fees.maintenanceLoan * values.courseLength,
      maintenanceGrant: fees.maintenanceGrant * values.courseLength,
      mastersTutionFeeLoan,
    };
  }, [
    values.courseStartYear,
    values.courseLength,
    values.postgrad,
    values.mastersStartYear,
    values.mastersLength,
    values.loanPlan,
    values.country,
  ]);

  // Auto-populate fields whenever defaultValues changes (unless manually edited)
  useEffect(() => {
    if (!defaultValues) return;

    if (!manuallyEdited.has("tutionFeeLoan")) {
      setFieldValue("tutionFeeLoan", defaultValues.tutionFeeLoan);
    }
    if (!manuallyEdited.has("maintenanceLoan")) {
      setFieldValue("maintenanceLoan", defaultValues.maintenanceLoan);
    }
    if (!manuallyEdited.has("maintenanceGrant")) {
      setFieldValue("maintenanceGrant", defaultValues.maintenanceGrant);
    }
    if (!manuallyEdited.has("mastersTutionFeeLoan")) {
      setFieldValue("mastersTutionFeeLoan", defaultValues.mastersTutionFeeLoan);
    }
  }, [defaultValues, manuallyEdited, setFieldValue]);

  // Auto-select loan plan when dependencies change
  useEffect(() => {
    if (values.courseStartYear && values.country) {
      const suggestedPlan = getLoanPlan(values.courseStartYear, values.country);
      if (suggestedPlan) {
        setFieldValue("loanPlan", suggestedPlan);
      }
    }
  }, [values.courseStartYear, values.country, setFieldValue]);

  const showPostgradSection = values.postgrad === "yes";

  const resetFieldToDefault = useCallback(
    (fieldName: string) => {
      if (defaultValues) {
        setFieldValue(fieldName, (defaultValues as any)[fieldName]);
        setManuallyEdited((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldName);
          return newSet;
        });
      }
    },
    [defaultValues, setFieldValue]
  );

  const handleFieldChange = useCallback((fieldName: string) => {
    setManuallyEdited((prev) => new Set(prev).add(fieldName));
  }, []);

  const isFieldEdited = useCallback(
    (fieldName: string) => {
      return manuallyEdited.has(fieldName);
    },
    [manuallyEdited]
  );

  return {
    showPostgradSection,
    defaultValues,
    resetFieldToDefault,
    handleFieldChange,
    isFieldEdited,
  };
};
