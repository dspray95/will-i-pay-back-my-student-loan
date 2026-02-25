import {
  Formik,
  Form,
  Field,
  useFormikContext,
  type FormikHelpers,
} from "formik";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { getYear } from "date-fns";

import { useLoanFormLogic } from "./hooks/useLoanFormLogic";
import { FormField } from "./components/FormField";
import { FormikRadioButtonGrid } from "./components/FormikRadioButtonGroup";
import { LOAN_PLANS } from "../../../../domain/loan/plans";
import { MastersSection } from "./components/MastersSection";
import { LoanEstimatesSection } from "./components/LoanEstimateSection";
import { Button } from "../../../../shared/components/Button";
import { useLoanCalculatorStore } from "../../../../stores/loanCalculatorStore";
import { STAGES } from "../../../../shared/constants/stages";
import {
  COUNTRY_OPTIONS,
  FIELD_CLASS,
  POSTGRAD_OPTIONS,
  YEAR_IN_INDUSTRY_OPTIONS,
} from "./consts";
import {
  LoanFormSchema,
  ValidatedLoanFormSchema,
  type LoanFormInput,
} from "../../../../shared/schemas/LoanFormSchema";
import { Font } from "../../../../shared/components/Text";

const processLoanFormValues = (
  values: LoanFormInput,
  {
    setTotalUndergradLoan,
    setTotalMaintenanceLoan,
    setTotalMastersLoan,
    setLoanFormValues,
    calculatePrincipalAtGraduation,
  }: {
    setTotalUndergradLoan: (amount: number) => void;
    setTotalMaintenanceLoan: (amount: number) => void;
    setTotalMastersLoan: (amount: number) => void;
    setLoanFormValues: (values: LoanFormInput) => void;
    calculatePrincipalAtGraduation: (values: LoanFormInput) => void;
  },
) => {
  const result = LoanFormSchema.safeParse(values);
  if (!result.success) return;
  const parsedValues = result.data;

  const hasPostgrad = parsedValues.postgrad === "yes";
  setTotalUndergradLoan(parsedValues.tutionFeeLoan || 0);
  setTotalMaintenanceLoan(parsedValues.maintenanceLoan || 0);
  setTotalMastersLoan(hasPostgrad ? parsedValues.mastersTutionFeeLoan || 0 : 0);

  setLoanFormValues(parsedValues);
  calculatePrincipalAtGraduation(parsedValues);
};

const LoanFormContent: React.FC = () => {
  const { values, isSubmitting } = useFormikContext<LoanFormInput>();
  const {
    showPostgradSection,
    showYearInIndustrySection,
    defaultValues,
    resetFieldToDefault,
    isFieldEdited,
    handleFieldChange,
    getYearlyValues,
    setYearlyValues,
    isFieldExpanded,
    toggleFieldExpanded,
  } = useLoanFormLogic();

  const {
    stage,
    setStage,
    setLoanFormValues,
    calculatePrincipalAtGraduation,
    setTotalUndergradLoan,
    setTotalMastersLoan,
    setTotalMaintenanceLoan,
  } = useLoanCalculatorStore();

  // When the user comes back and changes values, automatically
  // reprocess them so they don't need to re-click submit
  useEffect(() => {
    if (stage < STAGES.incomeProjection) return;
    processLoanFormValues(values, {
      setTotalUndergradLoan,
      setTotalMaintenanceLoan,
      setTotalMastersLoan,
      setLoanFormValues,
      calculatePrincipalAtGraduation,
    });
    setStage(STAGES.incomeProjection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const totalLoan =
    (values.tutionFeeLoan || 0) +
    (values.maintenanceLoan || 0) +
    (values.mastersTutionFeeLoan || 0);
  const totalGrant = values.maintenanceGrant || 0;

  return (
    <Form className="flex flex-col gap-4">
      <Font.H2>UNDERGRADUATE</Font.H2>

      <FormField
        label="WHAT YEAR DID YOU START YOUR UNDERGRADUATE DEGREE?"
        name="courseStartYear"
      >
        <Field
          className={FIELD_CLASS}
          type="number"
          name="courseStartYear"
          min="1998"
          max={getYear(new Date()) + 1}
          placeholder="e.g. 2020"
        />
      </FormField>

      <FormField
        label="HOW MANY YEARS DID YOUR UNDERGRADUATE DEGREE LAST?"
        name="courseLength"
      >
        <Field
          className={FIELD_CLASS}
          type="number"
          name="courseLength"
          min="1"
          max="4"
        />
      </FormField>

      <FormField label="WHERE DID YOU TAKE YOUR LOAN?" name="country">
        <FormikRadioButtonGrid
          name="country"
          options={COUNTRY_OPTIONS}
          selectedValue={values.country}
          columns={2}
        />
      </FormField>

      <FormField label="YOUR LOAN PLAN" name="loanPlan">
        <Field className={FIELD_CLASS} as="select" name="loanPlan">
          <option value="">-- Select --</option>
          {Object.entries(LOAN_PLANS).map(([key, plan]) => (
            <option key={key} value={plan.id}>
              {plan.label}
            </option>
          ))}
        </Field>
      </FormField>
      <div className="pt-6">
        <Font.H2 className="pb-3">POSTGRADUATE</Font.H2>
        <FormField label="DID YOU TAKE A POST-GRADUATE LOAN?" name="postgrad">
          <FormikRadioButtonGrid
            name="postgrad"
            options={POSTGRAD_OPTIONS}
            selectedValue={values.postgrad ?? ""}
          />
        </FormField>
        <MastersSection isVisible={showPostgradSection} />
      </div>
      <div className="pt-6">
        <Font.H2 className="pb-3">YEAR IN INDUSTRY</Font.H2>
        <FormField
          label="DID YOU TAKE A YEAR IN INDUSTRY OR PLACEMENT YEAR?"
          name="yearInIndustry"
        >
          <FormikRadioButtonGrid
            name="yearInIndustry"
            options={YEAR_IN_INDUSTRY_OPTIONS}
            selectedValue={values.yearInIndustry ?? ""}
          />
        </FormField>
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden origin-top ${
            showYearInIndustrySection
              ? "max-h-screen scale-y-100 mt-4"
              : "max-h-0 scale-y-0"
          }`}
        >
          <FormField
            label="WHICH YEAR OF YOUR COURSE WAS YOUR PLACEMENT?"
            name="placementYear"
          >
            <Field
              className={FIELD_CLASS}
              type="number"
              name="placementYear"
              min="1"
              max={values.courseLength || 4}
              placeholder="e.g. 3"
            />
          </FormField>
        </div>
      </div>
      <LoanEstimatesSection
        showPostgradSection={showPostgradSection}
        defaultValues={defaultValues}
        totalLoan={totalLoan}
        totalGrant={totalGrant}
        onReset={resetFieldToDefault}
        onFieldChange={handleFieldChange}
        isFieldEdited={isFieldEdited}
        courseLength={typeof values.courseLength === "number" ? values.courseLength : 0}
        courseStartYear={typeof values.courseStartYear === "number" ? values.courseStartYear : 0}
        mastersLength={typeof values.mastersLength === "number" ? values.mastersLength : undefined}
        mastersStartYear={typeof values.mastersStartYear === "number" ? values.mastersStartYear : undefined}
        getYearlyValues={getYearlyValues}
        setYearlyValues={setYearlyValues}
        isFieldExpanded={isFieldExpanded}
        toggleFieldExpanded={toggleFieldExpanded}
      />

      <Button type="submit" disabled={isSubmitting}>
        <Font.Body className="text-beck-beige text-2xl pt-1">NEXT</Font.Body>
        <FontAwesomeIcon className="text-base" icon={faArrowDown} />
      </Button>
    </Form>
  );
};

export const LoanForm: React.FC = () => {
  const {
    setLoanFormValues,
    calculatePrincipalAtGraduation,
    setStage,
    setTotalUndergradLoan,
    setTotalMastersLoan,
    setTotalMaintenanceLoan,
  } = useLoanCalculatorStore();

  const handleSubmit = async (
    values: LoanFormInput,
    { setSubmitting, validateForm, setTouched }: FormikHelpers<LoanFormInput>,
  ) => {
    // Error handling
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

    processLoanFormValues(values, {
      setTotalUndergradLoan,
      setTotalMaintenanceLoan,
      setTotalMastersLoan,
      setLoanFormValues,
      calculatePrincipalAtGraduation,
    });

    setStage(STAGES.incomeProjection);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        courseStartYear: "",
        courseLength: "",
        country: "",
        loanPlan: "",
        tutionFeeLoan: 0,
        mastersTutionFeeLoan: 0,
        maintenanceLoan: 0,
        maintenanceGrant: 0,
        postgrad: "",
        mastersLength: "",
        mastersStartYear: "",
        yearInIndustry: "",
        placementYear: "",
      }}
      validate={(values) => {
        const result = ValidatedLoanFormSchema.safeParse(values);

        if (!result.success) {
          const errors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            if (issue.path.length > 0) {
              errors[issue.path[0] as string] = issue.message;
            }
          });
          return errors;
        }

        return {};
      }}
      onSubmit={handleSubmit}
    >
      <LoanFormContent />
    </Formik>
  );
};
