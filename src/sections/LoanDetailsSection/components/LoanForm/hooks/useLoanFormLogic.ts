import { useEffect, useState, useMemo } from "react";
import { useFormikContext } from "formik";
import type { LoanFormValues } from "../../../../../shared/types";
import { useLoanCalculatorStore } from "../../../../../stores/loanCalculatorStore";
import { getFeesForYear } from "../../../../../domain/loan/fees";
import { getLoanPlan } from "../../../../../domain/loan/plans";

export const useLoanFormLogic = () => {
  const { values, setFieldValue } = useFormikContext<LoanFormValues>();
  const [showPostgradSection, setShowPostgradSection] = useState(false);
  const [manuallyEdited, setManuallyEdited] = useState<Set<string>>(new Set());

  const {
    setTotalUndergradLoan,
    setTotalMastersLoan,
    setTotalMaintenanceLoan,
  } = useLoanCalculatorStore();

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

  // Update store totals
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
    setTotalMaintenanceLoan,
    setTotalMastersLoan,
    setTotalUndergradLoan,
  ]);

  // Auto-select loan plan
  useEffect(() => {
    if (values.courseStartYear && values.country) {
      const suggestedPlan = getLoanPlan(values.courseStartYear, values.country);
      if (suggestedPlan) {
        setFieldValue("loanPlan", suggestedPlan);
      }
    }
  }, [values.courseStartYear, values.country, setFieldValue]);

  // Update default values
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

  // Toggle masters section
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

  return {
    showPostgradSection,
    defaultValues,
    resetFieldToDefault,
    handleFieldChange,
  };
};
