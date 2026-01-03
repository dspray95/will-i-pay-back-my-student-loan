// LoanForm.tsx
import { Formik, Form, Field, useFormikContext } from "formik";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { getYear } from "date-fns";
import type { LoanFormValues } from "../../../../shared/types";
import { useLoanFormLogic } from "./hooks/useLoanFormLogic";
import { FormField } from "./components/FormField";
import { RadioButtonGroup } from "./components/RadioButtonGroup";
import { LOAN_PLANS } from "../../../../domain/loan/plans";
import { MastersSection } from "./components/MastersSection";
import { LoanEstimatesSection } from "./components/LoanEstimateSection";
import { Button } from "../../../../shared/components/Button";
import { useLoanCalculatorStore } from "../../../../stores/loanCalculatorStore";
import { STAGES } from "../../../../shared/constants/stages";
import { COUNTRY_OPTIONS, FIELD_CLASS, POSTGRAD_OPTIONS } from "./consts";

const LoanFormContent: React.FC = () => {
  const { values, isSubmitting } = useFormikContext<LoanFormValues>();
  const {
    showPostgradSection,
    defaultValues,
    resetFieldToDefault,
    handleFieldChange,
  } = useLoanFormLogic();

  const totalLoan =
    (values.tutionFeeLoan || 0) +
    (values.maintenanceLoan || 0) +
    (values.mastersTutionFeeLoan || 0);
  const totalGrant = values.maintenanceGrant || 0;

  return (
    <Form className="flex flex-col gap-4">
      <span className="text-piccadilly-blue text-xl">UNDERGRADUATE</span>

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

      <FormField label="WHERE DID YOU TAKE OYUR LOAN?" name="country">
        <RadioButtonGroup
          name="country"
          options={COUNTRY_OPTIONS}
          selectedValue={values.country}
          columns={2}
        />
      </FormField>

      <FormField label="YOUR LOAN PLAN">
        <Field className={FIELD_CLASS} as="select" name="loanPlan">
          <option value="">-- Select --</option>
          {Object.entries(LOAN_PLANS).map(([key, plan]) => (
            <option key={key} value={plan.id}>
              {plan.label}
            </option>
          ))}
        </Field>
      </FormField>

      <div>
        <span className="w-full flex pt-1">
          DID YOU TAKE A POST-GRADUATE LOAN?
        </span>
        <RadioButtonGroup
          name="postgrad"
          options={POSTGRAD_OPTIONS}
          selectedValue={values.postgrad}
        />
      </div>
      <MastersSection isVisible={showPostgradSection} />

      <LoanEstimatesSection
        showPostgradSection={showPostgradSection}
        defaultValues={defaultValues}
        totalLoan={totalLoan}
        totalGrant={totalGrant}
        onFieldChange={handleFieldChange}
        onReset={resetFieldToDefault}
      />

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
        setStage(STAGES.incomeProjection);
        setSubmitting(false);
      }}
    >
      <LoanFormContent />
    </Formik>
  );
};
