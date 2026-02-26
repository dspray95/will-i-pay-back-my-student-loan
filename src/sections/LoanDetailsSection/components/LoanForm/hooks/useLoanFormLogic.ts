import { useState, useMemo, useCallback, useEffect } from "react";
import { useFormikContext } from "formik";
import { getFeesForYear } from "../../../../../domain/loan/fees";
import { getLoanPlan } from "../../../../../domain/loan/plans";
import type { FeesLoansAndGrants } from "../../../../../domain/loan/types";
import type { LoanFormValues } from "../../../../../shared/schemas/LoanFormSchema";

const getMaintenanceLoanForSituation = (
  fees: FeesLoansAndGrants,
  livingSituation?: string,
): number => {
  if (livingSituation === "home") return fees.maintenanceLoanHome;
  if (livingSituation === "london") return fees.maintenanceLoanLondon;
  return fees.maintenanceLoan;
};

const getPlacementMaintenanceLoanForSituation = (
  fees: FeesLoansAndGrants,
  livingSituation?: string,
): number => {
  if (livingSituation === "home") return fees.placementMaintenanceLoanHome;
  if (livingSituation === "london") return fees.placementMaintenanceLoanLondon;
  return fees.placementMaintenanceLoan;
};

export const useLoanFormLogic = () => {
  const { values, setFieldValue } = useFormikContext<LoanFormValues>();
  const [manuallyEdited, setManuallyEdited] = useState<Set<string>>(new Set());
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  const [yearlyOverrides, setYearlyOverrides] = useState<Record<string, number[]>>({});

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

    const hasPlacement = values.yearInIndustry === "yes" && typeof values.placementYear === "number";
    const studyMaintenanceLoan = getMaintenanceLoanForSituation(fees, values.livingSituation);
    const placementMaintenanceLoan = getPlacementMaintenanceLoanForSituation(fees, values.livingSituation);

    const tutionFeeLoan = hasPlacement
      ? fees.tuition * (values.courseLength - 1) + fees.placementTuition
      : fees.tuition * values.courseLength;
    const maintenanceLoan = hasPlacement
      ? studyMaintenanceLoan * (values.courseLength - 1) + placementMaintenanceLoan
      : studyMaintenanceLoan * values.courseLength;
    const maintenanceGrant = hasPlacement
      ? fees.maintenanceGrant * (values.courseLength - 1) + fees.placementMaintenanceGrant
      : fees.maintenanceGrant * values.courseLength;

    return {
      tutionFeeLoan,
      maintenanceLoan,
      maintenanceGrant,
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
    values.livingSituation,
    values.yearInIndustry,
    values.placementYear,
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

  // Clear yearly overrides when course structure changes
  useEffect(() => {
    setYearlyOverrides({});
    setExpandedFields(new Set());
  }, [values.courseStartYear, values.courseLength, values.yearInIndustry, values.placementYear, values.mastersStartYear, values.mastersLength]);

  const showPostgradSection = values.postgrad === "yes";
  const showYearInIndustrySection = values.yearInIndustry === "yes";

  const computeDefaultYearlyValues = useCallback(
    (fieldName: string, total: number): number[] => {
      const isPostgradField = fieldName === "mastersTutionFeeLoan";
      const yearCount = isPostgradField
        ? (typeof values.mastersLength === "number" ? values.mastersLength : 1)
        : (typeof values.courseLength === "number" ? values.courseLength : 1);

      if (yearCount <= 0) return [];

      // Placement year logic for tuition, maintenance loan, and maintenance grant
      if (
        (fieldName === "tutionFeeLoan" || fieldName === "maintenanceLoan" || fieldName === "maintenanceGrant") &&
        values.yearInIndustry === "yes" &&
        typeof values.placementYear === "number" &&
        typeof values.courseStartYear === "number" &&
        yearCount > 1
      ) {
        const placementIndex = values.placementYear - 1;
        const placementFees = getFeesForYear(values.courseStartYear + placementIndex);

        let placementAmount: number;
        if (fieldName === "tutionFeeLoan") {
          placementAmount = placementFees.placementTuition;
        } else if (fieldName === "maintenanceLoan") {
          placementAmount = getPlacementMaintenanceLoanForSituation(placementFees, values.livingSituation);
        } else {
          placementAmount = placementFees.placementMaintenanceGrant;
        }

        const studyYearAmount = (total - placementAmount) / (yearCount - 1);
        return Array.from({ length: yearCount }, (_, i) =>
          i === placementIndex
            ? Math.round(placementAmount)
            : Math.round(studyYearAmount)
        );
      }

      // Even split for everything else
      const perYear = Math.round(total / yearCount);
      const remainder = total - perYear * yearCount;
      return Array.from({ length: yearCount }, (_, i) =>
        i === yearCount - 1 ? perYear + remainder : perYear
      );
    },
    [values.courseLength, values.mastersLength, values.yearInIndustry, values.placementYear, values.courseStartYear, values.livingSituation]
  );

  const getYearlyValues = useCallback(
    (fieldName: string): number[] => {
      if (yearlyOverrides[fieldName]) {
        return yearlyOverrides[fieldName];
      }
      const total = (values as any)[fieldName] || 0;
      return computeDefaultYearlyValues(fieldName, total);
    },
    [yearlyOverrides, values, computeDefaultYearlyValues]
  );

  const setYearlyValues = useCallback(
    (fieldName: string, newValues: number[]) => {
      setYearlyOverrides((prev) => ({ ...prev, [fieldName]: newValues }));
      const sum = newValues.reduce((a, b) => a + b, 0);
      setFieldValue(fieldName, sum);
      setManuallyEdited((prev) => new Set(prev).add(fieldName));
    },
    [setFieldValue]
  );

  const isFieldExpanded = useCallback(
    (fieldName: string) => expandedFields.has(fieldName),
    [expandedFields]
  );

  const toggleFieldExpanded = useCallback(
    (fieldName: string) => {
      setExpandedFields((prev) => {
        const next = new Set(prev);
        if (next.has(fieldName)) {
          // Collapsing — clear overrides so values redistribute from the total
          next.delete(fieldName);
          setYearlyOverrides((prevOverrides) => {
            const updated = { ...prevOverrides };
            delete updated[fieldName];
            return updated;
          });
        } else {
          // Expanding — seed overrides from current total
          const total = (values as any)[fieldName] || 0;
          const yearly = computeDefaultYearlyValues(fieldName, total);
          setYearlyOverrides((prevOverrides) => ({ ...prevOverrides, [fieldName]: yearly }));
          next.add(fieldName);
        }
        return next;
      });
    },
    [values, computeDefaultYearlyValues]
  );

  const resetFieldToDefault = useCallback(
    (fieldName: string) => {
      if (defaultValues) {
        setFieldValue(fieldName, (defaultValues as any)[fieldName]);
        setManuallyEdited((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldName);
          return newSet;
        });
        // Also collapse and clear overrides
        setExpandedFields((prev) => {
          const next = new Set(prev);
          next.delete(fieldName);
          return next;
        });
        setYearlyOverrides((prev) => {
          const updated = { ...prev };
          delete updated[fieldName];
          return updated;
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
    showYearInIndustrySection,
    defaultValues,
    resetFieldToDefault,
    handleFieldChange,
    isFieldEdited,
    getYearlyValues,
    setYearlyValues,
    isFieldExpanded,
    toggleFieldExpanded,
  };
};
