import { Formik, Form, Field, useFormikContext } from "formik";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";
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
import { COUNTRY_OPTIONS, FIELD_CLASS, POSTGRAD_OPTIONS } from "./consts";
import {
  LoanFormSchema,
  ValidatedLoanFormSchema,
  type LoanFormValues,
} from "../../../../shared/schemas/LoanFormSchema";
import { Font } from "../../../../shared/components/Text";

const LoanFormContent: React.FC = () => {
  const { values, isSubmitting } = useFormikContext<LoanFormValues>();
  const {
    showPostgradSection,
    defaultValues,
    resetFieldToDefault,
    isFieldEdited,
    handleFieldChange,
  } = useLoanFormLogic();

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
            selectedValue={values.postgrad}
          />
        </FormField>
        <MastersSection isVisible={showPostgradSection} />
      </div>
      <LoanEstimatesSection
        showPostgradSection={showPostgradSection}
        defaultValues={defaultValues}
        totalLoan={totalLoan}
        totalGrant={totalGrant}
        onReset={resetFieldToDefault}
        onFieldChange={handleFieldChange}
        isFieldEdited={isFieldEdited}
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

  return (
    <Formik
      initialValues={{
        courseStartYear: undefined,
        courseLength: undefined,
        country: "",
        loanPlan: undefined,
        tutionFeeLoan: 0,
        mastersTutionFeeLoan: 0,
        maintenanceLoan: 0,
        maintenanceGrant: 0,
        postgrad: undefined,
        mastersLength: undefined,
        mastersStartYear: undefined,
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
      onSubmit={async (values, { setSubmitting, validateForm, setTouched }) => {
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

        // Parse form values
        const result = LoanFormSchema.safeParse(values);
        if (!result.success) {
          setSubmitting(false);
          return;
        }
        const parsedValues = result.data;

        // Calculate and update store totals
        setTotalUndergradLoan(parsedValues.tutionFeeLoan || 0);
        setTotalMaintenanceLoan(parsedValues.maintenanceLoan || 0);
        setTotalMastersLoan(parsedValues.mastersTutionFeeLoan || 0);

        setLoanFormValues(parsedValues);
        calculatePrincipalAtGraduation(parsedValues);
        setStage(STAGES.incomeProjection);
        setSubmitting(false);
      }}
    >
      <LoanFormContent />
    </Formik>
  );
};
