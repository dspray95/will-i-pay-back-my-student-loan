import { ErrorMessage } from "formik";
import React from "react";
import { Font } from "../../../../../shared/components/Text";

interface FormFieldProps {
  label?: string;
  name?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  children,
}) => {
  return (
    <div className="flex flex-col">
      {label && <Font.Label>{label}</Font.Label>}
      {children}
      {name && (
        <ErrorMessage
          name={name}
          component="div"
          className="text-central-red text-sm mt-1"
        />
      )}
    </div>
  );
};
