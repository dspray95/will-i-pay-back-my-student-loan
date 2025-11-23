import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { getLoanPlan } from "../../utils/loanPlan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import {
  getFeesForYear,
  LOAN_PLANS,
  type FeesLoansAndGrants,
  type LoanPlan,
} from "../../data";
import { Button } from "../button/Button";

export type LoanFormValues = {
  courseStartYear: number;
  courseLength: number;
  country: string;
  loanPlan: LoanPlan;
  tutionFeeLoan: number;
  mastersTutionFeeLoan: number;
  maintenanceLoan: number;
  maintenanceGrant: number;
  postgrad: string;
  mastersStartYear: number;
  mastersLength: number;
};

interface LoanFormContentProps {
  setTotalUndergradLoan: (amount: number) => void;
  setTotalMastersLoan: (amount: number) => void;
  setTotalMaintenanceLoan: (amount: number) => void;
  updateFormValues: (values: LoanFormValues) => void;
  setStage: (stage: "loanForm" | "income" | "finish") => void;
}

const LoanFormContent: React.FC<LoanFormContentProps> = ({
  setTotalUndergradLoan,
  setTotalMastersLoan,
  setTotalMaintenanceLoan,
  updateFormValues,
  setStage,
}) => {
  const { values, setFieldValue, isSubmitting } =
    useFormikContext<LoanFormValues>();
  const [showPostgradSection, setShowPostgradSection] = useState(false);
  const [totalUndergradLoanAmount, setTotalUndergradLoanAmount] =
    useState<number>(0);
  const [totalGrantAmount, setTotalGrantAmount] = useState<number>(0);

  const updateGrantAndLoanFields = (
    fees: FeesLoansAndGrants,
    mastersFees: FeesLoansAndGrants | undefined
  ) => {
    const totalTuitionLoan = fees.tuition * values.courseLength;
    const totalMastersLoan = mastersFees
      ? mastersFees.postGraduateLoan * values.mastersLength
      : 0;
    const totalMaintenanceLoan = fees.maintenanceLoan * values.courseLength;
    const totalMaintenanceGrant = fees.maintenanceGrant * values.courseLength;

    setFieldValue("tutionFeeLoan", fees.tuition * values.courseLength);
    setFieldValue("maintenanceLoan", totalMaintenanceLoan);
    setFieldValue("maintenanceGrant", totalMaintenanceGrant);
    setFieldValue("mastersTutionFeeLoan", totalMastersLoan);
    setTotalMaintenanceLoan(totalMaintenanceLoan);
    setTotalMastersLoan(totalMastersLoan);
    const totalLoan =
      totalTuitionLoan + totalMaintenanceLoan + totalMastersLoan;
    setTotalUndergradLoan(totalLoan);
    setTotalUndergradLoanAmount(totalLoan);
    setTotalGrantAmount(totalMaintenanceGrant);
  };

  /* Set loan plan by start year and country */
  useEffect(() => {
    if (values.courseStartYear && values.country) {
      const suggestedPlan = getLoanPlan(values.courseStartYear, values.country);
      if (suggestedPlan) {
        setFieldValue("loanPlan", suggestedPlan);
      }
    }
  }, [values.courseStartYear, values.country, setFieldValue]);

  /* Set loan amount to maximum available by year */
  useEffect(() => {
    if (values.courseStartYear) {
      const fees = getFeesForYear(values.courseStartYear);
      let mastersFees;
      if (values.postgrad === "yes") {
        mastersFees = getFeesForYear(values.mastersStartYear);
      }
      if (fees) {
        updateGrantAndLoanFields(fees, mastersFees);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    values.courseStartYear,
    values.courseLength,
    values.postgrad,
    values.mastersStartYear,
    values.mastersLength,
    setFieldValue,
  ]);

  useEffect(() => {
    setShowPostgradSection(values.postgrad === "yes");
  }, [values.postgrad]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateFormValues(values);
    setStage("income");
  };

  return (
    <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {/** Undergrad */}
      <div className="flex flex-col">
        <label>what year did you start your undergrad?</label>
        <Field
          className="border-2 rounded-sm border-text-muted text-text-primary bg-background p-2"
          type="number"
          name="courseStartYear"
          min="1998"
          max="2030"
          placeholder="e.g. 2020"
        />
        <ErrorMessage
          name="courseStartYear"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>
      {/** Course length */}
      <div className="flex flex-col">
        <label>how many years did your undergrad last?</label>
        <Field
          className="border-2 rounded-sm border-text-muted text-text-primary bg-background p-2"
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
      {/** Country */}
      <div className="flex flex-col">
        <label>where did you take your loan?</label>
        <div className="grid grid-cols-2 gap-2">
          {["ENGLAND", "SCOTLAND", "WALES", "NORTHERN_IRELAND"].map(
            (country) => (
              <label
                key={country}
                className={`flex items-center justify-center p-3 border-2 rounded-sm cursor-pointer transition-colors ${
                  values.country === country
                    ? "border-secondary bg-secondary bg-opacity-10"
                    : "border-text-muted hover:border-secondary"
                }`}
              >
                <Field
                  type="radio"
                  name="country"
                  value={country}
                  className="sr-only"
                />
                <span className="text-text-primary">
                  {country === "NORTHERN_IRELAND"
                    ? "Northern Ireland"
                    : country.charAt(0) + country.slice(1).toLowerCase()}
                </span>
              </label>
            )
          )}
        </div>
      </div>
      {/** Loan Plan */}
      <div className="flex flex-col">
        <label>what loan plan are you on?</label>
        <Field
          className="border-2 rounded-sm border-text-muted text-text-primary bg-background p-2"
          as="select"
          id="loanPlan"
          name="loanPlan"
        >
          <option value="">-- Select --</option>
          {Object.entries(LOAN_PLANS).map(([key, plan]) => (
            <option key={key} value={plan.id}>
              {plan.label}
            </option>
          ))}
        </Field>
        <ErrorMessage
          name="loanPlan"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>
      {/** Masters */}
      <h5
        className="w-full flex item-center justify-center pt-1"
        style={{ color: "var(--color-secondary)" }}
      >
        masters loan?
      </h5>
      <div className="grid grid-cols-2 gap-2">
        <label
          className={`flex items-center justify-center p-3 border-2 rounded-sm cursor-pointer transition-colors ${
            values.postgrad === "yes"
              ? "border-secondary bg-secondary bg-opacity-10"
              : "border-text-muted hover:border-secondary"
          }`}
        >
          <Field type="radio" name="postgrad" value="yes" className="sr-only" />
          <span className="text-text-primary">yes</span>
        </label>
        <label
          className={`flex items-center justify-center p-3 border-2 rounded-sm cursor-pointer transition-colors ${
            values.postgrad === "no"
              ? "border-secondary bg-secondary bg-opacity-10"
              : "border-text-muted hover:border-secondary"
          }`}
        >
          <Field type="radio" name="postgrad" value="no" className="sr-only" />
          <span className="text-text-primary">no</span>
        </label>
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
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label>when did you start your masters?</label>
            <Field
              className="border-2 rounded-sm border-text-muted text-text-primary bg-background p-2"
              type="number"
              name="mastersStartYear"
              min="1998"
              max="2030"
              placeholder="e.g. 2020"
            />
            <ErrorMessage
              name="mastersStartYear"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="flex flex-col">
            <label>how many years did your masters last?</label>
            <Field
              className="border-2 rounded-sm border-text-muted text-text-primary bg-background p-2"
              type="number"
              name="mastersLength"
              min="1"
              max="4"
            />
            <ErrorMessage
              name="mastersLength"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
        </div>
      </div>
      {/** Totals */}
      <div className="flex flex-col gap-1">
        <h5
          className="w-full flex item-center justify-center py-1"
          style={{ color: "var(--color-secondary)" }}
        >
          grant and loan
        </h5>
        <div className="grid grid-cols-2 gap-1">
          <label>tuition fee loan: </label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-text-primary">
              £
            </span>
            <Field
              className="text-heading-secondary pl-6 border-2 rounded-sm border-text-muted bg-background p-2"
              type="number"
              name="tutionFeeLoan"
              placeholder="0"
              disabled
            />
          </div>
          <ErrorMessage
            name="tutionFeeLoan"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>
        <div
          className={classNames(
            "grid grid-cols-2 gap-1",
            "overflow-hidden origin-top transition-all duration-500",
            {
              "max-h-0 scale-y-0": !showPostgradSection,
              "max-h-screen scale-y-100": showPostgradSection,
            }
          )}
        >
          <label>masters tuition fee loan: </label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-text-primary">
              £
            </span>
            <Field
              className="text-heading-secondary pl-6 border-2 rounded-sm border-text-muted bg-background p-2"
              type="number"
              name="mastersTutionFeeLoan"
              placeholder="0"
              disabled
            />
          </div>
          <ErrorMessage
            name="mastersTutionFeeLoan"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-1">
          <label>maintenance loan: </label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-text-primary">
              £
            </span>
            <Field
              className="text-heading-secondary pl-6 border-2 rounded-sm border-text-muted bg-background p-2"
              type="number"
              name="maintenanceLoan"
              min="0"
              placeholder="0"
              disabled
            />
          </div>
          <ErrorMessage
            name="maintenanceLoan"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-1">
          <label>maintenance grant: </label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-text-primary">
              £
            </span>
            <Field
              className="text-heading-secondary pl-6 border-2 rounded-sm border-text-muted bg-background p-2"
              type="number"
              name="maintenanceGrant"
              min="0"
              placeholder="0"
              disabled
            />
          </div>
          <ErrorMessage
            name="maintenanceGrant"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-1 pt-2">
          <label>total loan (pre-interest): </label>
          <h5>£{totalUndergradLoanAmount}</h5>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <label>total grant: </label>
          <h5
            style={{ color: "var(--color-text-secondary)" }}
            className="text-text-secondary"
          >
            {`£${totalGrantAmount} ${(totalGrantAmount === 0 && " 😢") || ""}`}
          </h5>
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        income <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </Form>
  );
};

export const LoanForm: React.FC<{
  setTotalUndergradLoan: (amount: number) => void;
  setTotalMastersLoan: (amount: number) => void;
  setTotalMaintenanceLoan: (amount: number) => void;
  updateFormValues: (values: LoanFormValues) => void;
  setStage: (stage: "loanForm" | "income" | "finish") => void;
}> = ({
  setTotalUndergradLoan,
  setTotalMastersLoan,
  setTotalMaintenanceLoan,
  updateFormValues,
  setStage,
}) => {
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
        postgrad: "",
        mastersLength: 1,
        mastersStartYear: 2018,
      }}
      validate={(values) => {
        const errors: { [key: string]: string } = {};

        if (!values.courseStartYear) {
          errors.courseStartYear = "This field is required.";
        }
        if (!values.courseLength) {
          errors.courseLength = "This field is required.";
        }
        if (!values.country) {
          errors.country = "Please select a country.";
        }
        if (!values.loanPlan) {
          errors.loanPlan = "Please select a loan plan.";
        }

        if (values.postgrad === "yes") {
          if (!values.mastersStartYear) {
            errors.mastersStartYear = "This field is required.";
          }
          if (!values.mastersLength) {
            errors.mastersLength = "This field is required.";
          }
        }

        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        updateFormValues(values);
        setStage("income");
        setTimeout(() => {
          setSubmitting(false);
        }, 400);
      }}
    >
      <LoanFormContent
        setTotalUndergradLoan={setTotalUndergradLoan}
        setTotalMastersLoan={setTotalMastersLoan}
        setTotalMaintenanceLoan={setTotalMaintenanceLoan}
        updateFormValues={updateFormValues}
        setStage={setStage}
      />
    </Formik>
  );
};
